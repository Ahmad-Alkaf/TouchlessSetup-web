import 'server-only';
import { type WinGetApp } from "@/lib/type";
import { downloadAndExtractAndLoadWingetRepoForStartup } from '@/actions/download-winget-repo';
import fs from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';

// Global cache variable that persists across requests
let APPS_CACHE: WinGetApp[] | null = null;
let LOADING_PROMISE: Promise<WinGetApp[] | null> | null = null;

// File-based cache to persist across server restarts in development
const CACHE_FILE_PATH = path.join(tmpdir(), 'touchless-setup-winget-cache.json');
const CACHE_TIMESTAMP_FILE = path.join(tmpdir(), 'touchless-setup-winget-cache-timestamp.txt');

/**
 * Check if the file cache is still valid (less than 24 hours old)
 */
async function isCacheValid(): Promise<boolean> {
	try {
		console.log(`[cache] Reading timestamp from: ${CACHE_TIMESTAMP_FILE}`);
		const timestampStr = await fs.readFile(CACHE_TIMESTAMP_FILE, 'utf-8');
		const timestamp = parseInt(timestampStr, 10);
		const now = Date.now();
		const twentyFourHours = 24 * 60 * 60 * 1000;

		console.log(`[cache] Timestamp: ${timestamp}, Now: ${now}, Diff: ${now - timestamp}ms`);
		const isValid = (now - timestamp) < twentyFourHours;
		console.log(`[cache] Cache is ${isValid ? 'valid' : 'expired'}`);

		return isValid;
	} catch (error) {
		console.log(`[cache] Error checking cache validity:`, error instanceof Error ? error.message : 'Unknown error');
		return false;
	}
}

/**
 * Load cached apps from file if available and valid
 */
async function loadCacheFromFile(): Promise<WinGetApp[] | null> {
	try {
		console.log(`[cache] Checking file cache validity...`);
		console.log(`[cache] Cache file path: ${CACHE_FILE_PATH}`);
		console.log(`[cache] Timestamp file path: ${CACHE_TIMESTAMP_FILE}`);

		if (!(await isCacheValid())) {
			console.log('[cache] File cache is expired or invalid');
			return null;
		}

		console.log('[cache] File cache is valid, loading data...');
		const cacheData = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
		const apps = JSON.parse(cacheData) as WinGetApp[];

		if (Array.isArray(apps) && apps.length > 0) {
			console.log(`[cache] Successfully loaded ${apps.length} apps from file cache`);
			return apps;
		}
	} catch (error) {
		console.log('[cache] Failed to load from file cache:', error instanceof Error ? error.message : 'Unknown error:' + error);
	}
	return null;
}

/**
 * Save apps to file cache
 */
async function saveCacheToFile(apps: WinGetApp[]): Promise<void> {
	try {
		console.log(`[cache] Attempting to save ${apps.length} apps to file cache...`);
		console.log(`[cache] Cache file path: ${CACHE_FILE_PATH}`);
		console.log(`[cache] Timestamp file path: ${CACHE_TIMESTAMP_FILE}`);

		await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(apps), 'utf-8');
		await fs.writeFile(CACHE_TIMESTAMP_FILE, Date.now().toString(), 'utf-8');

		console.log(`[cache] Successfully saved ${apps.length} apps to file cache`);
		console.log(`[cache] Cache file size: ${JSON.stringify(apps).length} characters`);
	} catch (error) {
		console.error('[cache] Failed to save to file cache:', error);
	}
}

/**
 * Initialize the WinGet apps cache immediately when the server starts
 * This function should be called during application startup
 */
