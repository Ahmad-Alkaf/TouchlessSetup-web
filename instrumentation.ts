/**
 * Next.js Instrumentation Hook
 * This file runs when the server starts and is the recommended way
 * to perform server initialization tasks
 */

export async function register() {
    // Only run on server side
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        console.log('[instrumentation] Server starting - initializing caches...');
        
        // Import and initialize the cache
        const { initializeWingetAppsCache } = await import('./lib/startup/cache-winget-apps');
        
        // Start cache initialization immediately in the background
        // Don't await to avoid blocking server startup
        initializeWingetAppsCache()
            .then(() => {
                console.log('[instrumentation] WinGet cache initialization completed successfully');
            })
            .catch((error) => {
                console.error('[instrumentation] WinGet cache initialization failed:', error);
            });
        
        console.log('[instrumentation] Server initialization tasks started in background');
    }
}
