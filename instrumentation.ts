/**
 * Next.js Instrumentation Hook
 * This file runs when the server starts and is the recommended way
 * to perform server initialization tasks
 */

export async function register() {
    // Only run on server side
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        console.log('[instrumentation] Server starting - initializing caches and repositories...');

        // Import initialization functions and atomic operation
        const { atomicOperation } = await import('./actions/components/atomic-operation');
        const { initializeWingetAppsCache } = await import('./lib/startup/cache-winget-apps');
        const { initializeWinformsRepo } = await import('./lib/startup/download-winform-repo');

        // Use atomic operation to ensure single initialization
        atomicOperation('server-initialization', async () => {
            console.log('[instrumentation] Starting initialization tasks...');
            console.time('[instrumentation] initialization took');

            // Start cache initialization immediately in the background
            // Don't await to avoid blocking server startup
            initializeWingetAppsCache()
                .then(() => {
                    console.log('[instrumentation] WinGet cache initialization completed');
                    console.log('[instrumentation] Sleeping before initialization of WinForms repository...');
                    setTimeout(() => {

                        // Start winform repository download in the background
                        initializeWinformsRepo()
                            .then(() => {
                                console.log('[instrumentation] WinForm repository initialization completed');
                                console.timeEnd('[instrumentation] initialization took');
                            })
                            .catch((error) => {
                                console.error('[instrumentation] WinForm repository initialization failed:', error);
                            });
                    }, 11_000);
                })
                .catch((error) => {
                    console.error('[instrumentation] WinGet cache initialization failed:', error);
                });


            console.log('[instrumentation] Server initialization tasks started in background');
        }).catch((error) => {
            console.error('[instrumentation] Atomic operation failed:', error);
        });
    }
}
