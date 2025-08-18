import 'server-only'
import fsS from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { pipeline } from 'node:stream/promises';
import StreamZip from 'node-stream-zip';
import { atomicOperation } from './components/atomic-operation';
import { parse as parseYaml } from 'yaml';
import { type WinGetApp } from '@/lib/type';
import { ReadableStream } from 'node:stream/web'

const REPO = 'winget-pkgs';
const BRANCH = 'master';                         // or main
const URL = `https://api.github.com/repos/microsoft/${REPO}/zipball/${BRANCH}`;
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'winget');
export const DEST_DIR = path.join(PUBLIC_DIR, REPO);


// Startup-specific version that bypasses atomic operation for faster initialization
export async function downloadAndExtractAndLoadWingetRepoForStartup(): Promise<WinGetApp[] | null> {
	console.log('[startup] Starting WinGet repository download and extraction...');
	console.time('[startup] Total downloading & extracting & loading took');
	
	try {
		await reallyDownloadAndExtractWingetRepo();
		console.log('[startup] Loading winget-pkgs manifests files...');
		console.time('[startup] Loading apps took');
		const apps = await loadWinGetApps();
		console.timeEnd('[startup] Loading apps took');
		console.log('[startup] Done Loading', apps.length, 'winget-pkgs manifests files');
		console.timeEnd('[startup] Total downloading & extracting & loading took');
		return apps;
	} catch (error) {
		console.error('[startup] Error in downloadAndExtractAndLoadWingetRepoForStartup:', error);
		return null;
	}
}

async function reallyDownloadAndExtractWingetRepo() {
	try {
		if (await fs.access(DEST_DIR).then(() => true).catch(() => false)) {
			if (process.env.NODE_ENV === 'development') {
				console.log("[winget] repo already exists, skipping download and extraction on development mode");
				return;
			} else { // Repo shouldn't exist in production mode. Either downloading it (which mean atomic operation is running) or exists at PUBLIC_DIR which is not the case here.
				console.error("Unexpected code execution context reached! This error should never reached! Error Code: 49238");
			}
		}
		console.log('[winget] Start downloading ' + URL + ' repo.');

		await fs.mkdir(PUBLIC_DIR, { recursive: true }); // in case /public is missing

		console.time('[winget] Downloading took');
		const res = await fetch(URL, {
			headers: {
				'User-Agent': 'nextjs-app',
			},
			redirect: 'follow', // the API answers 302 first
			cache: 'no-store'
		});

		if (!res.ok) {
			console.error(`[Winget] GitHub responded with error:`, {
				status: res.status,
				statusText: res.statusText,
				headers: Object.fromEntries(res.headers.entries()),
				url: res.url
			});
			return;
		} else console.log('[Winget] GitHub responded - OK');

		const tmpZip = path.join(tmpdir(), `${REPO}.zip`);
		if (res.body == null) {
			console.error('[Winget] GitHub respond body is null');
			return;
		}
		console.log('[winget] Downloading the Winget packages zip folder...');
		await pipeline(res.body as unknown as ReadableStream, fsS.createWriteStream(tmpZip));
		console.timeEnd('[winget] Downloading took');
		console.log('[winget] Done Downloading the zip folder');

		console.log('[winget] Extracting the zip folder using node-stream-zip...');
		console.time('[winget] Extracting took');
		const zip = new StreamZip.async({ file: tmpZip, storeEntries: true });
		await zip.extract(null, PUBLIC_DIR);
		await zip.close();
		console.timeEnd('[winget] Extracting took');
		console.log('[winget] Done Extracting the zip folder');

		console.log('[winget] Renaming the extracted zip folder...');
		console.time('[winget] Renaming took');
		const extractedRoot = (await fs
			.readdir(PUBLIC_DIR))
			.find((d) => d.startsWith(`microsoft-${REPO}`));
		if (extractedRoot) {
			await fs.rename(
				path.join(PUBLIC_DIR, extractedRoot),
				DEST_DIR,
			);
			console.log('[winget] Done renaming the extracted folder to `' + DEST_DIR + '`')
			console.timeEnd('[winget] Renaming took');
		}
		else {
			console.error('[winget] could not find the extracted folder!');
			await fs.unlink(tmpZip);
			return;
		}

		try {
			console.log('[winget] Deleting the zip folder...');
			console.time('[winget] Deleting took');
			await fs.unlink(tmpZip);
		} catch (e: any) {
			console.error('[winget] while deleting the zip folder! Error Message: ' + e?.message)
			console.log('[winget] Done Deleting the zip folder');
		}
		console.timeEnd('[winget] Deleting took');
		console.log('[winget] winget packages are ready at public/winget/winget-pkgs');


	} catch (e: Error | any) {
		console.error('[winget] something went wrong! Full error:', {
			error: e,
			message: e?.message,
			stack: e?.stack,
			url: URL,
			destDir: DEST_DIR,
			publicDir: PUBLIC_DIR
		});
	}


}

