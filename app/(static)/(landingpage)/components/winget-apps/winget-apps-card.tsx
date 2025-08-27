'use client';
import {Card, CardContent} from '@/components/ui/card';
import WingetApps from './components/winget-apps';
import {useContext} from 'react';
import {SelectedAppsContext} from '../context';
import Loading from '@/app/(static)/loading';
import {WinGetApp} from '@/lib/type';
import {TotalApps} from '../../../../../components/shared/total-apps';

export default function WingetAppsCard() {
	const {apps, isLoading, totalApps} = useContext(SelectedAppsContext);

	if (apps == null && !isLoading) return null;
	return (
		<Card>
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold">All Apps</h1>
				<p className="text-muted-foreground">
					Browse <TotalApps /> available applications and growing.
				</p>
			</div>
			<CardContent>
				{isLoading && apps === null ? (
					<Loading />
				) : (
					<div className="space-y-6">
						<div className="grid gap-4">
							<WingetApps apps={apps as WinGetApp[]} />
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
