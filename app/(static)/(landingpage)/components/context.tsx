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
			// Simulate progress updates
			const progressInterval = setInterval(() => {
				setGenerationProgress(prev => {
					if (prev >= 90) {
						clearInterval(progressInterval);
						return 90; // Keep at 90% until actual completion
					}
					const next = prev + Math.random() * (11 - prev / 10); // Random increments for realism
					if (prev > next) return prev;
					return next;
				});
			}, 600);

			// Send POST request to API route
			const response = await fetch('/api/generate-installer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					selectedApps: selectedApps.map(app => ({
						id: app.id,
						name: app.name
					}))
				})
			});

			// Clear the interval and set to 100% on completion
			clearInterval(progressInterval);
			setGenerationProgress(100);

			if (!response.ok) {
				// Handle error response
				const errorData = await response
					.json()
					.catch(() => ({
						error: 'Failed to generate installer: Unknown error'
					}));
				alert(
					errorData.error ??
						'Failed to generate installer: Unknown error'
				);
				return;
			}

			// Brief delay to show 100% completion
			await new Promise(resolve => setTimeout(resolve, 500));

			// Check if response is a file download
			const contentDisposition = response.headers.get(
				'Content-Disposition'
			);
			if (
				contentDisposition &&
				contentDisposition.includes('attachment')
			) {
				// Handle file download
				const blob = await response.blob();
				const filename =
					contentDisposition
						.split('filename=')[1]
						?.replace(/["']/g, '') || 'installer.exe';

				// Create download link
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = filename;
				link.style.display = 'none';

				// Trigger download
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				// Clean up the blob URL
				window.URL.revokeObjectURL(url);

				// Clear selection after successful download
				clearAllSelection();
			} else {
				// Handle JSON response (error case)
				const result = await response.json();
				alert(
					`Failed to generate installer: ${
						result.error || 'Unknown error'
					}`
				);
			}
		} catch (error) {
			console.error('Error during installation:', error);
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
