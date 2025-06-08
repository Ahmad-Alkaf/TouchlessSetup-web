'use client';
import {WinGetApp} from '@/lib/type';
import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState
} from 'react';
import PopularApps from './popular-apps/popular-apps';
import WingetApps from './winget-apps/winget-apps';
import {Button} from '@/components/ui/button';

type SelectedAppsContextType = {
	selectedApps: WinGetApp[];
	setSelectedApps: Dispatch<SetStateAction<WinGetApp[]>>;
	toggleAppSelection: (app: WinGetApp) => void;
	clearAllSelection: () => void;
	isSelected: (app: WinGetApp) => boolean;
};

export const SelectedAppsContext = createContext<SelectedAppsContextType>(
	null as unknown as SelectedAppsContextType
);

export function SelectedApps() {
	const [selectedApps, setSelectedApps] = useState<WinGetApp[]>([]);
	const clearAllSelection = () => setSelectedApps([]);
	const isSelected = (app: WinGetApp) =>
		selectedApps.map(v => v.id).includes(app.id);
	const toggleAppSelection = (app: WinGetApp) => {
		setSelectedApps(prev =>
			prev.map(v => v.id).includes(app.id)
				? prev.filter(a => a.id !== app.id)
				: [...prev, app]
		);
	};

	return (
		<SelectedAppsContext.Provider
			value={{
				selectedApps,
				setSelectedApps,
				toggleAppSelection,
				clearAllSelection,
				isSelected
			}}>
			<div className="max-w-6xl mx-auto p-6 space-y-6">
				<PopularApps />
				<WingetApps />
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold">
								Selected Applications
							</h3>
							<p className="text-sm text-muted-foreground">
								{selectedApps.length} apps selected
							</p>
						</div>
						<div className="space-x-2">
							<Button
								disabled={selectedApps.length === 0}
								variant="outline"
								size="sm"
								onClick={clearAllSelection}>
								Clear All Selection
							</Button>
						</div>
					</div>
				</div>
			</div>
		</SelectedAppsContext.Provider>
	);
}
