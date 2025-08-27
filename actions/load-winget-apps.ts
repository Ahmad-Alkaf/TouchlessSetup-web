'use server';
import 'server-only'
import { type WinGetApp } from "@/lib/type";
import { getCachedWingetApps } from '@/lib/startup/cache-winget-apps';

export type LoadWingetAppsRet = { filteredApps: WinGetApp[], totalFilteredApps: number, totalApps: number } | null;

export type SortOption =
	| 'nameAscending'
	| 'nameDescending'
	| 'popular'
// | 'releaseDateNewest'
// | 'releaseDateOldest';

export default async function loadWingetApps(take: number, skip: number, search: string, sortBy: SortOption): Promise<LoadWingetAppsRet> {
	// Get cached apps or wait for them to load
	const allApps = await getCachedWingetApps();

	if (allApps == null) {
		console.error('Failed to load WinGet apps');
		return null;
	}

	console.log(`Returning ${allApps.length} cached apps from server`);
	// Sanitize numeric inputs
	take = Number.isFinite(take) ? Math.max(0, Math.floor(take)) : 20;
	skip = Number.isFinite(skip) ? Math.max(0, Math.floor(skip)) : 0;

	// If a search term is provided, filter first, then paginate the filtered results.
	let filtered: WinGetApp[] = allApps;
	if (search && search.trim().length > 0) {
		const up = search.trim().toUpperCase();
		filtered = allApps.filter(a =>
			a.id.toUpperCase().includes(up)
			|| a.name.toUpperCase().includes(up)
			|| a.publisher.toUpperCase().includes(up)
			|| a.shortDescription.toUpperCase().includes(up)
			|| (a.description && a.description.toUpperCase().includes(up))
			|| a.tags.some(t => t?.toString().toUpperCase().includes(up))
		);
	}

	const totalFilteredApps = filtered.length;
	const filteredApps = filtered.slice(skip, skip + take);

	return { filteredApps, totalFilteredApps, totalApps: allApps.length };
}

