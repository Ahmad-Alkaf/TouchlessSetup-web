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
import PopularApps from './popular-apps/popular-apps';
import WingetAppsCard from './winget-apps/winget-apps-card';
import SelectedAppsActions from './selected-apps-actions/selected-apps-actions';
import loadWingetApps, {
	type LoadWingetAppsRet,
	type SortOption
} from '@/actions/load-winget-apps';
import {CATEGORIES} from './popular-apps/components/CATEGORIES';

type SelectedAppsContextType = {
	selectedApps: WinGetApp[];
	setSelectedApps: Dispatch<SetStateAction<WinGetApp[]>>;
	toggleAppSelection: (app: WinGetApp) => void;
	clearAllSelection: () => void;
	isSelected: (app: WinGetApp) => boolean;
	installSelected: () => void;
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

	const installSelected = () => {
		if (typeof window !== 'undefined') {
			const message =
				`The installation feature is NOT IMPLEMENTED yet.\n\n` +
				(selectedApps.length > 0
					? `You have selected ${selectedApps.length} app${
							selectedApps.length > 1 ? 's' : ''
					  }:\n` +
					  selectedApps.map(app => `• ${app.name}`).join('\n')
					: 'No applications selected.');
			alert(message);
		} else alert('NOT IMPLEMENTED');
	};

	useEffect(() => {
		console.log('Calling wingetApps from client');
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
		<SelectedAppsContext.Provider
			value={{
				selectedApps,
				setSelectedApps,
				toggleAppSelection,
				clearAllSelection,
				isSelected,
				apps: apps,
				installSelected,
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
	);
}
