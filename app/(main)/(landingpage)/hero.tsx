import Link from 'next/link';
import {Terminal} from './terminal';
import {Button} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';

export default function Hero() {
	return (
		<section className="py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="lg:grid lg:grid-cols-12 lg:gap-8">
					<div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
						<h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
							Install All Your Apps
							<span className="block text-blue-500">
								Faster Than Ever
							</span>
						</h1>
						<p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
							Create a custom .exe that installs apps without
							prompts or distractions. Just pure efficiency.
						</p>
						<div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
							<Link href="#popular-apps">
								<Button
									size="lg"
									variant="outline"
									className="text-lg cursor-pointer rounded-full">
									Build Your Installer
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
						</div>
					</div>
					<div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
						<Terminal />
					</div>
				</div>
			</div>
		</section>
	);
}
