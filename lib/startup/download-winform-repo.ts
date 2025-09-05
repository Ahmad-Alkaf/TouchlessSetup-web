import 'server-only'
import path from 'node:path';
import fs from 'node:fs/promises';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { downloadAndExtractGitHubRepo, type RepoConfig } from './github-repo-downloader';
import { findMSBuildPath, findNuGetPath, WINFORMS_REPO_LOCATION } from '@/actions/build-dot-net-framework';

const execAsync = promisify(exec);

interface BuildResult {
	success: boolean;
	output?: string;
	error?: string;
	duration?: number;
}

interface BuildConfig {
	name: string;
	command: string;
	workingDir: string;
	timeoutMs?: number;
	retries?: number;
	validateSuccess: (output: string) => boolean;
}

const FILE_UTILITY_REPO_NAME = 'FileUtility';
const FILE_UTILITY_REPO_LOCATION = path.join(WINFORMS_REPO_LOCATION, FILE_UTILITY_REPO_NAME);
const TOUCHLESS_SETUP_REPO_NAME = 'TouchlessSetup-winforms';
const TOUCHLESS_SETUP_REPO_LOCATION = path.join(WINFORMS_REPO_LOCATION, TOUCHLESS_SETUP_REPO_NAME);

// Build configuration constants
const BUILD_TIMEOUT_MS = 300000; // 5 minutes
const BUILD_RETRIES = 3;
const RETRY_DELAY_MS = 5000; // 5 seconds

/**
 * Validates if a path exists and is accessible
 */
async function validatePath(filePath: string, description: string): Promise<boolean> {
	try {
		await fs.access(filePath);
		return true;
	} catch (error) {
		console.error(`[path-validation] ${description} not found at: ${filePath}`);
		return false;
	}
}

/**
 * Executes a build command with retry logic and timeout
 */
async function executeWithRetry(config: BuildConfig): Promise<BuildResult> {
	const { name, command, workingDir, timeoutMs = BUILD_TIMEOUT_MS, retries = BUILD_RETRIES, validateSuccess } = config;

	console.log(`[build-${name}] Starting: ${command}`);
	console.log(`[build-${name}] Working directory: ${workingDir}`);

	// Validate working directory exists
	if (!(await validatePath(workingDir, `Working directory for ${name}`))) {
		return {
			success: false,
			error: `Working directory does not exist: ${workingDir}`,
		};
	}

	for (let attempt = 1; attempt <= retries; attempt++) {
		const startTime = Date.now();

		try {
			console.log(`[build-${name}] Attempt ${attempt}/${retries}...`);

			const { stdout, stderr } = await execAsync(command, {
				cwd: workingDir,
				timeout: timeoutMs,
				maxBuffer: 1024 * 1024 * 10, // 10MB buffer
				windowsHide: true
			});

			const duration = Date.now() - startTime;
			const output = stdout + stderr;

			// Custom validation if provided, otherwise check for common success indicators
			const isSuccess = validateSuccess(output);

			if (isSuccess) {
				console.log(`[build-${name}] SUCCESS (${duration}ms)`);
				return {
					success: true,
					output,
					duration
				};
			} else {
				console.warn(`[build-${name}] Build completed but validation failed (attempt ${attempt}/${retries})`);
				console.warn(`[build-${name}] Output: ${output.substring(0, 500)}...`);

				if (attempt === retries) {
					return {
						success: false,
						output,
						error: 'Build validation failed',
						duration
					};
				}
			}

		} catch (error: any) {
			const duration = Date.now() - startTime;
			console.error(`[build-${name}] Attempt ${attempt}/${retries} failed (${duration}ms):`, error.message);

			if (attempt === retries) {
				return {
					success: false,
					error: error.message,
					duration
				};
			}

			// Wait before retry
			if (attempt < retries) {
				const delay = RETRY_DELAY_MS * attempt;
				console.log(`[build-${name}] Retrying in ${delay}ms...`);
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}
	}

	return {
		success: false,
		error: 'All retry attempts exhausted'
	};
}


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

	let success1 = false;
	let success2 = false;

	try {
		// Download FileUtility repository
		console.log('[download-winforms-repo] Downloading FileUtility...');
		success1 = await downloadAndExtractGitHubRepo({
			owner: 'Ahmad-Alkaf',
			repo: FILE_UTILITY_REPO_NAME,
			branch: 'master',
			privateDir: WINFORMS_REPO_LOCATION,
			logPrefix: 'download-FileUtility-repo',
			token: githubToken
		});

		// Download TouchlessSetup-winforms repository
		console.log('[download-winforms-repo] Downloading TouchlessSetup-winforms...');
		success2 = await downloadAndExtractGitHubRepo({
			owner: 'Ahmad-Alkaf',
			repo: TOUCHLESS_SETUP_REPO_NAME,
			branch: 'master',
			privateDir: WINFORMS_REPO_LOCATION,
			logPrefix: 'download-winforms-repo',
			token: githubToken
		});

		// Validate downloads
		if (!success1) {
			throw new Error(`Failed to download ${FILE_UTILITY_REPO_NAME} repository`);
		}
		if (!success2) {
			throw new Error(`Failed to download ${TOUCHLESS_SETUP_REPO_NAME} repository`);
		}

		console.log('[download-winforms-repo] All repositories downloaded successfully');

		// Build the downloaded repositories
		console.log('[build-repos] Starting build process...');
		await buildRepositories();
		console.log('[build-repos] Build process completed successfully');

	} catch (error: any) {
		console.error('[download-winforms-repo] Process failed:', error.message);

		// Cleanup on failure
		await cleanupOnFailure();

		throw new Error(`Repository initialization failed: ${error.message}`);
	}
}

