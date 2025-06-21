'use server';
import 'server-only'
import { type WinGetApp } from "@/lib/type";
import downloadAndExtractAndLoadWingetRepo from './download-winget-repo';
import { revalidatePath } from 'next/cache';

var APPS: WinGetApp[] | null = null;

export default async function wingetApps(): Promise<WinGetApp[] | null> {
	if (APPS === null) {
		// The function may returns null even after it returns apps.
		let apps = await downloadAndExtractAndLoadWingetRepo();
		if (apps === null) return APPS;
		else if (Array.isArray(apps)) APPS = apps;
		else console.error('Unexpected return type. Expected apps to be array but got: ' + apps)
	}else console.log('Returning cached apps from server');

	return APPS;
}

