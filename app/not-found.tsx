import Link from 'next/link';
import {CircleIcon} from 'lucide-react';
import {LogoTextBottom} from '@/components/ui/logo';
import {Button} from '@/components/ui/button';

export default function NotFound() {
	return (
		<div className="flex items-center justify-center min-h-[100dvh]">
			<div className="max-w-md space-y-8 p-4 text-center">
				<div className="flex justify-center">
					<LogoTextBottom />
				</div>
				<h1 className="text-4xl font-bold text-gray-900 tracking-tight">
					Page Not Found
				</h1>
				<p className="text-base text-gray-500">
					The page you are looking for might have been removed, had
					its name changed, or is temporarily unavailable.
				</p>
				<Link href="/">
					<Button
						size="lg"
						variant="outline"
						className="rounded-full">
						Back to Home
					</Button>
				</Link>
			</div>
		</div>
	);
}
