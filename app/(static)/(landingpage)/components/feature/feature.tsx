import {Blocks, MousePointerClick, PlugZap} from 'lucide-react';
import Link from 'next/link';
import {TotalApps} from '../../helpers/totalApps';

export function Feature() {
	return (
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
								Browse and search over <TotalApps /> Windows
								packages straight from the{' '}
								<Link
									href="https://github.com/microsoft/winget-pkgs"
									target="_blank">
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
								Generate a single installer file that installs
								everything for you in silent mode.
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
								Windows, so we use it to install your selected
								apps.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
