'use client';
import {Card, CardContent} from '@/components/ui/card';
import WingetApps from './components/winget-apps';
import wingetApps from '@/actions/load-winget-apps';
import {WinGetApp} from '@/lib/type';
import {Suspense, useContext, useEffect, useState} from 'react';
import {SelectedAppsContext} from '../SelectedAppsContext';
import Loading from '@/app/(main)/loading';

export default function WingetAppsCard() {
	const {setWingetApps, wingetApps: apps} = useContext(SelectedAppsContext);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		if (apps == null) {
			console.log('Calling wingetApps from client');
			setIsLoading(true);
			wingetApps()
				.then(setWingetApps)
				.finally(() => setIsLoading(false));
		} else setIsLoading(false);
	}, []);
	if (apps == null && !isLoading) return null;
	return (
		<Card>
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold">All Apps</h1>
				<p className="text-muted-foreground">
					Browse{' '}
					{(apps?.length
						.toLocaleString('us')
						.substring(
							0,
							apps.length.toLocaleString('us').length - 2
						) ?? '90') + '00'}
					+ available applications and growing.
				</p>
			</div>
			<CardContent>
				{isLoading || apps === null ? (
					<Loading />
				) : (
					<div className="space-y-6">
						<div className="grid gap-4">
							<WingetApps apps={apps} />
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
