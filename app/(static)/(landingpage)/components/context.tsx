'use client';
import {WinGetApp} from '@/lib/type';
import {
	createContext,
	Dispatch,
	SetStateAction,
	useState,
	useCallback,
	useEffect
} from 'react';
import loadWingetApps, {
	type LoadWingetAppsRet,
	type SortOption
} from '@/actions/load-winget-apps';
import {CATEGORIES} from './popular-apps/components/CATEGORIES';
import LoadingModal from '@/components/ui/loading-modal';
import {generateFilename} from '@/app/api/generate-installer/components/generate-filename';

type SelectedAppsContextType = {
	selectedApps: WinGetApp[];
	setSelectedApps: Dispatch<SetStateAction<WinGetApp[]>>;
	toggleAppSelection: (app: WinGetApp) => void;
	clearAllSelection: () => void;
	isSelected: (app: WinGetApp) => boolean;
	installSelected: () => Promise<void>;
	isGenerating: boolean;
	generationProgress: number;
	/**
	 * Apps that are filtered and sorted and limited by pagination.
	 */
	apps: WinGetApp[] | null;
	/**
	 * Number of apps to skip for pagination.
	 */
	skip: number;
	setSkip: Dispatch<SetStateAction<number>>;
	/**
	 * Number of apps to take per page.
	 */
	take: number;
	setTake: Dispatch<SetStateAction<number>>;
	/**
	 * Total number of apps available in the repository.
	 */
	totalApps: number;
	/**
	 * Total number of apps after filtering but without pagination.
	 */
	totalFilteredApps: number;
	searchTerm: string;
	setSearchTerm: Dispatch<SetStateAction<string>>;
	sortBy: SortOption;
	setSortBy: Dispatch<SetStateAction<SortOption>>;
	isLoading: boolean;
};

export const SelectedAppsContext = createContext<SelectedAppsContextType>(
	null as unknown as SelectedAppsContextType
);