/**
 * Cleanup function to remove partially downloaded/built repositories on failure
 */
async function cleanupOnFailure(): Promise<void> {
	console.log('[cleanup] Starting cleanup process...');

	try {
		const pathsToClean = [
			TOUCHLESS_SETUP_REPO_LOCATION,
			FILE_UTILITY_REPO_LOCATION
		];

		for (const cleanupPath of pathsToClean) {
			try {
				await fs.access(cleanupPath);
				await fs.rm(cleanupPath, { recursive: true, force: true });
				console.log(`[cleanup] Removed: ${cleanupPath}`);
			} catch (error) {
				// Path doesn't exist or already cleaned
				console.log(`[cleanup] Path not found or already clean: ${cleanupPath}`);
			}
		}

		console.log('[cleanup] Cleanup completed');
	} catch (error: any) {
		console.error('[cleanup] Cleanup failed:', error.message);
	}
}



/**
 * Builds the downloaded repositories using platform-specific commands with robust error handling
 */
async function buildRepositories(): Promise<void> {
	const isWindows = process.platform === 'win32';
	const platform = isWindows ? 'windows' : 'linux';

	console.log(`[build-repos] Building on ${platform} platform`);

	try {
		// Validate repository paths exist
		const repositoryPaths = [
			{ path: TOUCHLESS_SETUP_REPO_LOCATION, name: 'TouchlessSetup-winforms' },
			{ path: FILE_UTILITY_REPO_LOCATION, name: 'FileUtility' }
		];

		for (const repo of repositoryPaths) {
			if (!(await validatePath(repo.path, `${repo.name} repository`))) {
				throw new Error(`Repository not found: ${repo.name} at ${repo.path}`);
			}
		}

		await restoreAndBuildDotNetFramework(platform);

		console.log('[build-repos] All repositories built successfully');

	} catch (error: any) {
		console.error('[build-repos] Build process failed:', error.message);
		throw new Error(`Build failed: ${error.message}`);
	}
}

/**
 * Windows-specific build process
 */
