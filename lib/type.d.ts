export type WinGetCategory = {
	name: string;
	apps: WinGetApp[];
}

export type WinGetApp = {
	id: string;
	name: string;
	description: string;
	version: string;
	publisher: string;
	releaseDate: Date;
	tags: string[];
	icon?: string;
	/**
	 * Default is "false"
	 */
	verifiedSilence?: boolean;
}