import 'server-only';
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from 'node:util';
const execAsync = promisify(exec);

export const WINFORMS_REPO_LOCATION = path.join(process.cwd(), 'private', 'winforms');

/**
 * Build process. Throws an exception if something went wrong.
 */
export async function optimizedBuildTouchlessWinforms(repoPath: string): Promise<void> {
	const repoName = path.basename(repoPath);
	const isWindows = process.platform === 'win32';
	const os = isWindows ? 'windows' : 'linux';
	console.log('[build-installer] Starting build process on "' + os + '" platform...');

	// Find required tools
	const msbuildPath = os === 'windows' ? await findMSBuildPath() : 'msbuild';

	if (!msbuildPath) {
		console.error('MSBuild not found. Please ensure Visual Studio is installed or msbuild PATH is accessible.');
		throw new Error('Error Code: 299008');
	}
	// MSBuild path on Windows
	// "C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Current\Bin\MSBuild.exe"
	/**
/p:DeployOnBuild=true - Prepares files for deployment
/p:AllowedReferenceRelatedFileExtensions=none - Prevents copying PDB files
/p:GenerateSerializationAssemblies=Off - Disables XML serialization assembly generation
/p:TreatWarningsAsErrors=false - Prevents warnings from failing the build
/p:AutoGenerateBindingRedirects=true - Auto-generates binding redirects
	 */
	const command = `${msbuildPath} TouchlessSetup.sln /p:Configuration=Release /p:Platform="Any CPU" /m /p:BuildInParallel=true /p:PreferredToolArchitecture=x64 /nologo /verbosity:minimal /p:DeployOnBuild=true /p:AllowedReferenceRelatedFileExtensions=none /p:GenerateSerializationAssemblies=Off /p:TreatWarningsAsErrors=false /p:AutoGenerateBindingRedirects=true`;
	const workingDir = path.join(repoPath, 'TouchlessSetup');
	const releasePath = path.join(workingDir, 'bin', 'Release');

	console.log(`[build-${repoName}] Command: ${command}`);
	console.log(`[build-${repoName}] Working directory: ${workingDir}`);
	console.time(`[build-${repoName}] SUCCEEDED and took`);

	try {
		// Build the project
		const { stdout, stderr } = await execAsync(command, {
			cwd: workingDir,
			timeout: 30_000,
			windowsHide: true
		});

		// Custom validation if provided, otherwise check for common success indicators
		const isSuccess = stdout?.includes('bin\\Release\\TouchlessSetup.exe');

		if (!isSuccess) {
			console.warn(`[build-${repoName}] Build completed but validation failed`);
			console.warn(`[build-${repoName}] Output: ${(stderr + '\n' + stdout)}`);
			throw new Error('Build validation failed');
		}

		console.timeEnd(`[build-${repoName}] SUCCEEDED and took`);

	} catch (error) {
		console.error(`[build-${repoName}] Build process failed:`, error);
		throw 'Error Code: 8849289';
	}
}

/**
 * Finds the NuGet executable path
 */
export async function findNuGetPath(): Promise<string | null> {
	const possiblePaths = [
		path.join(WINFORMS_REPO_LOCATION, 'nuget.exe'),
		'"../../nuget.exe"',
		'nuget' // Try PATH
	];

	for (const nugetPath of possiblePaths) {
		try {
			await execAsync(`${nugetPath} help`, { timeout: 10000 });
			console.log(`[build-repos-nuget-detection] Found NuGet at: ${nugetPath}`);
			return nugetPath;
		} catch (error) {
			// Continue to next path
		}
	}

	console.error('[build-repos-nuget-detection] NuGet not found in any standard location');
	return null;
}

/**
 * Finds the MSBuild executable path on Windows
 */
export async function findMSBuildPath(): Promise<string | null> {
	// "C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Current\Bin\MSBuild.exe"
	const possiblePaths = [
		'"C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\MSBuild\\Current\\Bin\\MSBuild.exe"',
		'"C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise\\MSBuild\\Current\\Bin\\MSBuild.exe"',
		'"C:\\Program Files\\Microsoft Visual Studio\\2022\\Professional\\MSBuild\\Current\\Bin\\MSBuild.exe"',
		'"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Enterprise\\MSBuild\\Current\\Bin\\MSBuild.exe"',
		'"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Professional\\MSBuild\\Current\\Bin\\MSBuild.exe"',
		'"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community\\MSBuild\\Current\\Bin\\MSBuild.exe"',
		'msbuild' // Try PATH
	];

	for (const msbuildPath of possiblePaths) {
		try {
			// Test if MSBuild is available
			await execAsync(`${msbuildPath} -version`, { timeout: 10000 });
			console.log(`[build-repos-msbuild-detection] Found MSBuild at: ${msbuildPath}`);
			return msbuildPath;
		} catch (error) {
			// Continue to next path
		}
	}

	console.error('[build-repos-msbuild-detection] MSBuild not found in any standard location');
	return null;
}