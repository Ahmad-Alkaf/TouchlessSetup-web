import fs from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { pipeline } from 'node:stream/promises';
import fetch from 'node-fetch';
import extract from 'extract-zip';
import APPS from '../constant/APPS';

const REPO = 'winget-pkgs';
const BRANCH = 'master';                         // or main
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'winget');
const DEST_DIR = path.join(PUBLIC_DIR, REPO);
let isLoading = false;
/** one-time download + extract */
export default async function ensureWinGetRepo() {
	if (APPS != null) return;
	if (isLoading) return;
	isLoading = true;
	try {

		if (fs.existsSync(DEST_DIR)) return;          // already cached

		console.log('[winget] first run');
		console.log('[winget] project absolute directory – ', process.cwd());

		await mkdir(PUBLIC_DIR, { recursive: true }); // in case /public is missing
		const url = `https://api.github.com/repos/microsoft/${REPO}/zipball/${BRANCH}`;
		console.log('[winget] GitHub zip Winget Packages URL – ', url);

		const res = await fetch(url, {
			headers: {
				'User-Agent': 'nextjs-app',
			},
			redirect: 'follow',                         // the API answers 302 first
		});

		if (!res.ok) {
			console.error(`[Winget] GitHub responded ${res.status}`);
			return;
		} else console.log('[Winget] GitHub responded - OK');

		const tmpZip = path.join(tmpdir(), `${REPO}.zip`);
		if (res.body == null) {
			console.error('[Winget] GitHub respond body is null');
			return;
		}
		console.log('[winget] Downloading the Winget packages zip folder...');
		await pipeline(res.body, fs.createWriteStream(tmpZip));
		console.log('[winget] Done Downloading the zip folder');

		console.log('[winget] Extracting the zip folder...');
		await extract(tmpZip, { dir: PUBLIC_DIR });
		console.log('[winget] Done Extracting the zip folder');

		console.log('[winget] Renaming the extracted zip folder...');
		const extractedRoot = fs
			.readdirSync(PUBLIC_DIR)
			.find((d) => d.startsWith(`microsoft-${REPO}`));
		if (extractedRoot) {
			fs.renameSync(
				path.join(PUBLIC_DIR, extractedRoot),
				DEST_DIR,
			);
			console.log('[winget] Done renaming the extracted folder to `' + DEST_DIR + '`')
		}
		else {
			console.error('[winget] could not find the extracted folder!');
			fs.unlinkSync(tmpZip);
			return;
		}

		console.log('[winget] Deleting the zip folder...');
		fs.unlinkSync(tmpZip);
		console.log('[winget] Done Deleting the zip folder');
		console.log('[winget] winget packages are ready at public/winget/winget-pkgs');
	} catch (e) {
		console.error('[winget] something went wrong! ', e)
	} finally {
		isLoading = false;
	}
}
