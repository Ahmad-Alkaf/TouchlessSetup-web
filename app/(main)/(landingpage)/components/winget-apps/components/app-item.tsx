import {Badge} from '@/components/ui/badge';
import {Card, CardContent} from '@/components/ui/card';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {WinGetApp} from '@/lib/type';
import {Checkbox} from '@radix-ui/react-checkbox';
import {Box, Clock, Download, Star} from 'lucide-react';
import {useContext} from 'react';
import {SelectedAppsContext} from '../../SelectedAppsContext';

const formatDownloads = (downloads: number) => {
	if (downloads >= 1000000) return `${(downloads / 1000000).toFixed(1)}M`;
	if (downloads >= 1000) return `${(downloads / 1000).toFixed(1)}K`;
	return downloads.toString();
};

const formatDate = (date: Date) => {
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - date.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 1) return '1 day ago';
	if (diffDays < 30) return `${diffDays} days ago`;
	if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
	return `${Math.floor(diffDays / 365)} years ago`;
};
export function AppCard({app}: {app: WinGetApp}) {
	const {toggleAppSelection, isSelected} = useContext(SelectedAppsContext);
	return (
		<Card
			className={`cursor-pointer transition-all hover:shadow-md ${
				isSelected(app) ? 'ring-2 ring-primary' : ''
			}`}>
			<CardContent className="p-4">
				<div className="flex items-start space-x-3">
					<Checkbox
						checked={isSelected(app)}
						onCheckedChange={() => toggleAppSelection(app)}
						onClick={e => e.stopPropagation()}
					/>
					<div
						className="flex-1 min-w-0"
						onClick={() => toggleAppSelection(app)}>
						<div className="flex items-center gap-2 mb-1">
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

						<p className="text-xs text-muted-foreground mb-2 line-clamp-2">
							{app.description}
						</p>

						<div className="flex items-center gap-2 mb-2">
							{app.tags.map(tag => (
								<Badge
									key={tag}
									variant="outline"
									className="text-xs">
									{tag}
								</Badge>
							))}
						</div>

						<div className="flex items-center justify-between text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<Box className="h-3 w-3" />
								<span>{app.version}</span>
							</div>
							<div className="flex items-center gap-1">
								<Clock className="h-3 w-3" />
								<span>{formatDate(app.releaseDate)}</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function AppListItem({app}: {app: WinGetApp}) {
	const {toggleAppSelection, isSelected} = useContext(SelectedAppsContext);
	return (
		<div
			className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
				isSelected(app) ? 'ring-2 ring-primary' : ''
			}`}>
			<Checkbox
				checked={isSelected(app)}
				onCheckedChange={() => toggleAppSelection(app)}
				onClick={e => e.stopPropagation()}
			/>
			<div
				className="flex-1 grid grid-cols-12 gap-4 items-center"
				onClick={() => toggleAppSelection(app)}>
				<div className="col-span-4">
					<div className="flex items-center gap-2">
						<h3 className="font-semibold text-sm truncate">
							{app.name}
						</h3>
						{app.verifiedSilence && (
							<Star className="h-3 w-3 text-yellow-500 fill-current" />
						)}
					</div>
					<p className="text-xs text-muted-foreground truncate">
						{app.description}
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
					<div className="flex items-center gap-1">
						<Star className="h-3 w-3" />
						<span>{app.version}</span>
					</div>
				</div>
				<div className="col-span-2 text-xs text-muted-foreground">
					<div className="flex items-center gap-1">
						<Download className="h-3 w-3" />
						<span>{app.publisher}</span>
					</div>
				</div>
				<div className="col-span-1 text-xs text-muted-foreground">
					{44}MB
				</div>
				<div className="col-span-1 text-xs text-muted-foreground">
					<div className="flex items-center gap-1">
						<Clock className="h-3 w-3" />
						<span>{formatDate(app.releaseDate)}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
