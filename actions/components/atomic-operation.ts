import 'server-only';
import fs, { FileHandle } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';


export async function atomicOperation(lockId: string, fn: () => Promise<void>): Promise<void> {
	console.log('[ATOMIC ' + lockId + '] Atomic operation is called but not executed yet');
	if (!lockId.match(/^[\w\-_]+$/gs))
		throw new Error("[ATOMIC " + lockId + "] A lock ID must satisfy the following RegEx: /^[\\w\\-_]+$/gs");
	const LOCK = path.join(tmpdir(), 'touchless-setup-' + lockId + '.lock');
	let fd: FileHandle | undefined;
	try {
		console.log('[ATOMIC ' + lockId + '] Attempting to open the lock file: ' + LOCK);
		fd = await fs.open(LOCK, 'wx');   // fails if file already exists
		console.log('[ATOMIC ' + lockId + '] ' + lockId + ' is locked, executing the function...');
		await fn();                       // inside the lock
	} catch (err: any) {
		if (err?.code === 'EEXIST') {
			console.log('[ATOMIC ' + lockId + '] Lock file already exists, waiting for it to be released...');
			let count = 0;
			const TIMEOUT_SEC = 10 * 60;
			// somebody else owns the lock → just wait until it disappears
			while (await fs.access(LOCK).then(() => true).catch(() => false) && count++ < TIMEOUT_SEC / 3) {
				console.log('[ATOMIC ' + lockId + '] ' + count + 's Not released yet, waiting...');
				await new Promise(r => setTimeout(r, 3000));
			}
			if (count > TIMEOUT_SEC)
				console.warn("[ATOMIC " + lockId + "] " + lockId + " last for " + count + " seconds!")
		} else throw err;
	} finally {
		console.log('[ATOMIC ' + lockId + '] ' + lockId + ' is released');
		if (fd) {
			await fd.close();
			await fs.unlink(LOCK)
				.catch((e) => {
					console.error("An exception occur while deleting the LOCK file! Error Message: " + e?.message);
				});
		}
	}
}
