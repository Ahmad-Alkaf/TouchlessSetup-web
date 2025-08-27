
export const FormatTotalApps = (totalApps: number | null | undefined) =>
	totalApps?.toLocaleString('us') ?? '11,000+';