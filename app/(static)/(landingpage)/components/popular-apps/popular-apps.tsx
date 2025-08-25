'use client';
import {Card, CardContent} from '@/components/ui/card';
import {Star, Lightbulb} from 'lucide-react';
import Category from './components/category';
import {CATEGORIES} from './components/CATEGORIES';
import {useContext} from 'react';
import {SelectedAppsContext} from '../context';

export default function PopularApps() {
	const {apps: wingetApps} = useContext(SelectedAppsContext);
	if (Array.isArray(wingetApps) && wingetApps.length > 0) {
		CATEGORIES.forEach(category => {
			category.apps.forEach(app => {
				const wingetApp = wingetApps.find(v => v.id === app.id);
				app = {...app, ...wingetApp};
			});
		});
	}
	return (
		<Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
			<div className="text-center space-y-3 pt-6">
				<h1 id="popular-apps" className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
					<Star className="h-8 w-8 text-yellow-500" />
					Fan Favorites
				</h1>
				<p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
					These are the apps everyone's talking about! Click any app to add it to your custom installer. Mix and match to create your perfect setup. 
				</p>
				<div className="inline-flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
					<Lightbulb className="h-4 w-4 text-blue-600" />
					<span><strong>Tip:</strong> Select multiple apps to build your ultimate installer package!</span>
				</div>
			</div>
			<CardContent>
				<div className="grid gap-8">
					{CATEGORIES.map(category => (
						<Category key={category.name} category={category} />
					))}
				</div>
			</CardContent>
		</Card>
	);
}
