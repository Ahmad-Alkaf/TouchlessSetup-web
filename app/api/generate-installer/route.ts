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
		// Generate the installer and get the .exe file path
		const exePath = await generateInstallerExeFile(selectedApps, tempId);

		// Get file stats for proper headers
		const stats = await fs.stat(exePath);

		// Read the file and return as a direct response
		const fileBuffer = await fs.readFile(exePath);

		// Cleanup after loading/reading the .exe file into the RAM: Delete the temporary directory with retry logic.
		await cleanupTSWinFormsTempDir(tempId);

		// Return the file directly
		return new Response(new Uint8Array(fileBuffer), {
			headers: {
				'Content-Disposition': `attachment; filename="${generateFilename(selectedApps)}.exe"`,
				'Content-Type': 'application/octet-stream',
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


export async function generateInstallerExeFile(selectedApps: { id: string; name: string }[], tempId: string): Promise<string> {

	const mainAction: TSAction = generateMainActionContent(selectedApps);
	const originalWinformsDir = path.join(WINFORMS_REPO_LOCATION, 'TouchlessSetup-winforms');
	const tempWinformsDir = path.join(WINFORMS_REPO_LOCATION, `TouchlessSetup-winforms-${tempId}`);

	// Copy private/winforms/TouchlessSetup-winforms to private/winforms/TouchlessSetup-winforms-{temp UUID}
	console.log(`[generate-installer-${tempId}] Copying winforms directory to temporary location: ${tempWinformsDir}`);
	await copyDirectory(originalWinformsDir, tempWinformsDir);

	// Write the main-action.json file with `mainAction` inside the temporary directory
	const mainActionPath = path.join(tempWinformsDir, 'TouchlessSetup', 'main-action.json');
	try {
		await fs.writeFile(mainActionPath, JSON.stringify(mainAction), 'utf8');
		console.log(`[generate-installer-${tempId}] User's mainActions are written to main-action.json`);
	} catch (error) {
		console.error(`[generate-installer-${tempId}] Failed to write main-action.json of id ${tempId}`, error);
		throw 'Error Code: 9155832';
	}

	// Call optimizedBuildTouchlessWinforms with the new directory
	console.log(`[generate-installer-${tempId}] Building...`);
	await optimizedBuildTouchlessWinforms(tempWinformsDir);

	// Returns the Release .exe file 
	return path.join(tempWinformsDir, 'TouchlessSetup', 'bin', 'Release', 'TouchlessSetup.exe');
}

/**
 * Cleanup temporary directory with retry logic to handle Windows file locking issues
 */
async function cleanupTSWinFormsTempDir(tempId: string, maxRetries: number = 10): Promise<void> {
	const tempDirPath = path.join(WINFORMS_REPO_LOCATION, `TouchlessSetup-winforms-${tempId}`)
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			await fs.rm(tempDirPath, { recursive: true, force: true });
			console.log(`[generate-installer-${tempId}] Cleaned up temporary directory (attempt ${attempt}/${maxRetries})`);
			return; // Success, exit the function
		} catch (error: any) {
			console.warn(`[generate-installer-${tempId}] Cleanup failed (attempt ${attempt}/${maxRetries}):`, {
				code: error.code,
				path: error.path,
				message: error.message
			});

			if (attempt >= maxRetries) {
				console.error(`[generate-installer-${tempId}] Failed to cleanup temporary directory after ${maxRetries} attempts. Manual cleanup may be required.`);
				// no throw required.
			}

			// Wait before retry (increasing delay)
			const delay = attempt * 2000; // 2s, 4s, 6s, ..etc
			console.log(`[generate-installer-${tempId}] Waiting ${delay}ms before retry...`);
			await new Promise(resolve => setTimeout(resolve, delay));
		}
	}
}