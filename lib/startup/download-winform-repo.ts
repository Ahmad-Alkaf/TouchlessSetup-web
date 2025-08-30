import 'server-only'
import path from 'node:path';
import { downloadAndExtractGitHubRepo, type RepoConfig } from './github-repo-downloader';


/**
 * Downloads and extracts the TouchlessSetup-winforms private repository
 * into the private directory
 */
export async function initializeWinformsRepo(): Promise<void> {
	console.log('[download-winforms-repo] Starting repository download...');

	// Get GitHub token from environment variable for private repository access
	const githubToken = process.env.GITHUB_TOKEN;

	if (!githubToken) {
		console.error('[download-winforms-repo] GITHUB_TOKEN environment variable is required for private repository access');
		throw new Error('GITHUB_TOKEN environment variable is required for private repository access');
	}

	await downloadAndExtractGitHubRepo({
		owner: 'Ahmad-Alkaf',
		repo: 'TouchlessSetup-winforms',
		branch: 'master',
		privateDir: path.join(process.cwd(), 'private', 'winforms'),
		logPrefix: 'download-winforms-repo',
		token: githubToken
	});
	await downloadAndExtractGitHubRepo({
		owner: 'Ahmad-Alkaf',
		repo: 'FileUtility',
		branch: 'master',
		privateDir: path.join(process.cwd(), 'private', 'winforms'),
		logPrefix: 'download-FileUtility-repo',
	});
}
