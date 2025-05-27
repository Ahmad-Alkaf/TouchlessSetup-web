'use client';

import {useState, useMemo} from 'react';
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
import {WingetApp, WingetCategory} from '@/lib/type';
import AppItem from './app-item';
import App from 'next/app';

export default function Category({
	category,
	selectedApps,
	toggleAppSelection
}: {
	category: WingetCategory;
	selectedApps: WingetApp[];
	toggleAppSelection: (app: WingetApp) => void;
}) {
	const selectedCount = category.apps.filter(app =>
		selectedApps.map(v => v.id).includes(app.id)
	).length;

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
				{category.apps.length === 0 ? (
					<p className="text-sm text-muted-foreground py-4">
						No apps found in this category
					</p>
				) : (
					<div className="grid grid-cols-2 gap-2">
						{category.apps.map(app => (
							<AppItem
								app={app}
								toggleAppSelection={toggleAppSelection}
								isSelected={selectedApps
									.map(v => v.id)
									.includes(app.id)}
							/>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
