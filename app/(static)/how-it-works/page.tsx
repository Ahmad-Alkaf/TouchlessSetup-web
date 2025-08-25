import { Button } from '@/components/ui/button';
import { 
	MousePointerClick, 
	Download, 
	Rocket, 
	CheckCircle, 
	ArrowRight, 
	Zap,
	Shield,
	Clock,
	Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
	title: 'How It Works | Touchless Setup',
	description: 'Learn how Touchless Setup transforms hours of manual installation into minutes of automation. Simple, secure, and powered by Microsoft WinGet.'
};

export default function HowItWorksPage() {
	const steps = [
		{
			step: '1',
			title: 'Browse & Select',
			description: 'Choose from thousands of apps in our curated catalog. From development tools to creative software, we\'ve got everything you need.',
			icon: MousePointerClick,
			color: 'from-blue-500 to-indigo-600',
			details: [
				'Search through 15,000+ verified apps',
				'Filter by categories and popularity',
				'Read descriptions and version info',
				'See download counts and ratings'
			]
		},
		{
			step: '2',
			title: 'Generate Installer',
			description: 'Our magic happens here! We bundle your selections into a single, lightweight executable that installs everything silently.',
			icon: Zap,
			color: 'from-emerald-500 to-green-600',
			details: [
				'Creates a custom .exe file',
				'Includes all your selected apps',
				'Optimized for silent installation',
				'Works offline once downloaded'
			]
		},
		{
			step: '3',
			title: 'Run & Relax',
			description: 'Double-click your installer and watch the magic happen. No prompts, no babysitting - just pure automation while you grab coffee.',
			icon: Rocket,
			color: 'from-purple-500 to-violet-600',
			details: [
				'One-click installation process',
				'Runs completely in background',
				'No user prompts or interruptions',
				'Progress tracking available'
			]
		}
	];

	const benefits = [
		{
			icon: Clock,
			title: 'Save Hours of Time',
			description: 'What used to take 2-3 hours now takes 5 minutes. Set it up once and forget about it.'
		},
		{
			icon: Shield,
			title: 'Completely Safe',
			description: 'Powered by Microsoft WinGet - all apps come from official sources and verified publishers.'
		},
		{
			icon: Sparkles,
			title: 'Zero Bloatware',
			description: 'Clean installations with no unwanted extras, toolbars, or hidden software sneaking in.'
		}
	];

	return (
		<main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Hero Section */}
			<section className="relative py-20 lg:py-28 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
						<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
							How It Works
						</span>
					</h1>
					<p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
						Transform hours of tedious manual installation into minutes of pure automation. 
						Here's how we make setting up your PC ridiculously simple.
					</p>
				</div>
			</section>

			{/* Steps Section */}
			<section className="py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-20">
						{steps.map((step, index) => (
							<div key={step.step} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
								{/* Content */}
								<div className="flex-1 space-y-6">
									<div className="flex items-center gap-4">
										<div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
											{step.step}
										</div>
										<h2 className="text-3xl font-bold text-gray-900">{step.title}</h2>
									</div>
									
									<p className="text-lg text-gray-600 leading-relaxed">
										{step.description}
									</p>

									<ul className="space-y-3">
										{step.details.map((detail, idx) => (
											<li key={idx} className="flex items-center gap-3 text-gray-700">
												<CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
												{detail}
											</li>
										))}
									</ul>
								</div>

								{/* Icon/Visual */}
								<div className="flex-1 flex justify-center">
									<div className={`w-64 h-64 rounded-3xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300`}>
										<step.icon className="h-32 w-32 text-white" />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
							Why People Love It
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Perfect for anyone setting up a new PC or recovering from a format. We understand the pain of manual installations.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{benefits.map((benefit, index) => (
							<div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
								<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
									<benefit.icon className="h-6 w-6 text-white" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
								<p className="text-gray-600 leading-relaxed">{benefit.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Technical Details */}
			<section className="py-20">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
							Under the Hood
						</h2>
						<p className="text-xl text-gray-600">
							Powered by Microsoft's own package manager for ultimate reliability.
						</p>
					</div>

					<div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-2xl">
						<h3 className="text-xl font-bold mb-6 flex items-center">
							<Shield className="h-6 w-6 mr-3 text-green-400" />
							Built on WinGet Technology
						</h3>
						<div className="space-y-4 text-gray-300">
							<p className="leading-relaxed">
								<strong className="text-white">WinGet</strong> is Microsoft's official package manager for Windows. 
								Every app in our catalog comes directly from verified publishers and goes through Microsoft's security validation.
							</p>
							<p className="leading-relaxed">
								Your custom installer essentially becomes a smart batch of WinGet commands, executing them in the optimal order 
								for fastest installation with automatic dependency resolution.
							</p>
							<p className="leading-relaxed">
								<strong className="text-white">No third-party downloads.</strong> <strong className="text-white">No modified installers.</strong> 
								<strong className="text-white"> Just official software, delivered efficiently.</strong>
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
						Ready to Save Hours of Your Life?
					</h2>
					<p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
						Join thousands of people who've already discovered the joy of automated PC setup.
					</p>
					<Link href="/#popular-apps">
						<Button 
							size="lg" 
							className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
						>
							<Rocket className="mr-3 h-6 w-6" />
							Start Building Your Installer
							<ArrowRight className="ml-3 h-6 w-6" />
						</Button>
					</Link>
				</div>
			</section>
		</main>
	);
}
