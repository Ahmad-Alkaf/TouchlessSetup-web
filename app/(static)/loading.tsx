'use client';

export default function Loading() {
	return (
		<div className="h-[70vh] mx-auto flex flex-col items-center justify-center space-y-4">
			{/* Clean Spinner */}
			<div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

			{/* Loading Text */}
			<span className="text-lg text-foreground/80 animate-pulse">
				Loading…
			</span>
		</div>
	);
}
