import './globals.css';
import type {Metadata, Viewport} from 'next';
import {Manrope} from 'next/font/google';
//nodb
// import { getUser, getTeamForUser } from '@/lib/db/queries';
import {SWRConfig} from 'swr';

export const metadata: Metadata = {
	title: 'TouchlessSetup',
	description:
		'Install All Your Apps Faster Than Ever. Create a custom .exe that installs apps without prompts or distractions. Just pure efficiency.'
};

export const viewport: Viewport = {
	maximumScale: 1
};

const manrope = Manrope({subsets: ['latin']});

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html
			lang="en"
			className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}>
			<body className="min-h-[100dvh] bg-gray-50">
				<SWRConfig
					value={{
						fallback: {
							// We do NOT await here
							// Only components that read this data will suspend
							//nodb
							// '/api/user': getUser(),
							// '/api/team': getTeamForUser()
						}
					}}>
					{children}
				</SWRConfig>
			</body>
		</html>
	);
}
