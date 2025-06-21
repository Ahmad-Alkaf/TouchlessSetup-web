'use client';

import {useState, useMemo, useContext} from 'react';
import {Badge} from '@/components/ui/badge';
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
import {WinGetApp, WinGetCategory} from '@/lib/type';
import SimpleAppItem from './simple-app-item';
import App from 'next/app';
import {SelectedAppsContext} from '../../SelectedAppsContext';

export default function Category({category}: {category: WinGetCategory}) {
	const {toggleAppSelection, selectedApps, isSelected} = useContext(SelectedAppsContext);
	const selectedCount = category.apps.filter(app =>
		selectedApps.map(v => v.id).includes(app.id)
	).length;
	if (category.apps.length === 0) return null;

	return (
		<Card key={category.name}>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<CardTitle className="text-base">
							{category.name}
						</CardTitle>
						<Badge variant="secondary">
							{selectedCount}/{category.apps.length}
						</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent>
					<div className="grid grid-cols-2 gap-2">
						{category.apps.map(app => (
							<SimpleAppItem
								key={app.id}
								app={app}
								isSelected={selectedApps
									.map(v => v.id)
									.includes(app.id)}
							/>
						))}
					</div>
			</CardContent>
		</Card>
	);
}