/**
 * Compare two dotted version strings of arbitrary length (e.g. "1.2.3", "114.0.5735.134").
 * Returns 1 if `a` > `b`, -1 if `a` < `b`, 0 if equal (when trimmed of trailing zeros).
 */
function compareVersion(a: string | undefined, b: string | undefined): number {
	const pa = a?.toString().split('.').map(n => parseInt(n, 10)) ?? [];
	const pb = b?.toString().split('.').map(n => parseInt(n, 10)) ?? [];
	const len = Math.max(pa?.length ?? 0, pb?.length ?? 0);
	for (let i = 0; i < len; i++) {
		const na = pa[i] ?? 0;
		const nb = pb[i] ?? 0;
		if (na > nb) return 1;
		if (na < nb) return -1;
	}
	return 0;
}

/**
 * Load all packages from a cloned **winget-pkgs** repository.
 *
 * @param repoRoot absolute path to `<winget-pkgs>/`
 * @returns array of WinGetApp (latest version per PackageIdentifier)
 */
// Updated loadWinGetApps to batch and parallelize file reads and parsing for performance improvements
async function loadWinGetApps(): Promise<WinGetApp[]> {
	const manifestsDir = path.join(DEST_DIR, 'manifests');
	const files: string[] = [];
	// Gather all relevant yaml file paths
	for await (const file of walk(manifestsDir)) {
		const lf = file.toLowerCase();
		if (!(lf.endsWith('.yaml') || lf.endsWith('.yml'))) continue;
		if (!/\.locale\.en-us\.ya?ml$/i.test(lf)) continue;
		files.push(file);
	}

	const latest = new Map<string, WinGetApp>();
	const concurrency = 100; // limit concurrent file I/O to avoid resource exhaustion

	// helper to process a single file
	const processFile = async (file: string) => {
		try {
			const raw = await fs.readFile(file, 'utf8');
			const manifest: any = parseYaml(raw);
			const id = manifest.PackageIdentifier ?? manifest.Id;
			const version = manifest.PackageVersion ?? manifest.Version;
			const name = manifest.PackageName ?? manifest.Name ?? manifest.Moniker;
			const desc = manifest.ShortDescription ?? manifest.Description;
			const publisher = manifest.Publisher ?? manifest.Author;
			if (!id || !version || !name || !desc || !publisher) {
				console.warn('[winget-loading] Skipping "' + file + '" manifest file; missing required fields:', {
					id, version, name, desc, publisher
				})
				return null;
			}
			return { manifest, id, version, name, desc, publisher };
		} catch {
			console.warn('[winget-loading] Skipping "' + file + '" yaml file; An exception occurred while parsing it, ignoring it and continuing...');
			return null;
		}
	};

	// Process in batches for controlled parallelism
	for (let i = 0; i < files.length; i += concurrency) {
		const batch = files.slice(i, i + concurrency);
		const results = await Promise.all(batch.map(processFile));
		for (const res of results) {
			if (!res) continue;
			const { manifest, id, version, name, desc, publisher } = res;
			const current = latest.get(id);
			if (current && compareVersion(current.version, version) >= 0) {
				// many are skipped, so we don't log them all
				// console.log("[winget-loading] Skipping " + id + " : v" + version + ' (already have v' + current.version + ')');
				continue;
			}
			if (!latest.has(id))
				console.log("[winget-loading] Adding " + (latest.size + 1) + ' App: ' + (id) + ' : v' + version);

			const installers = Array.isArray(manifest.Installers) ? manifest.Installers : [];
			const firstInst = installers[0] ?? {};
			latest.set(id, {
				id,
				name,
				version,
				shortDescription: desc,
				publisher,
				verifiedSilence: false,
				tags: Array.isArray(manifest.Tags) ? manifest.Tags : [],
				description: manifest.Description ?? undefined,
				publisherUrl: manifest.PublisherUrl ?? undefined,
				releaseDate: manifest.ReleaseDate ? new Date(manifest.ReleaseDate) : undefined,
				moniker: manifest.Moniker ?? undefined,
				packageUrl: manifest.PackageUrl ?? manifest.Homepage ?? undefined,
				supportUrl: manifest.SupportUrl ?? manifest.PublisherSupportUrl ?? undefined,
				license: manifest.License ?? undefined,
				licenseUrl: manifest.LicenseUrl ?? undefined,
				copyright: manifest.Copyright ?? undefined,
				copyrightUrl: manifest.CopyrightUrl ?? undefined,
				installerType: firstInst.InstallerType ?? undefined,
				installerSize: firstInst.InstallerSize ?? manifest.PackageSize ?? undefined,
				downloadUrl: firstInst.InstallerUrl ?? undefined,
				productCode: firstInst.ProductCode ?? undefined,
			});
		}
	}

	return [...latest.values()];
}


/**
 * Recursively walks a directory and yields *file paths*.
 */
async function* walk(dir: string): AsyncGenerator<string> {
	for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
		const abs = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			yield* walk(abs);
		} else if (entry.isFile()) {
			yield abs;
		}
	}
}