export function Context({children}: {children: React.ReactNode}) {
	const [selectedApps, setSelectedApps] = useState<WinGetApp[]>([]);
	const [apps, setApps] = useState<WinGetApp[] | null>(null);
	const [totalFilteredApps, setTotalFilteredApps] = useState<number>(9500);
	const [totalApps, setTotalApps] = useState<number>(9500);
	const [skip, setSkip] = useState<number>(0);
	const [take, setTake] = useState<number>(20);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [sortBy, setSortBy] = useState<SortOption>('popular');
	const [isLoading, setIsLoading] = useState(true);
	const [isGenerating, setIsGenerating] = useState(false);
	const [generationProgress, setGenerationProgress] = useState<number>(0);
	const clearAllSelection = () => setSelectedApps([]);

	// Memoized callback to check selection status to avoid new function reference on each render
	const isSelected = useCallback(
		(app: WinGetApp) => selectedApps.some(v => v.id === app.id),
		[selectedApps]
	);

	// Memoized toggle function to maintain stable reference between renders
	const toggleAppSelection = useCallback((app: WinGetApp) => {
		setSelectedApps(prev => {
			if (prev.some(v => v.id === app.id))
				return prev.filter(a => a.id !== app.id);
			return [...prev, app];
		});
	}, []);

	const installSelected = async () => {
		if (selectedApps.length === 0) {
			alert('No applications selected for installation.');
			return;
		}

		setIsGenerating(true);
		setGenerationProgress(0);

		try {
			// Phase 1: Server generation (0-50%)
			let serverProgressInterval: NodeJS.Timeout | null = null;
			let response: Response;
			
			const PROGRESS_THROTTLE_MS = 400;
			try {
				serverProgressInterval = setInterval(() => {
					try {
						setGenerationProgress(prev => {
							if (prev >= 49) {
								if (serverProgressInterval) {
									clearInterval(serverProgressInterval);
									serverProgressInterval = null;
								}
								return 49; // Keep at 49% until server completes
							}
							const next = prev + Math.random() * (10 - prev / 10); // Random increments for realism
							return Math.min(next, 49);
						});
					} catch (progressError) {
						// Ignore progress update errors during server phase
						console.warn('Server progress update error (ignored):', progressError);
					}
				}, PROGRESS_THROTTLE_MS);

				// Send POST request to API route
				response = await fetch('/api/generate-installer', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						selectedApps: selectedApps.map(app => ({
							id: app.id,
							name: app.name
						}))
					})
				});

				// Server generation complete - safely clear interval and set to 50%
				if (serverProgressInterval) {
					clearInterval(serverProgressInterval);
					serverProgressInterval = null;
				}
				
				try {
					setGenerationProgress(50);
				} catch (progressError) {
					console.warn('Failed to set progress to 50% (ignored):', progressError);
				}

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({
						error: 'Failed to generate installer: Unknown error'
					}));
					alert(
						errorData.error ??
							'Failed to generate installer: Unknown error'
					);
					return;
				}
			} catch (serverError) {
				// Clean up interval if server request fails
				if (serverProgressInterval) {
					clearInterval(serverProgressInterval);
				}
				throw serverError;
			}

			// Phase 2: Download progress (50-100%)
			let blob: Blob;
			
			try {
				const contentLength = response.headers.get('content-length');
				const totalSize = contentLength ? parseInt(contentLength, 10) : 0;

				if (totalSize > 0 && response.body) {
					// Attempt to track download progress with ReadableStream
					try {
						const reader = response.body.getReader();
						let downloadedBytes = 0;
						const chunks: Uint8Array[] = [];
						let lastProgressUpdate = Date.now();

						while (true) {
							const { done, value } = await reader.read();

							if (done) break;

							if (value) {
								chunks.push(value);
								downloadedBytes += value.length;

								// Throttle progress updates to match server timing 
								const now = Date.now();
								if (now - lastProgressUpdate >= PROGRESS_THROTTLE_MS || downloadedBytes >= totalSize) {
									try {
										const downloadProgress = (downloadedBytes / totalSize) * 50;
										const newProgress = 50 + downloadProgress;
										if (newProgress >= 50 && newProgress <= 100) {
											setGenerationProgress(newProgress);
											lastProgressUpdate = now;
										}
									} catch (progressError) {
										// Ignore progress calculation errors, continue downloading
										console.warn('Progress calculation error (ignored):', progressError);
									}
								}
							}
						}

						// Successfully read all chunks
						blob = new Blob(chunks as BlobPart[], { type: 'application/octet-stream' });
						setGenerationProgress(100);
						
					} catch (streamError) {
						// If streaming fails, fall back to simple blob download
						console.warn('Stream reading failed, falling back to blob download:', streamError);
						setGenerationProgress(75);
						blob = await response.blob();
						setGenerationProgress(100);
					}
				} else {
					// No content length or no readable stream - use simple blob download
					setGenerationProgress(75);
					blob = await response.blob();
					setGenerationProgress(100);
				}
			} catch (downloadError) {
				// If all download attempts fail, this is a real error
				console.error('Download failed:', downloadError);
				throw new Error('Failed to download installer file');
			}

			// File download logic - this should always work if we got here
			try {
				const contentDisposition = response.headers.get('Content-Disposition');
				const filename = contentDisposition
					?.split('filename=')[1]
					?.replace(/["']/g, '') || 
					`${generateFilename(selectedApps)}.exe`;

				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = filename;
				link.style.display = 'none';

				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				window.URL.revokeObjectURL(url);
				
			} catch (fileError) {
				console.error('File download trigger failed:', fileError);
				// Even if download link fails, we still have the blob
				// User can try to save it manually or we could show an alternative
				throw new Error('Failed to trigger file download');
			}

			// Brief delay to show 100% completion
			await new Promise(resolve => setTimeout(resolve, 500));

			// Clear selection after successful download
			clearAllSelection();
		} catch (error) {
			console.error('Error during fetch the installer file:', error);
			alert(
				'An unexpected error occurred while generating the installer. Please try again.'
			);
		} finally {
			setIsGenerating(false);
			setGenerationProgress(0);
		}
	};

	useEffect(() => {
		setIsLoading(true);
		loadWingetApps(take, skip, searchTerm, sortBy)
			.then((data: LoadWingetAppsRet) => {
				if (data == null) return;
				let categoriezedApps: WinGetApp[] = CATEGORIES.flatMap(
					category => category.apps
				);
				setApps(
					data.filteredApps.map(v => {
						let app = categoriezedApps.find(c => c.id === v.id);
						return app
							? {...v, verifiedSilence: true, icon: app.icon}
							: v;
					})
				);
				setTotalFilteredApps(data.totalFilteredApps);
				setTotalApps(data.totalApps);
			})
			.catch(console.error)
			.finally(() => setIsLoading(false));
	}, [take, skip, searchTerm]);

	return (
		<>
			<SelectedAppsContext.Provider
				value={{
					selectedApps,
					setSelectedApps,
					toggleAppSelection,
					clearAllSelection,
					isSelected,
					apps: apps,
					installSelected,
					isGenerating,
					generationProgress,
					skip,
					setSkip,
					take,
					setTake,
					searchTerm,
					setSearchTerm,
					sortBy,
					setSortBy,
					isLoading,
					totalFilteredApps,
					totalApps
				}}>
				{children}
			</SelectedAppsContext.Provider>

			{/* Global Loading Modal */}
			<LoadingModal
				isOpen={isGenerating}
				title="Generating Installer"
				description={`Creating your custom installer with ${
					selectedApps.length
				} selected app${selectedApps.length === 1 ? '' : 's'}...`}
				progress={generationProgress}
			/>
		</>
	);
}
