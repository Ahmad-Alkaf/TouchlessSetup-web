'use server';
import 'server-only';
import { NextRequest } from 'next/server';
import { generateMainActionContent } from './components/generateMainAction';
import { TSAction } from '@/lib/type';
import { atomicOperation } from '@/actions/components/atomic-operation';
import { generateFilename } from './components/generate-filename';

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

	try {


		const mainAction: TSAction = generateMainActionContent(selectedApps);
		// Write the main-action.js file inside /private/winforms/TouchlessSetup-winforms directory
		// Execute the build command to generate the installer.
		// Get the buffer of the generated installer file.
		// Cleanup.


		const installerContent = `This is a fake installer for: ${selectedApps.map((app: { name: string }) => app.name).join(', ')}`;
		// Return the file as a Response
		return new Response(Buffer.from(installerContent), {
			headers: {
				'Content-Disposition': `attachment; filename="${generateFilename(selectedApps)}"`,
				'Content-Type': 'application/octet-stream',
			}
		});

	} catch (error) {
		console.error('Error generating installer:', { error, selectedApps });
		return new Response(JSON.stringify({
			success: false,
			error: 'Failed to generate installer. Please try again.\r\n' + error
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
