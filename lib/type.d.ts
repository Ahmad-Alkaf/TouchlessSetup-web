export type WingetCategory = {
	name: string;
	apps: WingetApp[];
}

export type WingetApp = {
	id: string;
	name: string;
	icon?: string;
	/**
	 * Default is "false"
	 */
	verifiedSilence?: boolean;
}