import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {ArrowRight, Rocket, Frown} from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
	return (
		<section className="relative lg:bg-[#A8C7DC] lg:aspect-[1242/580]">
			{/* Background image for Desktop - hidden on mobile */}
			<div className="hidden lg:block absolute inset-0">
				<div
					className="relative w-full h-full"
					style={{
						maskImage:
							'linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,0.1) 35%, white 50%)',
						WebkitMaskImage:
							'linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,0.1) 35%, white 50%)'
					}}>
					<Image
						src="/desktop-examples/chosen.png"
						alt="Illustration of automated Windows setup"
						fill
						className="object-cover object-left"
						style={{
							transform: 'translateX(26%)'
						}}
						quality={100}
						unoptimized={false}
						priority
					/>
				</div>
			</div>

			{/* Content overlay */}
			<div className="relative z-10 h-full flex items-center pt-6 lg:pt-0">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
					<div className="flex flex-col lg:flex-row items-center h-full">
						{/* Copy - positioned on the left with solid white background */}
						<div className=" text-center lg:text-left max-w-full lg:max-w-lg">
							<h1
								className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent sm:text-5xl leading-tight"
								style={{
									textShadow:
										'0 0 8px rgba(56, 189, 248, 0.4)',
									fontFamily:
										'"Nunito Sans", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
								}}>
								Set Up Your PC in Minutes, Not Hours
							</h1>
							<p className="mt-6 w-full text-center lg:text-left lg:max-w-4xl text-lg text-gray-700 font-medium">
								Tired of spending your weekend installing apps
								one by one? Just pick what you want, click{' '}
								<strong className="text-green-700">
									Generate Installer
								</strong>
								, and get back to actually enjoying your new
								computer while we handle the boring stuff.
							</p>
							<div className="mt-8 flex  justify-center lg:justify-start">
								<Link href="#popular-apps">
									<Button
										size="lg"
										className="px-8 text-lg rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
										variant="default">
										<Rocket className="mr-2 h-5 w-5" />
										Let's Build It!
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
								{/* Placeholder secondary CTA if needed */}
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Image for Mobile - hidden on desktop */}
			<div className="block lg:hidden mt-12">
				<Image
					src="/desktop-examples/cropped-mobile.png"
					alt="Illustration of automated Windows setup"
					width={1242}
					height={380}
					className="w-full h-auto object-contain"
					quality={90}
					priority
				/>
			</div>
		</section>
	);
}
