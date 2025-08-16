'use server';
import 'server-only'
import { type WinGetApp } from "@/lib/type";
import downloadAndExtractAndLoadWingetRepo from './download-winget-repo';

export type LoadWingetAppsRet = { filteredApps: WinGetApp[], totalFilteredApps: number, totalApps: number } | null;

export type SortOption =
	| 'nameAscending'
	| 'nameDescending'
	| 'popular'
	// | 'releaseDateNewest'
	// | 'releaseDateOldest';


var APPS: WinGetApp[] | null = null;
export default async function loadWingetApps(take: number, skip: number, search: string, sortBy:SortOption): Promise<LoadWingetAppsRet> {
	if (APPS === null) {
		let apps: WinGetApp[] | null = null;
		try {
			// The function may returns null even after it returns apps.
			apps = await downloadAndExtractAndLoadWingetRepo();
		} catch (e) {
			console.error(e);
		}
		if (Array.isArray(apps)) APPS = apps;
		else console.error('Unexpected return type. Expected apps to be array but got: ' + apps)
	} else console.log('Returning cached apps from server');
	if (APPS == null)
		return null;
	// Sanitize numeric inputs
	take = Number.isFinite(take) ? Math.max(0, Math.floor(take)) : 20;
	skip = Number.isFinite(skip) ? Math.max(0, Math.floor(skip)) : 0;

	// If a search term is provided, filter first, then paginate the filtered results.
	let filtered: WinGetApp[] = APPS;
	if (search && search.trim().length > 0) {
		const up = search.trim().toUpperCase();
		filtered = APPS.filter(a =>
			a.id.toUpperCase().includes(up)
			|| a.name.toUpperCase().includes(up)
			|| a.publisher.toUpperCase().includes(up)
			|| a.shortDescription.toUpperCase().includes(up)
			|| (a.description && a.description.toUpperCase().includes(up))
			|| a.tags.some(t => t.toUpperCase().includes(up))
		);
	}

	const totalFilteredApps = filtered.length;
	const filteredApps = filtered.slice(skip, skip + take);

	return { filteredApps, totalFilteredApps, totalApps: APPS.length };
}

