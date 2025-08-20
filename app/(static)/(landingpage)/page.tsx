import Hero from './components/hero/hero';
import Link from '@/components/ui/link';
import {Feature} from './components/feature/feature';
import {Context} from './components/context';
import PopularApps from './components/popular-apps/popular-apps';
import SelectedAppsActions from './components/selected-apps-actions/selected-apps-actions';
import WingetAppsCard from './components/winget-apps/winget-apps-card';
import RenderIfAllAppsExist from './helpers/render-if-all-apps-exists';
import CallToAction from './components/call-to-action/call-to-action';

export default async function HomePage() {
	return (
		<main>
			<Hero />

			<Context>
				{/* Overlap the hero: pull up with negative margin and ensure on top with z-index */}
				<div className="relative -mt-32 max-w-6xl mx-auto p-6 space-y-6">
					<PopularApps />
					<SelectedAppsActions />
					<RenderIfAllAppsExist>
						<WingetAppsCard />
						<SelectedAppsActions />
					</RenderIfAllAppsExist>
				</div>
				<Feature />
			</Context>

			<CallToAction />

			<footer className="py-8 bg-[#A8C7DC] text-center text-sm space-y-2">
				<p>
					<Link href="/terms" className="mr-4">
						Terms of Use
					</Link>
					<Link href="/privacy">Privacy Policy</Link>
				</p>
				<p>© {new Date().getFullYear()} Touchless Setup</p>
			</footer>
		</main>
	);
}
