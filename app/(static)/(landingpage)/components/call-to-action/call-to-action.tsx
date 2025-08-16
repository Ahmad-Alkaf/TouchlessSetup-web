import {Button} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';
import Link from 'next/link';

export default function CallToAction() {
	return (
		<section className="py-16 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
					<div>
						<h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
							Ready to automate your Windows setup?
						</h2>
						<p className="mt-3 max-w-3xl text-lg text-gray-500">
							Skip the web searches and next-next-finish clicks.
							Select your favorite apps and let Touchless handle
							the rest.
						</p>
					</div>
					<div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
						<Link href="#popular-apps">
							<Button
								size="lg"
								variant="outline"
								className="text-lg rounded-full">
								Get Started
								<ArrowRight className="ml-3 h-6 w-6" />
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
