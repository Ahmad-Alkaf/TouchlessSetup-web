
/**
 * Generates a valid Windows filename for the TouchlessSetup installer.
 * Ensures the filename complies with Windows file naming restrictions.
 * 
 * @param selectedApps Array of selected apps with at least an 'id' property.
 * @returns Generated filename string. Ex: "TouchlessSetup_3_apps_Chrome-Discord-VSCode.exe"
 */
export function generateFilename(selectedApps: { name: string }[]): string {
	// Windows invalid characters: < > : " | ? * \ /
	const INVALID_CHARS = /[<>:"|?*\\/\x00-\x1f]/g;
	const MAX_FILENAME_LENGTH = 170; // Leave some buffer from 255 Windows limit

	// Extract and clean the last segments from app IDs
	const nameArr = selectedApps.map(app => app.name.replace(INVALID_CHARS, '').trim());

	// Join segments and create base filename
	let names = nameArr.join('-');
	if (names.length > MAX_FILENAME_LENGTH)
		names = names.substring(0, MAX_FILENAME_LENGTH - 3).replace(/-+$/, '') + '...';
	let fileName = `TouchlessSetup_${selectedApps.length}_apps_${names}.exe`;

	// Final safety check - if still too long, use minimal filename
	if (fileName.length > MAX_FILENAME_LENGTH) {
		fileName = `TouchlessSetup_${selectedApps.length}_apps.exe`;
	}

	return fileName;
}

