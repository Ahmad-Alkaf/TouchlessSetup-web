'use server';
import 'server-only';
import { NextRequest } from 'next/server';
import { generateMainActionContent } from './components/generateMainAction';
import { TSAction } from '@/lib/type';
import { generateFilename } from './components/generate-filename';
import { copyDirectory, generateTempId } from './components/copy-directory';
import { optimizedBuildTouchlessWinforms, WINFORMS_REPO_LOCATION } from '@/actions/build-dot-net-framework';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createWriteStream } from 'node:fs';
import { tmpdir } from 'node:os';
import yazl from 'yazl';

/**
 * Create a zip file from a directory using yazl - the most optimized streaming zip library
 * Features: Streaming, minimal memory usage, fastest performance
 */
async function createOptimizedZipFromDirectory(sourceDir: string, outputPath: string): Promise<void> {
	return new Promise(async (resolve, reject) => {
		try {
			const zipFile = new yazl.ZipFile();
			const output = createWriteStream(outputPath);

			// Handle output stream events
			output.on('error', reject);
			output.on('close', resolve);

			// Pipe zip to output file
			zipFile.outputStream.pipe(output);

			// Recursively add all files from source directory
			await addDirectoryToZip(zipFile, sourceDir, '');

			// Finalize the zip file
			zipFile.end();

		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Recursively add directory contents to zip file
 */
async function addDirectoryToZip(zipFile: yazl.ZipFile, dirPath: string, zipPath: string): Promise<void> {
	const entries = await fs.readdir(dirPath, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry.name);
		const entryZipPath = zipPath ? `${zipPath}/${entry.name}` : entry.name;

		if (entry.isDirectory()) {
			// Recursively add subdirectory
			await addDirectoryToZip(zipFile, fullPath, entryZipPath);
		} else if (entry.isFile()) {
			// Add file to zip with streaming (most memory efficient)
			zipFile.addFile(fullPath, entryZipPath);
		}
	}
}

export async function POST(request: NextRequest) {
	const { selectedApps } = await request.json();
	
	// Validate input
	if (!selectedApps || !Array.isArray(selectedApps) || selectedApps.length === 0) {
		return new Response(JSON.stringify({
			success: false,
			error: 'No applications selected for installation'
		}), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const tempId = generateTempId();
	try {
		// Generate the installer and get the zip file path
		const zipPath = await generateInstallerZipFile(selectedApps, tempId);

		// Get file stats for proper headers
		const stats = await fs.stat(zipPath);
		
		// Read the file and return as a direct response
		const fileBuffer = await fs.readFile(zipPath);
		
		// Clean up the temporary file
		fs.unlink(zipPath).catch(error => {
			console.warn(`[generate-installer-${tempId}] Failed to cleanup zip file:`, error);
		});

		// Return the file directly
		return new Response(new Uint8Array(fileBuffer), {
			headers: {
				'Content-Disposition': `attachment; filename="${generateFilename(selectedApps)}.zip"`,
				'Content-Type': 'application/zip',
				'Content-Length': stats.size.toString(),
				'Cache-Control': 'no-cache',
			}
		});
	} catch (error) {
		console.error(`[generate-installer-${tempId}] Error generating installer:`, { error, selectedApps });
		return new Response(JSON.stringify({
			success: false,
			error: 'Failed to generate installer. Please try again.\r\n' + error
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}


export async function generateInstallerZipFile(selectedApps: { id: string; name: string }[], tempId: string): Promise<string> {

	const mainAction: TSAction = generateMainActionContent(selectedApps);
	const originalWinformsDir = path.join(WINFORMS_REPO_LOCATION, 'TouchlessSetup-winforms');
	const tempWinformsDir = path.join(WINFORMS_REPO_LOCATION, `TouchlessSetup-winforms-${tempId}`);

	try {
		// Copy private/winforms/TouchlessSetup-winforms to private/winforms/TouchlessSetup-winforms-{temp UUID}
		console.log(`[generate-installer-${tempId}] Copying winforms directory to temporary location: ${tempWinformsDir}`);
		await copyDirectory(originalWinformsDir, tempWinformsDir);

		// Write the main-action.json file with `mainAction` inside the temporary directory
		const mainActionPath = path.join(tempWinformsDir, 'TouchlessSetup', 'main-action.json');
		try {
			await fs.writeFile(mainActionPath, JSON.stringify(mainAction, null, 2), 'utf8');
			console.log(`[generate-installer-${tempId}] User's mainActions are written to main-action.json`);
		} catch (error) {
			console.error(`[generate-installer-${tempId}] Failed to write main-action.json of id ${tempId}`, error);
			throw 'Error Code: 9155832';
		}

		// Call optimizedBuildTouchlessWinforms with the new directory
		console.log(`[generate-installer-${tempId}] Building...`);
		await optimizedBuildTouchlessWinforms(tempWinformsDir);

		// Read the Release directory content (bin/Release)
		const releasePath = path.join(tempWinformsDir, 'TouchlessSetup', 'bin', 'Release');

		// Create a temporary zip file
		const zipPath = path.join(tmpdir(), `TouchlessSetup-Release-${tempId}.zip`);

		try {
			console.log(`[generate-installer-${tempId}] Creating zip file from Release directory...`);
			await createOptimizedZipFromDirectory(releasePath, zipPath);
			console.log(`[generate-installer-${tempId}] Zip file ready for streaming: ${zipPath}`);

			return zipPath; // Return the path for streaming instead of buffer
		} catch (readError) {
			console.error(`[generate-installer-${tempId}] Failed to create zip file:`, readError);
			throw 'Error Code: 9174885';
		}

	} finally {
		// Cleanup: Delete the temporary directory
		try {
			await fs.rm(tempWinformsDir, { recursive: true, force: true });
			console.log(`[generate-installer-${tempId}] Cleaned up temporary directory`);
		} catch (cleanupError) {
			console.error(`[generate-installer-${tempId}] Failed to cleanup temporary directory:`, cleanupError);
			// Don't throw here as the main operation was successful
		}
	}
}