import {Loader2, Package, Sparkles} from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';

interface LoadingModalProps {
	isOpen: boolean;
	title?: string;
	description?: string;
	progress?: number;
}

export default function LoadingModal({
	isOpen,
	title = 'Generating Installer',
	description = 'Please wait while we create your custom installer...',
	progress
}: LoadingModalProps) {
	return (
		<Dialog open={isOpen}>
			<DialogContent className="sm:max-w-md" showCloseButton={false}>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Sparkles className="h-5 w-5 text-green-600" />
						{title}
					</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col items-center justify-center py-8 space-y-4">
					{/* Main loading spinner */}
					<div className="relative">
						<Loader2 className="h-12 w-12 text-green-600 animate-spin" />
						<Package className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600" />
					</div>

					{/* Progress bar if progress is provided */}
					{typeof progress === 'number' && (
						<div className="w-full max-w-xs">
							<div className="bg-gray-200 rounded-full h-2">
								<div
									className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
									style={{
										width: `${Math.min(
											100,
											Math.max(0, progress)
										)}%`
									}}
								/>
							</div>
							<p className="text-sm text-gray-600 mt-2 text-center">
								{Math.round(progress)}% complete
							</p>
						</div>
					)}

					{/* Loading dots animation */}
					<div className="flex space-x-1">
						<div
							className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
							style={{animationDelay: '0ms'}}
						/>
						<div
							className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
							style={{animationDelay: '150ms'}}
						/>
						<div
							className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
							style={{animationDelay: '300ms'}}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
