'use client';

import Link from 'next/link';
import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Menu, X, Rocket, Heart} from 'lucide-react';
import {LogoTextRight} from '@/components/ui/logo';
import {NAV_ITEMS} from '@/constant/nav-items';

function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<header
			className={`sticky top-0 z-50 transition-all duration-300 ${
				isScrolled
					? 'bg-white/85 backdrop-blur-md border-b border-gray-200/60 shadow-lg'
					: 'bg-white border-b border-gray-200'
			}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-4">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center transition-transform hover:scale-105">
						<LogoTextRight className="h-10 sm:h-12" />
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-1">
						{NAV_ITEMS.map(item => (
							<Link
								key={item.href}
								href={item.href}
								className="group flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg transition-all duration-200 hover:bg-blue-50">
								<item.icon className="h-4 w-4 mr-2 group-hover:text-blue-600" />
								{item.label}
							</Link>
						))}
					</nav>

					{/* CTA Button & Mobile Menu */}
					<div className="flex items-center space-x-4">
						{/* CTA Button */}
						<Link href="/#popular-apps">
							<Button
								size="sm"
								className="hidden sm:flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
								<Rocket className="h-4 w-4 mr-2" />
								Get Started
							</Button>
						</Link>

						{/* Mobile menu button */}
						<button
							onClick={() =>
								setIsMobileMenuOpen(!isMobileMenuOpen)
							}
							className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
							aria-label="Toggle mobile menu">
							{isMobileMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMobileMenuOpen && (
					<div className="md:hidden border-t border-gray-200 py-4 space-y-2 bg-white/95 backdrop-blur-md">
						{NAV_ITEMS.map(item => (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setIsMobileMenuOpen(false)}
								className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
								<item.icon className="h-5 w-5 mr-3" />
								{item.label}
							</Link>
						))}
						<div className="px-4 pt-2">
							<Link
								href="/#popular-apps"
								onClick={() => setIsMobileMenuOpen(false)}>
								<Button
									size="sm"
									className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full py-3 shadow-lg">
									<Rocket className="h-4 w-4 mr-2" />
									Get Started
								</Button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}

function Footer() {
	return (
		<footer className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid md:grid-cols-4 gap-8 mb-12">
					{/* Brand Column */}
					<div className="md:col-span-2">
						<div className="flex items-center mb-6">
							<LogoTextRight />
						</div>
						<p className="text-gray-300 mb-6 max-w-md leading-relaxed">
							Making PC setup ridiculously simple. Save hours of
							manual installation with our automated installer
							generator powered by Microsoft WinGet.
						</p>
						<p className="text-gray-400">
							Made with{' '}
							<Heart className="h-4 w-4 text-red-500 inline fill-current" />
							{' '}for people who have better things to do than manually install software.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-semibold mb-4">
							Quick Links
						</h3>
						<ul className="space-y-3 text-gray-300">
							{NAV_ITEMS.map((item, idx) => (
								<li key={idx}>
									<Link
										href={item.href}
										className="hover:text-white transition-colors duration-200">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Legal</h3>
						<ul className="space-y-3 text-gray-300">
							<li>
								<Link
									href="/terms"
									className="hover:text-white transition-colors duration-200">
									Terms of Use
								</Link>
							</li>
							<li>
								<Link
									href="/privacy"
									className="hover:text-white transition-colors duration-200">
									Privacy Policy
								</Link>
							</li>
							<li>
								<a
									href="https://github.com/microsoft/winget-pkgs"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-white transition-colors duration-200">
									WinGet Repository
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-gray-400 text-sm">
						© {new Date().getFullYear()} TouchlessSetup - Because
						life's too short for tedious installations
					</p>
					<div className="flex items-center gap-6">
						<span className="text-gray-400 text-sm">
							Powered by Microsoft WinGet
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default function Layout({children}: {children: React.ReactNode}) {
	return (
		<section className="flex flex-col min-h-screen">
			<Header />
			{children}
			<Footer />
		</section>
	);
}
