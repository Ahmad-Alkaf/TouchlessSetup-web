import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDownloads = (downloads: number) => {
	if (downloads >= 1000000) return `${(downloads / 1000000).toFixed(1)}M`;
	if (downloads >= 1000) return `${(downloads / 1000).toFixed(1)}K`;
	return downloads.toString();
};

export const formatDate = (date: Date) => {
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - date.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 1) return '1 day ago';
	if (diffDays < 30) return `${diffDays} days ago`;
	if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
	return `${Math.floor(diffDays / 365)} years ago`;
};