import 'server-only';
import fs from 'node:fs/promises';

/**
 * Recursively copy a directory and all its contents using Node.js built-in fs.cp()
 * Optimized for temporary copies that will be deleted
 */
export async function copyDirectory(source: string, destination: string): Promise<void> {
	try {
		// Use built-in recursive copy (available in Node.js 16.7.0+)
		await fs.cp(source, destination, {
			recursive: true,
			force: true
		});
	} catch (error) {
		console.error(`Error copying directory from ${source} to ${destination}:`, error);
		throw 'Error Code: 2293484';
	}
}

/**
 * Generate a temporary UUID-like string
 */
export function generateTempId(): string {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
