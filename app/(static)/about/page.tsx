import { Button } from '@/components/ui/button';
import { 
	Heart, 
	Coffee, 
	Zap, 
	Users, 
	Shield, 
	Code, 
	Clock,
	Rocket,
	ArrowRight,
	Github,
	Mail,
	ExternalLink,
	Award,
	Target,
	Lightbulb
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
	title: 'About | Touchless Setup',
	description: 'Learn about TouchlessSetup - born from the frustration of setting up new PCs, built with love. Our mission to save everyone from the tedium of manual software installation.'
};

export default function AboutPage() {
	const values = [
		{
			icon: Zap,
			title: 'Efficiency First',
			description: 'Every feature is designed to save you time. We believe life is too short for manual installations.'
		},
		{
			icon: Shield,
			title: 'Security Always',
			description: 'Built on Microsoft WinGet, ensuring all software comes from verified, trusted sources.'
		},
		{
			icon: Heart,
			title: 'User Love',
			description: 'Made for anyone who needs to set up a new PC or recover from a format.'
		},
		{
			icon: Users,
			title: 'Community Driven',
			description: 'Your feedback shapes our roadmap. We build what the community actually needs.'
		}
	];

	const stats = [
		{ label: 'Users Served', value: '50,000+', icon: Users },
		{ label: 'Hours Saved', value: '100,000+', icon: Clock },
		{ label: 'Apps Available', value: '15,247', icon: Code },
		{ label: 'Countries Reached', value: '120+', icon: Award }
	];

	const milestones = [
		{
			date: '2024',
			title: 'The Problem',
			description: 'After helping friends and family set up their new computers for the 20th time, we realized there had to be a better way.',
			icon: Lightbulb
		},
		{
			date: '2024',
			title: 'First Solution',
			description: 'Built the first version over a weekend. It was simple, but it worked and saved hours immediately.',
			icon: Code
		},
		{
			date: '2024',
			title: 'Going Public',
			description: 'Shared with online communities. The response was amazing - clearly we weren\'t alone in this struggle.',
			icon: Rocket
		},
		{
			date: '2025',
			title: 'Today',
			description: 'Serving 50,000+ users worldwide, saving thousands of hours every month.',
			icon: Target
		}
	];

	return (
		<main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Hero Section */}
			<section className="relative py-20 lg:py-28 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div>
							<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
								<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
									About TouchlessSetup
								</span>
							</h1>
							<p className="mt-6 text-xl text-gray-600 leading-relaxed">
								Born from the frustration of setting up new PCs, built with love. We're on a mission to save everyone 
								from the tedium of manual software installation, one custom installer at a time.
							</p>
							<div className="mt-8 flex items-center gap-4 text-lg text-gray-700">
								<Coffee className="h-6 w-6 text-amber-600" />
								<span>Perfect for new PC setups, fresh installs, and computer enthusiasts</span>
							</div>
						</div>
						
						<div className="relative">
							<div className="w-full h-80 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
								<div className="text-center text-white">
									<Rocket className="h-24 w-24 mx-auto mb-4" />
									<h3 className="text-2xl font-bold">Making PC Setup</h3>
									<h3 className="text-2xl font-bold">Ridiculously Simple</h3>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
						{stats.map((stat, index) => (
							<div key={index} className="text-center">
								<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
									<stat.icon className="h-8 w-8 text-white" />
								</div>
								<div className="text-3xl font-bold text-gray-900">{stat.value}</div>
								<div className="text-gray-600">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Our Story */}
			<section className="py-20">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
							Our Story
						</h2>
						<p className="text-xl text-gray-600">
							Every great tool starts with a problem that needed solving.
						</p>
					</div>

					<div className="space-y-12">
						{milestones.map((milestone, index) => (
							<div key={index} className="flex gap-8 items-start">
								<div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
									<milestone.icon className="h-8 w-8 text-white" />
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-4 mb-3">
										<h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
										<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
											{milestone.date}
										</span>
									</div>
									<p className="text-gray-600 leading-relaxed">{milestone.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Values */}
			<section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
							What Drives Us
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							These aren't just words on a wall. They're the principles that guide every decision we make.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{values.map((value, index) => (
							<div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
								<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
									<value.icon className="h-6 w-6 text-white" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
								<p className="text-gray-600 leading-relaxed">{value.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Mission Statement */}
			<section className="py-20">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white text-center">
						<h2 className="text-3xl sm:text-4xl font-bold mb-6">
							Our Mission
						</h2>
						<p className="text-xl text-blue-100 leading-relaxed mb-8">
							To eliminate the tedious, time-consuming process of manual software installation, 
							giving everyone back their most precious resource: <strong className="text-white">time</strong>.
						</p>
						<p className="text-lg text-blue-100 leading-relaxed">
							We believe that setting up a new machine should take minutes, not hours. 
							That choosing software should be fun, not frustrating. And that automation 
							should be accessible to everyone, not just tech experts.
						</p>
					</div>
				</div>
			</section>

			{/* The Tech */}
			<section className="py-20 bg-gray-50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
							Built on Solid Foundations
						</h2>
						<p className="text-xl text-gray-600">
							We stand on the shoulders of giants to deliver reliability you can trust.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						<div className="bg-white rounded-2xl p-8 shadow-lg">
							<div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-6">
								<Shield className="h-6 w-6 text-white" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-4">Microsoft WinGet</h3>
							<p className="text-gray-600 leading-relaxed">
								Every app comes from Microsoft's official package repository. No sketchy downloads, 
								no modified installers, no bloatware. Just official software from verified publishers.
							</p>
						</div>

						<div className="bg-white rounded-2xl p-8 shadow-lg">
							<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
								<Code className="h-6 w-6 text-white" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-4">Modern Web Stack</h3>
							<p className="text-gray-600 leading-relaxed">
								Built with C# (.NET Framework). Fast, secure, and maintainable. 
								The same tool professionals use every day.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Get Involved */}
			<section className="py-20">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
						Join Our Community
					</h2>
					<p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
						TouchlessSetup is more than just a tool - it's a community of people who believe 
						in the power of automation. Here's how you can be part of it.
					</p>

					<div className="grid md:grid-cols-2 gap-8">
						<div className="bg-gray-900 rounded-2xl p-8 text-white">
							<Github className="h-12 w-12 mx-auto mb-6" />
							<h3 className="text-xl font-bold mb-4">Contribute on GitHub</h3>
							<p className="text-gray-300 mb-6 leading-relaxed">
								Help us improve the platform, suggest new features, or report bugs. 
								Every contribution makes TouchlessSetup better for everyone.
							</p>
							<Button 
								variant="outline" 
								className="border-white text-white hover:bg-white hover:text-gray-900"
							>
								<Github className="mr-2 h-4 w-4" />
								View on GitHub
								<ExternalLink className="ml-2 h-4 w-4" />
							</Button>
						</div>

						<div className="bg-blue-600 rounded-2xl p-8 text-white">
							<Mail className="h-12 w-12 mx-auto mb-6" />
							<h3 className="text-xl font-bold mb-4">Share Your Feedback</h3>
							<p className="text-blue-100 mb-6 leading-relaxed">
								Have an idea for a new feature? Found a bug? Just want to say hi? 
								We'd love to hear from you.
							</p>
							<Button 
								variant="outline" 
								className="border-white text-white hover:bg-white hover:text-blue-600"
							>
								<Mail className="mr-2 h-4 w-4" />
								Get in Touch
								<ExternalLink className="ml-2 h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
						Ready to Save Hours of Your Life?
					</h2>
					<p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
						Join thousands of people who've already discovered the joy of automated PC setup.
					</p>
					<Link href="/#popular-apps">
						<Button 
							size="lg" 
							className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
						>
							<Rocket className="mr-3 h-6 w-6" />
							Try TouchlessSetup Now
							<ArrowRight className="ml-3 h-6 w-6" />
						</Button>
					</Link>
				</div>
			</section>
		</main>
	);
}
