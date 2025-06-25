import Link from '@/components/ui/link';

export const metadata = {
	title: 'Terms of Use | Touchless Setup',
	description:
		'Read the full Terms of Use for Touchless Setup – the Windows-only installer generator.'
};

export default function TermsOfUsePage() {
	return (
		<main className="max-w-4xl mx-auto py-16 px-4 space-y-8 prose prose-neutral dark:prose-invert">
			<h1>Terms of Use</h1>

			<p>
				Last updated:{' '}
				<strong>{new Date().toLocaleDateString('en-US')}</strong>
			</p>

			<p>
				Welcome to <strong>Touchless Setup</strong> (the "Service"). The
				Service enables visitors to select Windows applications and
				download a custom executable installer that installs those
				applications silently on a Windows system via Microsoft&rsquo;s
				WinGet package manager.
			</p>

			<h2>1. Acceptance of Terms</h2>
			<p>
				By accessing or using the Service, you confirm that you have
				read, understood, and agree to be bound by these Terms of Use
				("Terms"). If you do not agree with any part of the Terms, you
				must not use the Service.
			</p>

			<h2>2. Eligibility</h2>
			<p>
				The Service is intended for users who are 13 years of age or
				older. By using the Service, you represent and warrant that you
				meet this requirement.
			</p>

			<h2>3. How the Service Works</h2>
			<ol>
				<li>
					You browse and select software packages that are publicly
					listed in the official{' '}
					<Link
						href="https://github.com/microsoft/winget-pkgs"
						target="_blank">
						WinGet package repository
					</Link>
					.
				</li>
				<li>
					The Service generates a lightweight Windows executable
					(.exe) that, when run on a compatible Windows machine, will
					invoke WinGet commands to download and install the selected
					packages.
				</li>
				<li>
					The generated installer operates <em>only</em> on supported
					Windows versions (Windows 10&nbsp;1809 or later and
					Windows&nbsp;11). It does not function on other operating
					systems.
				</li>
			</ol>

			<h2>4. License</h2>
			<p>
				Subject to these Terms, we grant you a limited, non-exclusive,
				non-transferable, and revocable license to use the Service for
				personal or internal business purposes. You may not copy,
				modify, distribute, or resell any part of the Service without
				our prior written consent.
			</p>

			<h2>5. User Responsibilities</h2>
			<ul>
				<li>
					You are responsible for ensuring that any installer you
					download is used in compliance with local laws and the
					license terms of each individual application included.
				</li>
				<li>
					You must have administrative rights on the target Windows
					machine to run the installer.
				</li>
				<li>
					You agree not to use the Service for any unlawful, abusive,
					or malicious purpose.
				</li>
			</ul>

			<h2>6. Third-Party Software</h2>
			<p>
				All software installed through the generated installer is
				provided by third-party publishers and governed by their
				respective license agreements. We do not own, maintain, or
				provide warranties for such software.
			</p>

			<h2>7. Intellectual Property</h2>
			<p>
				"Touchless Setup" and its associated logos, code, and content
				are our intellectual property. All trademarks, servicemarks, and
				product names of third parties remain the property of their
				respective owners.
			</p>

			<h2>8. Disclaimer of Warranties</h2>
			<p>
				THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
				WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING
				BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
				FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. YOUR USE
				OF THE SERVICE AND ANY GENERATED INSTALLER IS AT YOUR SOLE RISK.
			</p>

			<h2>9. Limitation of Liability</h2>
			<p>
				IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
				SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
				PROFITS OR DATA, ARISING OUT OF OR IN CONNECTION WITH YOUR USE
				OF THE SERVICE OR ANY INSTALLER. OUR AGGREGATE LIABILITY SHALL
				NOT EXCEED FIFTY U.S. DOLLARS (US$50).
			</p>

			<h2>10. Indemnification</h2>
			<p>
				You agree to defend, indemnify, and hold us harmless from and
				against any claims, damages, liabilities, costs, and expenses
				(including reasonable attorneys' fees) arising out of your use
				of the Service or violation of these Terms.
			</p>

			<h2>11. Termination</h2>
			<p>
				We may suspend or terminate your access to the Service at any
				time, without prior notice, if we reasonably believe you have
				violated these Terms.
			</p>

			<h2>12. Changes to the Terms</h2>
			<p>
				We reserve the right to modify these Terms at any time. When we
				do, we will update the "Last updated" date at the top of this
				page. Continued use of the Service after such changes
				constitutes acceptance of the revised Terms.
			</p>

			<h2>13. Governing Law</h2>
			<p>
				These Terms shall be governed by and construed in accordance
				with the laws of the State of California, United States, without
				regard to its conflict-of-law provisions.
			</p>

			<h2>14. Contact</h2>
			<p>
				For questions about these Terms, please email us at
				<Link href="mailto:support@touchless.dev">
					support@touchless.dev
				</Link>
				.
			</p>
		</main>
	);
}
