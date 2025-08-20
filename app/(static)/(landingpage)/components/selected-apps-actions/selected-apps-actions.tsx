'use client';
import {Button} from '@/components/ui/button';
import {X} from 'lucide-react';
import {Check} from 'lucide-react';
import {useContext} from 'react';
import {SelectedAppsContext} from '../context';
import GenerateInstallerBtn from './generate-installer-btn';

export default function SelectedAppsActions() {
	const {clearAllSelection, installSelected, selectedApps} =
		useContext(SelectedAppsContext);
	return (
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
				<div className="space-x-4 flex md:flex-row flex-col space-y-4">
					<Button
						disabled={selectedApps.length === 0}
						variant="outline"
						size="sm"
						onClick={clearAllSelection}>
						<X className="h-4 w-4 mr-1" />
						Clear All Selection
					</Button>
					<GenerateInstallerBtn/>

				</div>
			</div>
		</div>
	);
}
