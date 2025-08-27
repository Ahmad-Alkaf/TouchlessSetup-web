import 'server-only'
import fsS from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { pipeline } from 'node:stream/promises';
import StreamZip from 'node-stream-zip';
import { ReadableStream } from 'node:stream/web'

export interface RepoConfig {
	owner: string;
	repo: string;
	branch: string;
	privateDir: string;
	logPrefix: string;
	token?: string; // GitHub Personal Access Token for private repositories
}

/**
 * Generic function to download and extract a GitHub repository using GitHub API
 */
export async function downloadAndExtractGitHubRepo(config: RepoConfig): Promise<boolean> {
	const { owner, repo, branch, privateDir, logPrefix, token } = config;
	const destDir = path.join(privateDir, repo)
	const url = `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`;

	try {
		// Check if the repository already exists
		if (await fs.access(destDir).then(() => true).catch(() => false)) {
			if (process.env.NODE_ENV === 'development') {
				console.log(`[${logPrefix}] Repository already exists, skipping download`);
				return true;
			} else {
				console.error(`[${logPrefix}] Repo exists in production! Unexpected code execution context reached! Error Code: 49239`);
				return false;
			}
		}

		console.log(`[${logPrefix}] Start downloading ${url} repo.`);

		// Ensure private directory exists
		await fs.mkdir(privateDir, { recursive: true });

		console.time(`[${logPrefix}] Downloading took`);
		const headers: Record<string, string> = {
			'User-Agent': 'nextjs-app',
			'X-GitHub-Api-Version': '2022-11-28',
		};

		// Add authentication for private repositories
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		// Retry logic for network timeouts
		let res: Response;
		const maxRetries = 10;
		let lastError: Error | null = null;

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				console.log(`[${logPrefix}] Download attempt ${attempt}/${maxRetries}...`);

				res = await fetch(url, {
					headers,
					redirect: 'follow', // the API answers 302 first
					cache: 'no-store',
					// Add timeout configuration
					signal: AbortSignal.timeout(30000) // 30 second timeout
				});

				// If we get here, fetch succeeded
				break;

			} catch (error: any) {
				lastError = error;
				console.warn(`[${logPrefix}] Download attempt ${attempt}/${maxRetries} failed:`, error.message);

				if (attempt < maxRetries) {
					const delay = attempt * 2000; // 2s, 4s delays
					console.log(`[${logPrefix}] Retrying in ${delay}ms...`);
					await new Promise(resolve => setTimeout(resolve, delay));
				}
			}
		}

		// If all retries failed
		if (!res!) {
			console.error(`[${logPrefix}] All download attempts failed. Last error:`, lastError);
			throw lastError || new Error('Failed to download after all retries');
		}

		if (!res.ok) {
			console.error(`[${logPrefix}] GitHub responded with error:`, {
				status: res.status,
				statusText: res.statusText,
				headers: Object.fromEntries(res.headers.entries()),
				url: res.url
			});
			return false;
		} else {
			console.log(`[${logPrefix}] GitHub responded - OK`);
		}

		const tmpZip = path.join(tmpdir(), `${repo}.zip`);
		if (res.body == null) {
			console.error(`[${logPrefix}] GitHub respond body is null`);
			return false;
		}

		console.log(`[${logPrefix}] Downloading the ${repo} zip folder...`);
		await pipeline(res.body as unknown as ReadableStream, fsS.createWriteStream(tmpZip));
		console.timeEnd(`[${logPrefix}] Downloading took`);
		console.log(`[${logPrefix}] Done Downloading the zip folder`);

		console.log(`[${logPrefix}] Extracting the zip folder using node-stream-zip...`);
		console.time(`[${logPrefix}] Extracting took`);
		const zip = new StreamZip.async({ file: tmpZip, storeEntries: true });
		await zip.extract(null, privateDir);
		await zip.close();
		console.timeEnd(`[${logPrefix}] Extracting took`);
		console.log(`[${logPrefix}] Done Extracting the zip folder`);

		console.log(`[${logPrefix}] Renaming the extracted zip folder...`);
		console.time(`[${logPrefix}] Renaming took`);
		const extractedRoot = (await fs.readdir(privateDir))
			.find((d) => d.startsWith(`${owner}-${repo}`));

		if (extractedRoot) {
			await fs.rename(
				path.join(privateDir, extractedRoot),
				destDir,
			);
			console.log(`[${logPrefix}] Done renaming the extracted folder to \`${destDir}\``);
			console.timeEnd(`[${logPrefix}] Renaming took`);
		} else {
			console.error(`[${logPrefix}] could not find the extracted folder!`);
			await fs.unlink(tmpZip);
			return false;
		}

		try {
			console.log(`[${logPrefix}] Deleting the zip folder...`);
			console.time(`[${logPrefix}] Deleting took`);
			await fs.unlink(tmpZip);
			console.timeEnd(`[${logPrefix}] Deleting took`);
			console.log(`[${logPrefix}] Repository is ready at ${destDir}`);
		} catch (e: any) {
			console.error(`[${logPrefix}] while deleting the zip folder! Error Message: ${e?.message}`);
			console.log(`[${logPrefix}] Done Deleting the zip folder`);
		}
		return true;
	} catch (e: Error | any) {
		console.error(`[${logPrefix}] something went wrong, while downloading and extracting ${repo}! Full error:`, {
			error: e,
			message: e?.message,
			stack: e?.stack,
			url: url,
			destDir: destDir,
			privateDir: privateDir
		});
		throw e;
	}
}
