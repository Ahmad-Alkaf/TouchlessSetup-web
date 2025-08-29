import {Button} from '@/components/ui/button';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {Sparkles, Rocket, Loader2} from 'lucide-react';
import {useContext} from 'react';
import {SelectedAppsContext} from '../context';
import {cn} from '@/lib/utils';

export default function GenerateInstallerBtn() {
	const {installSelected, selectedApps, isGenerating} =
		useContext(SelectedAppsContext);
	const count = selectedApps.length;

	return (
		<Tooltip delayDuration={400}>
			<TooltipTrigger asChild>
				{/* span wrapper ensures tooltip works when button is disabled */}
				<span>
					<Button
						disabled={count === 0 || isGenerating}
						size="sm"
						onClick={async () => installSelected()}
						className={cn(
							'font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-600 bg-gradient-to-r from-green-700 to-emerald-700',
							isGenerating && 'animate-pulse cursor-not-allowed'
						)}
						aria-label={`Generate installer for ${count} selected app${
							count === 1 ? '' : 's'
						}`}>
						{isGenerating ? (
							<>
								<Loader2 className="h-4 w-4 mr-1 animate-spin" />
								Generating...
							</>
						) : (
							<>
								<Sparkles className="h-4 w-4 mr-1" />
								Generate Installer ({count})
							</>
						)}
					</Button>
				</span>
			</TooltipTrigger>
			<TooltipContent
				sideOffset={6}
				className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg">
				{isGenerating ? (
					<div className="flex items-center gap-1">
						<Loader2 className="h-4 w-4 animate-spin" />
						Creating your installer...
					</div>
				) : count === 0 ? (
					<div className="flex items-center gap-1">
						Select some apps to get started!
					</div>
				) : (
					<div className="flex items-center gap-1">
						<Rocket className="h-4 w-4" />
						Ready to install {count} awesome app
						{count === 1 ? '' : 's'}!
					</div>
				)}
			</TooltipContent>
		</Tooltip>
	);
}
