import {Button} from '@/components/ui/button';
import {ArrowRight, PartyPopper, Lightbulb, Rocket} from 'lucide-react';
import Link from 'next/link';

export default function CallToAction() {
	return (
		<section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
					<div>
						<h2 className="text-3xl font-bold text-gray-900 sm:text-4xl leading-tight flex items-center gap-3">
							Ready to ditch the tedious setup process?
						</h2>
						<p className="mt-3 max-w-3xl text-lg text-gray-600 leading-relaxed">
							Life's too short for clicking "Next" 42 times and
							hunting down installers across the web. Pick your
							apps, hit the magic button, and actually start{' '}
							<em>using</em> your computer instead of setting it
							up!
						</p>
						<div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
							<Lightbulb className="h-4 w-4 text-yellow-500" />
							<span>
								<strong>Pro tip:</strong> Perfect for fresh
								Windows installs, new work laptops, or when you
								just want to feel like a tech wizard.
							</span>
						</div>
					</div>
					<div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
						<Link href="#popular-apps">
							<Button
								size="lg"
								variant="default"
								className="text-lg rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl px-8 py-4">
								<Rocket className="mr-2 h-5 w-5" />
								Start Building Now
								<ArrowRight className="ml-3 h-6 w-6" />
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
