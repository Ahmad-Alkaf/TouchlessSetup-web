import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {ArrowRight} from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
	return (
		<section className="relative overflow-hidden py-24 bg-gradient-to-b from-white to-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
				{/* Copy */}
				<div className="text-center md:text-left max-w-2xl">
					<h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent sm:text-6xl leading-tight">
						Install your essential apps in one go
					</h1>
					<p className="mt-6 text-lg text-gray-600">
						Pick what you need, hit <strong>Generate&nbsp;Installer</strong>, and download a single file that sets up your PC while you get on with more important things.
					</p>
					<div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
						<Link href="#popular-apps">
							<Button size="lg" className="px-8 text-lg rounded-full" variant="outline">
								Build Your Installer
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
						</Link>
						{/* Placeholder secondary CTA if needed */}
					</div>
				</div>

				{/* Image placeholder */}
				<div className="w-full md:w-auto flex justify-center md:justify-end">
					{/* Replace the src below with your custom hero image */}
					<Image
						src="/hero-placeholder.svg"
						alt="Illustration of automated Windows setup"
						width={500}
						height={400}
						className="w-full max-w-md h-auto object-contain"
					/>
				</div>
			</div>
		</section>
	);
}