async function restoreAndBuildDotNetFramework(os: 'windows' | 'linux'): Promise<void> {
	console.log('[build-repos-' + os + '] Starting Windows build process...');

	// Find required tools
	const msbuildPath = os === 'windows' ? await findMSBuildPath() : 'msbuild';
	const nugetPath = os === 'windows' ? await findNuGetPath() : 'nuget';

	if (!msbuildPath) {
		throw new Error('MSBuild not found. Please ensure Visual Studio is installed or msbuild PATH is accessible.');
	}
	if (!nugetPath) {
		throw new Error('NuGet not found. Please ensure NuGet is installed and available.');
	}

	// Define build configurations
	const buildConfigs: BuildConfig[] = [
		// FileUtility NuGet restore
		{
			name: 'FileUtility-NuGet-Restore',
			command: `${nugetPath} restore`,
			workingDir: path.join(FILE_UTILITY_REPO_LOCATION, 'FileUtility'),
			validateSuccess: (output) => !output.toLowerCase().includes('error') && (output.toLowerCase().includes('installed:') || output.includes('All packages listed in packages.config are already installed'))
		},
		// FileUtility build
		{
			name: 'FileUtility-Build',
			command: `${msbuildPath} FileUtility.sln /p:Configuration=Release /p:Platform="Any CPU"`,
			workingDir: path.join(FILE_UTILITY_REPO_LOCATION, 'FileUtility'),
			validateSuccess: (output) => output.toLowerCase().includes('build succeeded')
		},
		// TouchlessSetup NuGet restore
		{
			name: 'TouchlessSetup-NuGet-Restore',
			command: `${nugetPath} restore`,
			workingDir: path.join(TOUCHLESS_SETUP_REPO_LOCATION, 'TouchlessSetup'),
			validateSuccess: (output) => !output.toLowerCase().includes('error') && (output.toLowerCase().includes('installed:') || output.includes('All packages listed in packages.config are already installed'))
		},
		// TouchlessSetup build
		{
			name: 'TouchlessSetup-Build',
			command: `${msbuildPath} TouchlessSetup.sln /p:Configuration=Release /p:Platform="Any CPU"`,
			workingDir: path.join(TOUCHLESS_SETUP_REPO_LOCATION, 'TouchlessSetup'),
			validateSuccess: (output) => output.toLowerCase().includes('build succeeded')
		}
	];

	// Execute builds sequentially
	for (const config of buildConfigs) {
		const result = await executeWithRetry(config);

		if (!result.success) {
			console.error(`[build-repos-${config.name}] failed:`, result.error);
			console.error(`[build-repos-${config.name}] Output:`, result.output?.substring(0, 1000));
			throw new Error(`${config.name} failed: ${result.error}`);
		}

		console.log(`[build-repos-${config.name}] completed successfully (${result.duration}ms)`);
	}



	// Clean up useless folders and files to speed up future builds
	await cleanupUselessFilesAndFolders();
}

/**
 * Clean up useless files and folders that slow down build copying process
 * Focuses only on TouchlessSetup project since FileUtility is built once
 */
async function cleanupUselessFilesAndFolders(): Promise<void> {
	console.log('[build-repos-TouchlessSetup-cleanup] Starting cleanup of useless files and folders...');
	console.time('[build-repos-TouchlessSetup-cleanup] Cleanup took:')

	const touchlessSetupProjPath = path.join(TOUCHLESS_SETUP_REPO_LOCATION, 'TouchlessSetup');

	// Only clean up folders that are safe to delete from TouchlessSetup
	const foldersToDelete = [
		path.join(touchlessSetupProjPath, 'obj'),
		path.join(touchlessSetupProjPath, 'bin'),

		// NOTE: Do NOT delete 'packages' folder - it contains NuGet dependencies needed for building
		// Without this folder, we would need to run 'nuget restore' again before each build

		// Version control (not needed for building)
		path.join(TOUCHLESS_SETUP_REPO_LOCATION, '.git'),
		path.join(TOUCHLESS_SETUP_REPO_LOCATION, '.vs'),
	];

	// Only clean up files that are definitely not needed for building
	const filesToDelete = [
		// Documentation files (not needed for building)
		path.join(touchlessSetupProjPath, 'README.md'),
		path.join(touchlessSetupProjPath, '.todo'),

		// Version control files (not needed for building)
		path.join(touchlessSetupProjPath, '.gitignore'),
		path.join(touchlessSetupProjPath, '.gitattributes'),
	];

	// Clean up folders
	for (const folderPath of foldersToDelete) {
		try {
			await fs.rm(folderPath, { recursive: true, force: true });
			console.log(`[build-repos-TouchlessSetup-cleanup] Removed folder: ${path.relative(TOUCHLESS_SETUP_REPO_LOCATION, folderPath)}`);
		} catch (error) {
			console.warn('[build-repos-TouchlessSetup-cleanup] Failed to remove folder:', { path: folderPath, error });
			if (folderPath.includes('bin')) {
				throw new Error(`[build-repos-TouchlessSetup-cleanup] Failed to remove folder: ${folderPath}\r\n${error}`);
			}
		}
	}

	// Clean up files
	for (const filePath of filesToDelete) {
		try {
			await fs.rm(filePath, { force: true });
			console.log(`[build-repos-TouchlessSetup-cleanup] Removed file: ${path.relative(TOUCHLESS_SETUP_REPO_LOCATION, filePath)}`);
		} catch (error) {
			console.warn('[build-repos-TouchlessSetup-cleanup] Failed to remove file:', { path: filePath, error });
		}
	}

	console.log('[build-repos-TouchlessSetup-cleanup] Cleanup completed successfully');
	console.timeEnd('[build-repos-TouchlessSetup-cleanup] Cleanup took:')
}