export async function initializeWingetAppsCache(): Promise<void> {
	if (APPS_CACHE !== null || LOADING_PROMISE !== null) {
		return; // Already initialized or currently initializing
	}

	// In development, you can skip the cache initialization by setting this env var
	if (process.env.SKIP_WINGET_CACHE === 'true') {
		console.log('[startup] Skipping WinGet apps cache initialization (SKIP_WINGET_CACHE=true)');
		return;
	}

	console.log('[startup] Initializing WinGet apps cache...');

	// First, try to load from file cache
	const cachedApps = await loadCacheFromFile();
	if (cachedApps) {
		APPS_CACHE = cachedApps;
		console.log(`[startup] Loaded ${cachedApps.length} apps from persistent file cache`);
		return;
	}

	console.log('[startup] File cache not available, downloading fresh WinGet data...');
	console.time('[startup] WinGet apps cache initialization took');

	try {
		// Use the startup-specific function that bypasses atomic operation
		// to avoid lock file conflicts and delays during server startup
		LOADING_PROMISE = downloadAndExtractAndLoadWingetRepoForStartup();
		const apps = await LOADING_PROMISE;

		if (Array.isArray(apps)) {
			APPS_CACHE = apps;
			// Save to file cache for future server restarts
			await saveCacheToFile(apps);
			console.log(`[startup] Successfully cached ${apps.length} WinGet apps`);
		} else {
			console.error('[startup] Failed to initialize WinGet apps cache: Invalid return type');
		}
	} catch (error) {
		console.error('[startup] Error initializing WinGet apps cache:', error);
	} finally {
		LOADING_PROMISE = null;
		console.timeEnd('[startup] WinGet apps cache initialization took');
	}
}

/**
 * Clean up any existing lock files that might be left from previous runs
 */
async function cleanupLockFiles(): Promise<void> {
	try {
		const lockFile = path.join(tmpdir(), 'touchless-setup-downloading-winget.lock');
		await fs.unlink(lockFile);
		console.log('[startup] Cleaned up existing lock file');
	} catch (error) {
		// Ignore errors - lock file might not exist
	}
}

/**
 * Get the cached WinGet apps or wait for them to load if currently loading
 */
export async function getCachedWingetApps(): Promise<WinGetApp[] | null> {
	// If apps are already cached, return them immediately
	if (APPS_CACHE !== null) {
		return APPS_CACHE;
	}

	// If currently loading, wait for the loading to complete
	if (LOADING_PROMISE !== null) {
		console.log('[cache] Waiting for WinGet apps to finish loading...');
		const apps = await LOADING_PROMISE;
		if (Array.isArray(apps)) {
			APPS_CACHE = apps;
		}
		return APPS_CACHE;
	}

	// Try to load from file cache as a fallback
	console.log('[cache] Memory cache is empty, trying to load from file cache...');
	const cachedApps = await loadCacheFromFile();
	if (cachedApps) {
		APPS_CACHE = cachedApps;
		return APPS_CACHE;
	}

	// If not loaded and not loading. Then winget apps did not cached at startup, so we will ignore them, to avoid trying to load them again for every request.
	console.log('[cache] No cache available (memory or file)');
	return null;
}

/**
 * Clear the cache (useful for development or forced refresh)
 */
export async function clearWingetAppsCache(): Promise<void> {
	APPS_CACHE = null;
	LOADING_PROMISE = null;

	// Also clear file cache
	try {
		await fs.unlink(CACHE_FILE_PATH);
		await fs.unlink(CACHE_TIMESTAMP_FILE);
		console.log('[cache] WinGet apps cache and file cache cleared');
	} catch {
		console.log('[cache] WinGet apps cache cleared (file cache was not present)');
	}
}

/**
 * Force refresh the cache by downloading fresh data
 */
export async function refreshWingetAppsCache(): Promise<WinGetApp[] | null> {
	console.log('[cache] Force refreshing WinGet apps cache...');

	// Clear existing cache
	await clearWingetAppsCache();

	// Clean up lock files
	await cleanupLockFiles();

	try {
		const apps = await downloadAndExtractAndLoadWingetRepoForStartup();
		if (Array.isArray(apps)) {
			APPS_CACHE = apps;
			await saveCacheToFile(apps);
			console.log(`[cache] Successfully refreshed cache with ${apps.length} WinGet apps`);
			return apps;
		}
	} catch (error) {
		console.error('[cache] Error refreshing WinGet apps cache:', error);
	}

	return null;
}
