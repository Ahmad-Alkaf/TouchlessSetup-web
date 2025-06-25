'use client';
import {WinGetApp} from '@/lib/type';
import {
	createContext,
	Dispatch,
	SetStateAction,
	useState,
	useCallback
} from 'react';
import PopularApps from './popular-apps/popular-apps';
import WingetAppsCard from './winget-apps/winget-apps-card';
import SelectedAppsActions from './selected-apps-actions/selected-apps-actions';

type SelectedAppsContextType = {
	selectedApps: WinGetApp[];
	setSelectedApps: Dispatch<SetStateAction<WinGetApp[]>>;
	toggleAppSelection: (app: WinGetApp) => void;
	clearAllSelection: () => void;
	isSelected: (app: WinGetApp) => boolean;
	wingetApps: WinGetApp[] | null;
	setWingetApps: Dispatch<SetStateAction<WinGetApp[] | null>>;
	installSelected: () => void;
};

export const SelectedAppsContext = createContext<SelectedAppsContextType>(
	null as unknown as SelectedAppsContextType
);

export function SelectedApps() {
	const [selectedApps, setSelectedApps] = useState<WinGetApp[]>([]);
	const [wingetApps, setWingetApps] = useState<WinGetApp[] | null>(null);
	const clearAllSelection = () => setSelectedApps([]);

	// Memoized callback to check selection status to avoid new function reference on each render
	const isSelected = useCallback(
		(app: WinGetApp) => selectedApps.some(v => v.id === app.id),
		[selectedApps]
	);

	// Memoized toggle function to maintain stable reference between renders
	const toggleAppSelection = useCallback((app: WinGetApp) => {
		setSelectedApps(prev =>
			prev.some(v => v.id === app.id)
				? prev.filter(a => a.id !== app.id)
				: [...prev, app]
		);
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

	return (
		<SelectedAppsContext.Provider
			value={{
				selectedApps,
				setSelectedApps,
				toggleAppSelection,
				clearAllSelection,
				isSelected,
				wingetApps,
				setWingetApps,
				installSelected
			}}>
			<div className="max-w-6xl mx-auto p-6 space-y-6">
				<PopularApps />
				<SelectedAppsActions selectedApps={selectedApps.length} clearAllSelection={clearAllSelection} installSelected={installSelected} />
				<WingetAppsCard />
				{wingetApps !== null && (
					<SelectedAppsActions
						selectedApps={selectedApps.length}
						clearAllSelection={clearAllSelection}
						installSelected={installSelected}
					/>
				)}
			</div>
		</SelectedAppsContext.Provider>
	);
}
