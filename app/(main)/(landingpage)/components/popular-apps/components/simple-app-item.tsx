import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {WinGetApp} from '@/lib/type';
import {useContext} from 'react';
import {SelectedAppsContext} from '../../SelectedAppsContext';

export default function SimpleAppItem({
	app,
	isSelected
}: {
	app: WinGetApp;
	isSelected: boolean;
}) {
	const context = useContext(SelectedAppsContext);
	const {toggleAppSelection} = context;

	return (
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
			<span className="text-md">{app.name}</span>
		</Label>
	);
}
