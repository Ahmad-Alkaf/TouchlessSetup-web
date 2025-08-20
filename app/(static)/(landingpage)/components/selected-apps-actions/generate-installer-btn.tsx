import {Button} from '@/components/ui/button';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {Check} from 'lucide-react';
import {useContext} from 'react';
import {SelectedAppsContext} from '../context';

export default function GenerateInstallerBtn({
	hideCheck = false
}: {
	hideCheck?: boolean;
}) {
	const {installSelected, selectedApps} = useContext(SelectedAppsContext);
	const count = selectedApps.length;
	return (
		<Tooltip delayDuration={400}>
			<TooltipTrigger asChild>
				{/* span wrapper ensures tooltip works when button is disabled */}
				<span>
					<Button
						disabled={count === 0}
						size="sm"
						onClick={installSelected}
						aria-label={`Generate installer for ${count} selected app${count === 1 ? '' : 's'}`}
					>
						{!hideCheck && <Check className="h-4 w-4 mr-1" />}
						Generate Installer ({count})
					</Button>
				</span>
			</TooltipTrigger>
			<TooltipContent sideOffset={6}>
				{count === 0 ? 'No apps selected' : `${count} selected app${count === 1 ? '' : 's'}`}
			</TooltipContent>
		</Tooltip>
	);
}
