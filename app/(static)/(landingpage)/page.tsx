import {Button} from '@/components/ui/button';
import {ArrowRight, Blocks, MousePointerClick, PlugZap} from 'lucide-react';
import Hero from './hero';
import {SelectedApps} from './components/SelectedAppsContext';
import Link from '@/components/ui/link';

export default async function HomePage() {
	return (
		<main>
			<Hero />

			<SelectedApps />

			<section className="py-16 bg-white w-full">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="lg:grid lg:grid-cols-3 lg:gap-8">
						<div>
							<div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
								<Blocks className="h-6 w-6" />
							</div>
							<div className="mt-5">
								<h2 className="text-lg font-medium text-gray-900">
									Massive App Catalogue
								</h2>
								<p className="mt-2 text-base text-gray-500">
									Browse and search over 9,000 Windows
									packages straight from the{' '}
									<Link
										href="https://github.com/microsoft/winget-pkgs"
										target="_blank" >
										official WinGet repository
									</Link>
									.
								</p>
							</div>
						</div>

						<div className="mt-10 lg:mt-0">
							<div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
								<MousePointerClick className="h-6 w-6" />
							</div>
							<div className="mt-5">
								<h2 className="text-lg font-medium text-gray-900">
									One-Click Installer
								</h2>
								<p className="mt-2 text-base text-gray-500">
									Generate a single installer file that
									installs everything for you in silent mode.
								</p>
							</div>
						</div>

						<div className="mt-10 lg:mt-0">
							<div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
								<PlugZap className="h-6 w-6" />
							</div>
							<div className="mt-5">
								<h2 className="text-lg font-medium text-gray-900">
									Powered by WinGet
								</h2>
								<p className="mt-2 text-base text-gray-500">
									WinGet is the official package manager for
									Windows, so we use it to install your
									selected apps.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
						<div>
							<h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
								Ready to automate your Windows setup?
							</h2>
							<p className="mt-3 max-w-3xl text-lg text-gray-500">
								Skip the web searches and next-next-finish
								clicks. Select your favorite apps and let
								Touchless handle the rest.
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

			<footer className="py-8 bg-gray-100 text-center text-sm text-gray-500 space-y-2">
				<p>
					<Link href="/terms" className="mr-4">
						Terms of Use
					</Link>
					<Link href="/privacy">
						Privacy Policy
					</Link>
				</p>
				<p>© {new Date().getFullYear()} Touchless Setup</p>
			</footer>
		</main>
	);
}
