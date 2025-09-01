
/**
 * WITHOUT EXTENSION! Please put the extension by yourself.
 * Generates a valid Windows filename for the TouchlessSetup installer.
 * Ensures the filename complies with Windows file naming restrictions.
 * 
 * @param selectedApps Array of selected apps with at least an 'name' property. Null for fallback filename
 * @returns Generated filename string. Ex: "TouchlessSetup_3_apps_Chrome-Discord-VSCode"
 */
export function generateFilename(selectedApps: { name: string }[] | null): string {
	if (selectedApps === null || selectedApps === undefined || selectedApps.length === 0) {
		return 'TouchlessSetup installer';
	}
	// Windows invalid characters: < > : " | ? * \ /
	const INVALID_CHARS = /[<>:"|?*\\/\x00-\x1f]/g;
	const MAX_FILENAME_LENGTH = 170; // Leave some buffer from 255 Windows limit

	// Extract and clean the last segments from app IDs
	const nameArr = selectedApps.map(app => app.name.replace(INVALID_CHARS, '').trim());

	// Join segments and create base filename
	let names = nameArr.join('_');
	if (names.length > MAX_FILENAME_LENGTH)
		names = names.substring(0, MAX_FILENAME_LENGTH - 3).replace(/-+$/, '') + '...';
	let fileName = `TouchlessSetup ${selectedApps.length} app${selectedApps.length <= 1 ? '' : 's'}: ${names}`;

	// Final safety check - if still too long, use minimal filename
	if (fileName.length > MAX_FILENAME_LENGTH) {
		fileName = `TouchlessSetup_${selectedApps.length}_apps`;
	}

	return fileName;
}

