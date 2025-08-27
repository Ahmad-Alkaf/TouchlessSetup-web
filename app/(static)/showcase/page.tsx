import {Button} from '@/components/ui/button';
import {getCachedWingetApps} from '@/lib/startup/cache-winget-apps';
import {
	Code,
	Palette,
	Gamepad2,
	Music,
	Video,
	FileText,
	Database,
	Shield,
	Zap,
	Download,
	Star,
	Users,
	Rocket,
	ArrowRight,
	Search,
	Filter
} from 'lucide-react';
import Link from 'next/link';
import {FormatTotalApps} from '../../../components/shared/format-total-apps';

export const metadata = {
	title: 'App Gallery | Touchless Setup',
	description:
		'Explore our curated collection of 15,000+ applications. From development tools to creative software, find everything you need for your perfect PC setup.'
};

export default async function ShowcasePage() {
	let totalApps: number | undefined = undefined;
	try {
		totalApps = (await getCachedWingetApps())?.length;
	} catch (e) {
		console.error(e);
	}
	const categories = [
		{
			name: 'Development',
			icon: Code,
			color: 'from-blue-500 to-indigo-600',
			description: 'Essential tools for developers',
			count: '2,500+',
			popular: [
				'Visual Studio Code',
				'Git',
				'Node.js',
				'Python',
				'Docker',
				'Postman'
			],
			bgPattern: 'bg-blue-50'
		},
		{
			name: 'Creative',
			icon: Palette,
			color: 'from-purple-500 to-pink-600',
			description: 'Design and multimedia tools',
			count: '1,800+',
			popular: [
				'Adobe Creative Suite',
				'Figma',
				'Blender',
				'GIMP',
				'OBS Studio',
				'Audacity'
			],
			bgPattern: 'bg-purple-50'
		},
		{
			name: 'Gaming',
			icon: Gamepad2,
			color: 'from-green-500 to-emerald-600',
			description: 'Games and gaming platforms',
			count: '3,200+',
			popular: [
				'Steam',
				'Epic Games',
				'Discord',
				'OBS Studio',
				'Streamlabs',
				'MSI Afterburner'
			],
			bgPattern: 'bg-green-50'
		},
		{
			name: 'Productivity',
			icon: FileText,
			color: 'from-orange-500 to-red-600',
			description: 'Office and productivity software',
			count: '1,500+',
			popular: [
				'Microsoft Office',
				'Notion',
				'Slack',
				'Zoom',
				'Teams',
				'Todoist'
			],
			bgPattern: 'bg-orange-50'
		},
		{
			name: 'Media',
			icon: Video,
			color: 'from-cyan-500 to-blue-600',
			description: 'Video, audio, and streaming',
			count: '900+',
			popular: [
				'VLC',
				'Spotify',
				'Netflix',
				'Plex',
				'HandBrake',
				'MediaInfo'
			],
			bgPattern: 'bg-cyan-50'
		},
		{
			name: 'Utilities',
			icon: Zap,
			color: 'from-yellow-500 to-orange-600',
			description: 'System tools and utilities',
			count: '2,100+',
			popular: [
				'7-Zip',
				'CCleaner',
				'Malwarebytes',
				'TreeSize',
				'PowerToys',
				'WinRAR'
			],
			bgPattern: 'bg-yellow-50'
		}
	];

	const featuredApps = [
		{
			name: 'Visual Studio Code',
			category: 'Development',
			downloads: '2.1M',
			rating: 4.9,
			description: 'Lightweight but powerful source code editor',
			icon: '/winget/apps-icon/microsoft.visualstudiocode.png'
		},
		{
			name: 'Google Chrome',
			category: 'Browsers',
			downloads: '5.3M',
			rating: 4.8,
			description: 'Fast, secure, and free web browser',
			icon: '/winget/apps-icon/google.chrome.png'
		},
		{
			name: 'Discord',
			category: 'Communication',
			downloads: '3.7M',
			rating: 4.7,
			description: 'Chat, hang out, and stay close with friends',
			icon: '/winget/apps-icon/discord.discord.png'
		},
		{
			name: 'Spotify',
			category: 'Music',
			downloads: '4.2M',
			rating: 4.8,
			description: 'Music for everyone',
			icon: '/winget/apps-icon/spotify.spotify.png'
		}
	];

	const stats = [
		{
			label: 'Total Apps',
			value: FormatTotalApps(totalApps),
			icon: Download
		},
		{label: 'Active Users', value: '50K+', icon: Users},
		{label: 'Installations', value: '2.3M', icon: Rocket},
		{label: 'Publishers', value: '3,800+', icon: Shield}
	];

	return (
		<main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Hero Section */}
			<section className="relative py-20 lg:py-28 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
						<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
							App Gallery
						</span>
					</h1>
					<p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
						Discover our curated collection of 15,000+ applications.
						From essential productivity tools to entertainment
						software - find everything you need for your perfect PC
						setup.
					</p>

					{/* Stats */}
					<div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
						{stats.map((stat, index) => (
							<div
								key={index}
								className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
								<stat.icon className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
								<div className="text-2xl font-bold text-gray-900">
									{stat.value}
								</div>
								<div className="text-sm text-gray-600">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Categories Grid */}
			<section className="py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
							Browse by Category
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Whether you're setting up a new computer, recovering
							from a format, or just want to try new software,
							we've organized everything for easy discovery.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{categories.map((category, index) => (
							<div
								key={index}
								className={`group relative overflow-hidden rounded-3xl ${category.bgPattern} border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}>
								<div className="p-8">
									{/* Icon and Header */}
									<div className="flex items-center gap-4 mb-6">
										<div
											className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
											<category.icon className="h-8 w-8 text-white" />
										</div>
										<div>
											<h3 className="text-2xl font-bold text-gray-900">
												{category.name}
											</h3>
											<p className="text-gray-600">
												{category.count} apps
											</p>
										</div>
									</div>

									<p className="text-gray-700 mb-6">
										{category.description}
									</p>

									{/* Popular Apps */}
									<div className="space-y-2 mb-6">
										<h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
											Popular Apps:
										</h4>
										<div className="flex flex-wrap gap-2">
											{category.popular
												.slice(0, 4)
												.map((app, idx) => (
													<span
														key={idx}
														className="bg-white/70 px-3 py-1 rounded-full text-sm text-gray-700 border">
														{app}
													</span>
												))}
											{category.popular.length > 4 && (
												<span className="bg-white/70 px-3 py-1 rounded-full text-sm text-gray-600 border">
													+
													{category.popular.length -
														4}{' '}
													more
												</span>
											)}
										</div>
									</div>
								</div>

								{/* Hover Effect */}
								<div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Featured Apps */}
			<section className="py-20 bg-gradient-to-r from-gray-50 to-indigo-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
							Most Popular Apps
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							The apps everyone's downloading. Trusted by millions
							of users worldwide.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{featuredApps.map((app, index) => (
							<div
								key={index}
								className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
								<div className="flex items-center gap-4 mb-4">
									<div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
										<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg"></div>
									</div>
									<div>
										<h3 className="font-bold text-gray-900">
											{app.name}
										</h3>
										<p className="text-sm text-gray-500">
											{app.category}
										</p>
									</div>
								</div>

								<p className="text-gray-600 text-sm mb-4">
									{app.description}
								</p>

								<div className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-1">
										<Star className="h-4 w-4 text-yellow-500 fill-current" />
										<span className="text-gray-700">
											{app.rating}
										</span>
									</div>
									<div className="flex items-center gap-1 text-gray-500">
										<Download className="h-4 w-4" />
										<span>{app.downloads}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Search & Filter Section */}
			<section className="py-20">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
						<h2 className="text-3xl sm:text-4xl font-bold mb-6">
							Can't Find What You Need?
						</h2>
						<p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
							Use our powerful search and filtering system to
							discover the perfect apps for your workflow. With
							15,000+ options, we've got something for everyone.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white">
								<Search className="h-5 w-5" />
								<span>Advanced Search</span>
							</div>
							<div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white">
								<Filter className="h-5 w-5" />
								<span>Smart Filters</span>
							</div>
						</div>

						<div className="mt-8">
							<Link href="/#popular-apps">
								<Button
									size="lg"
									className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
									<Rocket className="mr-3 h-6 w-6" />
									Start Building Your Installer
									<ArrowRight className="ml-3 h-6 w-6" />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
