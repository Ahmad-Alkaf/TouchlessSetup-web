import 'server-only'
import fs from 'node:fs/promises';
import path from 'node:path';
import { atomicOperation } from '../../actions/components/atomic-operation';
import { parse as parseYaml } from 'yaml';
import { type WinGetApp } from '@/lib/type';
import { downloadAndExtractGitHubRepo } from './github-repo-downloader';

const REPO = 'winget-pkgs';
const BRANCH = 'master';
const OWNER = 'microsoft';
const PRIVATE_DIR = path.join(process.cwd(), 'private', 'winget');
const DEST_DIR = path.join(PRIVATE_DIR, REPO);


// Startup-specific version that bypasses atomic operation for faster initialization
export async function downloadAndExtractAndLoadWingetRepoForStartup(): Promise<WinGetApp[] | null> {
	console.log('[winget-startup] Starting WinGet repository download and extraction...');
	console.time('[winget-startup] Total downloading & extracting & loading took');

	try {
		await reallyDownloadAndExtractWingetRepo();
		console.log('[winget-startup] Loading winget-pkgs manifests files...');
		console.time('[winget-startup] Loading apps took');
		const apps = await loadWinGetApps();
		console.timeEnd('[winget-startup] Loading apps took');
		console.log('[winget-startup] Done Loading', apps.length, 'winget-pkgs manifests files');
		console.timeEnd('[winget-startup] Total downloading & extracting & loading took');
		return apps;
	} catch (error) {
		console.error('[winget-startup] Error in downloadAndExtractAndLoadWingetRepoForStartup:', error);
		return null;
	}
}

async function reallyDownloadAndExtractWingetRepo() {
	await downloadAndExtractGitHubRepo({
		owner: OWNER,
		repo: REPO,
		branch: BRANCH,
		privateDir: PRIVATE_DIR,
		logPrefix: 'winget'
	});
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
			// if (!latest.has(id))
			// 	console.log("[winget-loading] Adding " + (latest.size + 1) + ' App: ' + (id) + ' : v' + version);

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