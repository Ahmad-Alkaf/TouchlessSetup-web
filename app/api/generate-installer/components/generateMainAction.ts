import { TSAction } from "@/lib/type";

export function generateMainActionContent(selectedApps: { id: string; name: string }[]): TSAction {
	if (selectedApps.length === 0) throw 'No apps selected. Error Code: 188349';
	return {
		title: "Error Code: 438755",
		runner: "group",
		errorAction: "Continue",
		executeChildrenInParallel: false,
		hidden: true,
		arguments: [],
		scripts:
			selectedApps.map(app => (
				{
					title: app.name,
					runner: "winget",
					errorAction: "Continue",
					executeChildrenInParallel: true,
					hidden: false,
					arguments: [
						`winget install --exact --id ${app.id} --silent --accept-source-agreements --accept-package-agreements --disable-interactivity --verbose-logs --include-unknown`
					],
					scripts: []
				}
			))

	};
}