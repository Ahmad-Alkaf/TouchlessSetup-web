import Hero from './components/hero/hero';
import {Feature} from './components/feature/feature';
import {Context} from './components/context';
import PopularApps from './components/popular-apps/popular-apps';
import SelectedAppsActions from './components/selected-apps-actions/selected-apps-actions';
import WingetAppsCard from './components/winget-apps/winget-apps-card';
import RenderIfAllAppsExist from './helpers/render-if-all-apps-exists';
import CallToAction from './components/call-to-action/call-to-action';
import {FormatTotalApps} from '@/components/shared/format-total-apps';

export const metadata = {
	title: 'TouchlessSetup',
	description: `Tired of spending your weekend installing apps one by one? Choose from ${FormatTotalApps(null)} applications, click Generate Installer, and get back to enjoying your new computer while we handle the boring stuff.`,
	keywords: 'Windows setup, PC setup, software installer, automated installation, WinGet, bulk install apps, new PC setup, computer setup',
	openGraph: {
		title: 'TouchlessSetup - Set Up Your PC in Minutes, Not Hours',
		description: `Automate your Windows PC setup with ${FormatTotalApps(null)} applications. Perfect for new installs, fresh setups, and computer enthusiasts.`,
		type: 'website',
		siteName: 'TouchlessSetup'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'TouchlessSetup - Set Up Your PC in Minutes, Not Hours',
		description: `Automate your Windows PC setup with ${FormatTotalApps(null)} applications. Perfect for new installs and fresh setups.`
	}
};

export default async function HomePage() {
	return (
		<main>
			<Hero />

			<Context>
				{/* Overlap the hero: pull up with negative margin and ensure on top with z-index */}
				<div className="relative -mt-16 lg:-mt-32 max-w-6xl mx-auto p-6 space-y-6">
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
		</main>
	);
}
