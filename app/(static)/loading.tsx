'use client';
import {LogoTextBottom} from '@/components/ui/logo';

export default function Loading() {
	return (
		<div className="h-[70vh] mx-auto flex flex-col items-center justify-center">
			<LogoTextBottom className="animate-pulse" />
			<h1 className="text-center opacity-40">Loading...</h1>
		</div>
	);
}
