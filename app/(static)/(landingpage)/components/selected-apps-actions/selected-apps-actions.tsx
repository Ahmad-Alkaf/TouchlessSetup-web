import {Button} from '@/components/ui/button';
import {WinGetApp} from '@/lib/type';
import {X} from 'lucide-react';
import {Check} from 'lucide-react';

export default function SelectedAppsActions({
	selectedApps,
	clearAllSelection,
	installSelected
}: {
	selectedApps: number;
	clearAllSelection: () => void;
	installSelected: () => void;
}) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold">
						Selected Applications
					</h3>
					<p className="text-sm text-muted-foreground">
						{selectedApps} apps selected
					</p>
				</div>
				<div className="space-x-4">
					<Button
						disabled={selectedApps === 0}
						variant="outline"
						size="sm"
						onClick={clearAllSelection}>
						<X className="h-4 w-4 mr-1" />
						Clear All Selection
					</Button>

					<Button
						disabled={selectedApps === 0}
						size="sm"
						onClick={installSelected}>
						<Check className="h-4 w-4 mr-1" />
						Generate Installer ({selectedApps})
					</Button>
				</div>
			</div>
		</div>
	);
}
