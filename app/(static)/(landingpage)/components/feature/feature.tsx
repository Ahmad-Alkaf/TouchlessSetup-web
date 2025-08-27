import {Blocks, MousePointerClick, PlugZap, Coffee} from 'lucide-react';
import Link from 'next/link';
import {TotalApps} from '../../../../../components/shared/total-apps';

export function Feature() {
	return (
		<section className="py-16 bg-white w-full">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="lg:grid lg:grid-cols-3 lg:gap-8">
					<div>
						<div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
							<Blocks className="h-6 w-6" />
						</div>{' '}
						<div className="mt-5">
							<h2 className="text-lg font-bold text-gray-900">
								Huge App Collection
							</h2>
							<p className="mt-2 text-base text-gray-600 leading-relaxed">
								We've got{' '}
								<span className="font-semibold text-indigo-600">
									<TotalApps />
								</span>{' '}
								apps waiting for you! From coding tools to
								creative software, it's all here from the
								official Microsoft's{' '}
								<Link
									href="https://github.com/microsoft/winget-pkgs"
									target="_blank"
									className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2">
									WinGet repository
								</Link>
								. No sketchy downloads, promise!
							</p>
						</div>
					</div>

					<div className="mt-10 lg:mt-0">
						<div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
							<MousePointerClick className="h-6 w-6" />
						</div>
						<div className="mt-5">
							<h2 className="text-lg font-bold text-gray-900">
								One Magic Click
							</h2>
							<p className="mt-2 text-base text-gray-600 leading-relaxed">
								Seriously, just one click!{' '}
								<MousePointerClick className="inline h-4 w-4 text-emerald-700" />{' '}
								We bundle everything into a single installer
								that works silently in the background. Go grab
								some coffee{' '}
								<Coffee className="inline h-4 w-4 text-amber-600" />
								, and come back to a fully equipped PC.
							</p>
						</div>
					</div>

					<div className="mt-10 lg:mt-0">
						<div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg">
							<PlugZap className="h-6 w-6" />
						</div>
						<div className="mt-5">
							<h2 className="text-lg font-medium text-gray-900">
								Powered by Microsoft's package manager
							</h2>
							<p className="mt-2 text-base text-gray-600 leading-relaxed">
								Built on WinGet, Microsoft's own package
								manager. That means everything is official,
								secure, and up-to-date. No weird malware or
								bloatware sneaking onto your machine. Your
								computer will thank you!
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
