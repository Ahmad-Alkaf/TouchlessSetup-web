'use client';
import {Card, CardContent} from '@/components/ui/card';
import SearchBar from './components/search-bar';
import APPS from '@/constant/APPS';

export default function WingetApps() {
	return (
		<Card>
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold">All Apps</h1>
				<p className="text-muted-foreground">
					Browse{' '}
					{APPS == null
						? '8,650'
						: APPS.length
								.toString()
								.substring(
									0,
									APPS.length.toString().length - 1
								) + 0}
					+ available applications and growing, powered by the Windows Package
					Manager (WinGet).
				</p>
			</div>
			<CardContent>
				<div className="space-y-6">
					<div className="grid gap-4">
						<SearchBar />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
