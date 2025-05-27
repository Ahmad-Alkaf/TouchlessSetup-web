'use client';

import {useState, useMemo} from 'react';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Search, X, Plus, Check} from 'lucide-react';
import {WingetApp, WingetCategory} from '@/lib/type';
import Category from './components/category';

// Mock app data
const CATEGORIES: WingetCategory[] = [
	{
		name: 'Browser',
		apps: [
			{
				id: 'Google.Chrome',
				name: 'Google Chrome',
				icon:'Google.Chrome.svg'
			},
			{
				id: 'Mozilla.Firefox',
				name: 'Mozilla Firefox',
				icon: 'Mozilla.Firefox.svg'
			},
			{
				id: 'ex.safary',
				name: 'Safari',
			},
			{
				id: 'ex.edge',
				name: 'Edge',
			}
		]
	},
	{
		name: 'Messaging',
		apps: [
			{
				id: 'ex.slack',
				name: 'Slack',
			},
			{
				id: 'Discord.Discord',
				name: 'Discord',
			},
			{
				id: 'ex.teams',
				name: 'Teams',
			},
			{
				id: 'ex.whatsapp',
				name: 'WhatsApp',
			}
		]
	},
	{
		name: 'Development',
		apps: [
			{
				id: 'ex.vscode',
				name: 'Visual Studio',
			},
			{
				id: 'ex.rider',
				name: 'Rider',
			},
			{
				id: 'ex.intellij',
				name: 'IntelliJ',
			}
		]
	},
	{
		name: 'Creative',
		apps: [
			{
				id: 'ex.photoshop',
				name: 'Photoshop',
			},
			{
				id: 'ex.figma',
				name: 'Figma',
			},
			{
				id: 'ex.sketch',
				name: 'Sketch',
			}
		]
	},
	{
		name: 'Media',
		apps: [
			{
				id: 'ex.spotify',
				name: 'Spotify',
			},
			{
				id: 'ex.vlc',
				name: 'VLC',
			},
			{
				id: 'ex.itunes',
				name: 'iTunes',
			}
		]
	}
];

export default function Component() {
	const [categories, setCategories] = useState<WingetCategory[]>(CATEGORIES);
	const [selectedApps, setSelectedApps] = useState<WingetApp[]>([]);

	const toggleApp = (app: WingetApp) => {
		setSelectedApps(prev =>
			prev.map(v => v.id).includes(app.id)
				? prev.filter(a => a.id !== app.id)
				: [...prev, app]
		);
	};

	const clearAll = () => setSelectedApps([]);

	// const filteredApps = useMemo(() => {
	// 	return apps.filter(
	// 		app =>
	// 			app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
	// 			app.category.toLowerCase().includes(searchTerm.toLowerCase())
	// 	);
	// }, [searchTerm]);

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<Card>
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold">Popular Apps</h1>
					<p className="text-muted-foreground">
						List of popular apps users find helpful
					</p>
				</div>
				<CardContent>
					<div className="space-y-6">
						<div className="grid gap-4">
							{categories.map(category => (
								<Category
									category={category}
									selectedApps={selectedApps}
									toggleAppSelection={app => toggleApp(app)}
								/>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold">
							Select Applications
						</h3>
						<p className="text-sm text-muted-foreground">
							{selectedApps.length} apps selected
						</p>
					</div>
					<div className="space-x-2">
						<Button
							disabled={selectedApps.length === 0}
							variant="outline"
							size="sm"
							onClick={clearAll}>
							Clear All
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
