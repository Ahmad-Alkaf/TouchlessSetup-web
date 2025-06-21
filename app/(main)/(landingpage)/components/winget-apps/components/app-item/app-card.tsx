import {Card, CardContent} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {WinGetApp} from '@/lib/type';
import {useContext} from 'react';
import {SelectedAppsContext} from '../../../SelectedAppsContext';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {Building2, Clock, Star, Tag} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {formatDate} from '@/lib/utils';

export default function AppCard({app}: {app: WinGetApp}) {
	const {toggleAppSelection, isSelected} = useContext(SelectedAppsContext);
	return (
		<Card
			className={`cursor-pointer transition-all hover:shadow-md ${
				isSelected(app) ? 'ring-2 ring-primary' : ''
			}`}>
			<CardContent className="p-2">
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
							<h3
								title={app.name}
								className="font-semibold text-sm truncate">
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

						{app.shortDescription &&
						app.shortDescription.length > 140 ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<p className="text-xs text-muted-foreground mb-2">
										{app.shortDescription.length > 140
											? `${app.shortDescription.slice(
													0,
													140
											  )}...`
											: app.shortDescription}
									</p>
								</TooltipTrigger>
								<TooltipContent className="max-w-xs whitespace-pre-wrap">
									{app.shortDescription}
								</TooltipContent>
							</Tooltip>
						) : (
							<p className="text-xs text-muted-foreground mb-2 ">
								{app.shortDescription}
							</p>
						)}

						{/* Tags - show  */}
						<div className="flex items-center gap-2 mb-2 flex-wrap">
							{(() => {
								const visibleTags = app.tags.slice(
									0,
									app.tags.length > 5 ? 4 : undefined
								);
								return visibleTags.map(tag => (
									<Badge
										key={tag}
										variant="outline"
										className="text-xs">
										{tag}
									</Badge>
								));
							})()}
							{app.tags.length > 5 && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Badge
											variant="secondary"
											className="text-xs cursor-pointer text-gray-600">
											+{app.tags.length - 4} more
										</Badge>
									</TooltipTrigger>
									<TooltipContent className="max-w-xs whitespace-pre-wrap">
										{app.tags.slice(4).join(', ')}
									</TooltipContent>
								</Tooltip>
							)}
						</div>

						<div className="flex items-center justify-between text-xs text-muted-foreground">
							<Tooltip>
								<TooltipTrigger>
									<div className="flex items-center gap-1">
										<Tag className="h-3 w-3" />
										<span>{app.version}</span>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>Version</p>
								</TooltipContent>
							</Tooltip>
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
							{app.releaseDate && (
								<Tooltip>
									<TooltipTrigger>
										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											<span>
												{formatDate(app.releaseDate)}
											</span>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>Release Date</p>
									</TooltipContent>
								</Tooltip>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
