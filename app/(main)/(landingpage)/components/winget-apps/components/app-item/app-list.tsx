import {Badge} from '@/components/ui/badge';
import {Card, CardContent} from '@/components/ui/card';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {WinGetApp} from '@/lib/type';
import {Checkbox} from '@radix-ui/react-checkbox';
import {Building2, Clock, Star, Tag} from 'lucide-react';
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
					<Tooltip>
						<TooltipTrigger asChild>
							<p className="text-xs text-muted-foreground truncate max-w-full">
								{app.shortDescription.length > 140
									? `${app.shortDescription.slice(0, 140)}...`
									: app.shortDescription}
							</p>
						</TooltipTrigger>
						<TooltipContent className="max-w-xs whitespace-pre-wrap">
							{app.shortDescription}
						</TooltipContent>
					</Tooltip>
				</div>
				<div className="col-span-2 flex items-center gap-1 flex-wrap">
					{(() => {
						const visibleTags = app.tags.slice(0, 4);
						return visibleTags.map(tag => (
							<Badge
								key={tag}
								variant="outline"
								className="text-xs">
								{tag}
							</Badge>
						));
					})()}
					{app.tags.length > 4 && (
						<Tooltip>
							<TooltipTrigger asChild>
								<Badge
									variant="secondary"
									className="text-xs cursor-pointer text-gray-600">
									+{app.tags.length - 4}
								</Badge>
							</TooltipTrigger>
							<TooltipContent className="max-w-xs whitespace-pre-wrap">
								{app.tags.slice(4).join(', ')}
							</TooltipContent>
						</Tooltip>
					)}
				</div>
				<div className="col-span-2 text-xs text-muted-foreground">
					<Tooltip>
						<TooltipTrigger>
							<div className="flex items-center gap-1">
								<Tag className="h-3 w-3" />
								<span>{app.version}</span>
							</div>
						</TooltipTrigger>
						<TooltipContent>Package Version</TooltipContent>
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
						<TooltipContent>Publisher</TooltipContent>
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
