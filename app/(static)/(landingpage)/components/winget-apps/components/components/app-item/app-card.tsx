import {Card, CardContent} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {WinGetApp} from '@/lib/type';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {Building2, Clock, Star, Tag} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {cn, formatDate} from '@/lib/utils';
import {memo, useMemo} from 'react';

export interface AppCardProps {
	app: WinGetApp;
	selected: boolean;
	onToggle: (app: WinGetApp) => void;
}

function AppCardComponent({app, selected, onToggle}: AppCardProps) {
	return (
		<Card
			role="button"
			tabIndex={0}
			onClick={() => onToggle(app)}
			className={cn(
				'cursor-pointer transition-all hover:shadow-md',
				selected && 'ring-2 ring-primary'
			)}>
			<CardContent className="px-2 flex flex-col h-full">
				<div className="flex items-center gap-2 mb-1">
					<Checkbox
						checked={selected}
						onCheckedChange={() => onToggle(app)}
						onClick={e => e.stopPropagation()}
					/>
					<img
						height={28}
						width={28}
						src={
							app.icon
								? '/winget/apps-icon/' + app.icon
								: '/winget/fallback/app-icon.svg'
						}
					/>
					<h3
						title={app.name}
						className="font-semibold pointer-events-none text-sm truncate">
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

				<ShortDescription desc={app.shortDescription} />
				<Tags tags={app.tags} />

				<div className="flex mt-auto items-center justify-between text-xs text-muted-foreground">
					<Version version={app.version} />
					<Publisher publisher={app.publisher} />
					{app.releaseDate && (
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
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export default memo(
	AppCardComponent,
	(prev, next) =>
		prev.selected === next.selected && prev.app.id === next.app.id
);

function Publisher({publisher}: {publisher: string}) {
	return (
		<Tooltip delayDuration={800}>
			<TooltipTrigger>
				<div className="flex items-center gap-1 max-w-[120px]">
					<Building2 className="h-3 w-3 flex-shrink-0" />
					<span className="truncate">{publisher}</span>
				</div>
			</TooltipTrigger>
			<TooltipContent>
				<p>Publisher: {publisher}</p>
			</TooltipContent>
		</Tooltip>
	);
}

function Version({version}: {version: string}) {
	return (
		<Tooltip delayDuration={800}>
			<TooltipTrigger>
				<div className="flex items-center gap-1">
					<Tag className="h-3 w-3" />
					<span className="truncate">{version}</span>
				</div>
			</TooltipTrigger>
			<TooltipContent>
				<p>Version: {version}</p>
			</TooltipContent>
		</Tooltip>
	);
}

function ShortDescription({desc}: {desc: string}) {
	return (
		<Tooltip delayDuration={800}>
			<TooltipTrigger asChild>
				<p className="text-xs text-muted-foreground mb-2 line-clamp-3">
					{desc}
				</p>
			</TooltipTrigger>
			<TooltipContent className="max-w-xs whitespace-pre-wrap">
				{desc}
			</TooltipContent>
		</Tooltip>
	);
}

function TagsComponent({tags}: {tags: string[]}) {
	// Compute visible tags only if the array reference (or length) changes
	const {visibleTags, extraCount, extraTagsString} = useMemo(() => {
		const visibleTags = tags.slice(0, tags.length > 5 ? 4 : undefined);
		return {
			visibleTags,
			extraCount: tags.length > 5 ? tags.length - 4 : 0,
			extraTagsString: tags.slice(4).join(', ')
		};
	}, [tags]);

	return (
		<div className="flex items-center gap-2 mb-2 flex-wrap">
			{visibleTags.map(tag => (
				<Badge key={tag} variant="outline" className="text-xs">
					{tag}
				</Badge>
			))}
			{extraCount > 0 && (
				<Tooltip>
					<TooltipTrigger asChild>
						<Badge
							variant="secondary"
							className="text-xs cursor-pointer text-gray-600">
							+{extraCount} more
						</Badge>
					</TooltipTrigger>
					<TooltipContent className="max-w-xs whitespace-pre-wrap">
						{extraTagsString}
					</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
}

const Tags = memo(TagsComponent, (prev, next) => prev.tags === next.tags);
