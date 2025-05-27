import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {WingetApp} from '@/lib/type';

export default function AppItem({
	app,
	isSelected,
	toggleAppSelection
}: {
	app: WingetApp;
	isSelected: boolean;
	toggleAppSelection: (app: WingetApp) => void;
}) {
	return (
		<Label
			key={app.id}
			className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted">
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
