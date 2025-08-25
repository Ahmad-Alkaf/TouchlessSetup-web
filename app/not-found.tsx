import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Home, Compass} from 'lucide-react';
import Layout from './(static)/layout';
import {NAV_ITEMS} from '@/constant/nav-items';
import React from 'react';

export default function NotFound() {
	return (
		<Layout>
			<div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 via-white to-indigo-50">
				<div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-8">
					{/* Animated 404 */}
					<div className="relative">
						<h1 className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text animate-pulse">
							404
						</h1>
						<div className="absolute inset-0 text-8xl md:text-9xl font-bold text-blue-100 -z-10 transform translate-x-2 translate-y-2">
							404
						</div>
					</div>

					{/* Error Message */}
					<div className="space-y-4">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
							Oops! Page Not Found
						</h2>
						<p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
							Looks like this page took a detour! The page you're
							looking for might have been moved, renamed, or
							doesn't exist. Let's get you back on track.
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
						<Link href="/">
							<Button
								size="lg"
								className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
								<Home className="h-5 w-5 mr-2" />
								Back to Home
							</Button>
						</Link>

						<Link href="/showcase">
							<Button
								size="lg"
								variant="outline"
								className="rounded-full px-8 py-3 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
								<Compass className="h-5 w-5 mr-2" />
								Explore Apps
							</Button>
						</Link>
					</div>

					{/* Helpful Links */}
					<div className="pt-8 border-t border-gray-200">
						<p className="text-sm text-gray-500 mb-4">
							Maybe you were looking for:
						</p>
						<div className="flex flex-wrap justify-center gap-4 text-sm">
							{NAV_ITEMS.map((item, idx) => (
								<React.Fragment key={idx}>
									<Link
										href={item.href}
										className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
										{item.label}
									</Link>
									{idx < NAV_ITEMS.length - 1 && (
										<span className="text-gray-300">•</span>
									)}
								</React.Fragment>
							))}
						</div>
					</div>

					{/* Fun fact */}
					<div className="pt-6">
						<div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
							<p className="text-blue-800 font-medium">
								💡 Did you know?
							</p>
							<p className="text-blue-700 text-sm mt-1">
								TouchlessSetup can install dozens of popular
								Windows apps with just a few clicks!
							</p>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
