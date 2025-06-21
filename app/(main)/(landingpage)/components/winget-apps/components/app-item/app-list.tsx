import {Badge} from '@/components/ui/badge';
import {Card, CardContent} from '@/components/ui/card';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {WinGetApp} from '@/lib/type';
import {Checkbox} from '@radix-ui/react-checkbox';
import {Box, Building2, Clock, Download, Star, Tag} from 'lucide-react';
import {useContext} from 'react';
import {formatDate} from '@/lib/utils';
import {SelectedAppsContext} from '../../../SelectedAppsContext';

export function AppListItem({app}: {app: WinGetApp}) {
	const {toggleAppSelection, isSelected} = useContext(SelectedAppsContext);
	return (
		<div
			className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
				isSelected(app) ? 'ring-2 ring-primary' : ''
			}`}>
			<div
				className="flex-1 grid grid-cols-12 gap-4 items-center"
				onClick={() => toggleAppSelection(app)}>
				<div className="col-span-4">
			<Checkbox
				checked={isSelected(app)}
				onCheckedChange={() => toggleAppSelection(app)}
				onClick={e => e.stopPropagation()}
			/>
					<div className="flex items-center gap-2">
						<h3 className="font-semibold text-sm truncate">
							{app.name}
						</h3>
						{app.verifiedSilence && (
							<Tooltip>
								<TooltipTrigger>
									<Star className="h-3 w-3 text-yellow-500 fill-current" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Verified Silence Installation</p>
								</TooltipContent>
							</Tooltip>
						)}
					</div>
					<p className="text-xs text-muted-foreground truncate">
						{app.shortDescription}
					</p>
				</div>
				<div className="col-span-2">
					{app.tags.map(tag => (
						<Badge key={tag} variant="outline" className="text-xs">
							{tag}
						</Badge>
					))}
				</div>
				<div className="col-span-2 text-xs text-muted-foreground">
					<Tooltip>
						<TooltipTrigger>
							<div className="flex items-center gap-1">
								<Tag className="h-3 w-3" />
								<span>{app.version}</span>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Package Version</p>
						</TooltipContent>
					</Tooltip>
				</div>
				<div className="col-span-2 text-xs text-muted-foreground">
					<Tooltip>
						<TooltipTrigger>
							<div className="flex items-center gap-1">
								<Building2 className="h-3 w-3" />
								<span>{app.publisher}</span>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Publisher</p>
						</TooltipContent>
					</Tooltip>
				</div>
				{app.releaseDate && (
					<div className="col-span-1 text-xs text-muted-foreground">
						<Tooltip>
							<TooltipTrigger>
								<div className="flex items-center gap-1">
									<Clock className="h-3 w-3" />
									<span>{formatDate(app.releaseDate)}</span>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Release Date</p>
							</TooltipContent>
						</Tooltip>
					</div>
				)}
			</div>
		</div>
	);
}
