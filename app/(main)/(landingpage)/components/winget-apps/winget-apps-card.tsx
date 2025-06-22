'use client';
import {Card, CardContent} from '@/components/ui/card';
import WingetApps from './components/winget-apps';
import wingetApps from '@/actions/load-winget-apps';
import {useContext, useEffect, useState} from 'react';
import {SelectedAppsContext} from '../SelectedAppsContext';
import Loading from '@/app/(main)/loading';
import {CATEGORIES} from '../popular-apps/components/CATEGORIES';
import {WinGetApp} from '@/lib/type';

export default function WingetAppsCard() {
	const {setWingetApps, wingetApps: apps} = useContext(SelectedAppsContext);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		if (apps == null) {
			console.log('Calling wingetApps from client');
			setIsLoading(true);
			wingetApps()
				.then(apps => {
					let categoriezedApps: WinGetApp[] = CATEGORIES.flatMap(
						category => category.apps
					);
					apps =
						apps?.map(v =>
							categoriezedApps.some(c => c.id === v.id)
								? {...v, verifiedSilence: true}
								: v
						) ?? null;
					setWingetApps(apps);
				})
				.catch(console.error)
				.finally(() => setIsLoading(false));
		} else setIsLoading(false);
	}, []);
	if (apps == null && !isLoading) return null;
	return (
		<Card>
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold">All Apps</h1>
				<p className="text-muted-foreground">
					Browse {apps?.length.toLocaleString('us') ?? '9,000'}{' '}
					available applications and growing.
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
