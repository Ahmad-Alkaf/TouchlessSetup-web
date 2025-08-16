import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {type WinGetCategory} from '@/lib/type';
import {useContext} from 'react';
import {SelectedAppsContext} from '../../context';

export default function SimpleAppItem({
	app,
	isSelected
}: {
	app: WinGetCategory['apps'][number];
	isSelected: boolean;
}) {
	const context = useContext(SelectedAppsContext);
	const {toggleAppSelection} = context;

	return (
		// <Tooltip>
		// 	<TooltipTrigger asChild>
				<Label
					key={app.id}
					className={
						'flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted ' +
						(isSelected ? 'ring-2 ring-primary' : '')
					}>
					<Checkbox
						checked={isSelected}
						onCheckedChange={() => toggleAppSelection(app)}
					/>
					<img
						height={24}
						width={24}
						src={
							app.icon
								? '/winget/apps-icon/' + app.icon
								: '/winget/fallback/app-icon.svg'
						}
					/>
					<span title={app.name} className="text-md">
						{app.name}
					</span>
				</Label>
		// 	</TooltipTrigger>
		// 	<TooltipContent>
		// 		<div className="flex items-center gap-1">
		// 			<Tag className="h-3 w-3" />
		// 			<span>{app.version}</span>
		// 		</div>
		// 		{app.publisher && (
		// 			<div className="flex items-center gap-1">
		// 				<Building2 className="h-3 w-3" />
		// 				<span>{app.publisher}</span>
		// 			</div>
		// 		)}
		// 		{app.releaseDate && (
		// 			<div className="flex items-center gap-1">
		// 				<Calendar className="h-3 w-3" />
		// 				<span>{formatDate(app.releaseDate)}</span>
		// 			</div>
		// 		)}
		// 	</TooltipContent>
		// </Tooltip>
	);
}
