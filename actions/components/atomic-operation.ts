import 'server-only';
import fs, { FileHandle } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Local promise cache to handle multiple simultaneous calls
const activePromises = new Map<string, Promise<void>>();

export async function atomicOperation(lockId: string, fn: () => Promise<void>): Promise<void> {
	console.log('[ATOMIC ' + lockId + '] Atomic operation is called but not executed yet');
	if (!lockId.match(/^[\w\-_]+$/gs))
		throw new Error("[ATOMIC " + lockId + "] A lock ID must satisfy the following RegEx: /^[\\w\\-_]+$/gs");
	const LOCK = path.join(tmpdir(), 'touchless-setup-' + lockId + '.lock');

	// Check if there's already an active promise for this lock (works in both dev and production)
	const existingPromise = activePromises.get(lockId);
	if (existingPromise) {
		console.log('[ATOMIC ' + lockId + '] Found existing promise, waiting for it to complete...');
		return existingPromise;
	}

	// ONLY in development: clean up stale lock files that don't have corresponding promises
	if (process.env.NODE_ENV === 'development') {
		const lockExists = await fs.access(LOCK).then(() => true).catch(() => false);
		if (lockExists && !activePromises.has(lockId)) {
			try {
				await fs.unlink(LOCK);
				console.log('[ATOMIC ' + lockId + '] Development mode: Cleaned up stale lock file');
			} catch (err: any) {
				console.warn('[ATOMIC ' + lockId + '] Development mode: Failed to clean stale lock file:', err.message);
			}
		}
	}

	// Create and store the promise (works in both dev and production)
	const operationPromise = performAtomicOperation(lockId, LOCK, fn);
	activePromises.set(lockId, operationPromise);

	// Clean up the promise from cache when done (works in both dev and production)
	operationPromise.finally(() => {
		activePromises.delete(lockId);
	});

	return operationPromise;
}

async function performAtomicOperation(lockId: string, LOCK: string, fn: () => Promise<void>): Promise<void> {
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
