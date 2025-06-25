import Link from '@/components/ui/link';

export const metadata = {
	title: 'Privacy Policy | Touchless Setup',
	description: 'Learn how Touchless Setup collects and uses your information.'
};

export default function PrivacyPolicyPage() {
	return (
		<main className="max-w-4xl mx-auto py-16 px-4 space-y-8 prose prose-neutral dark:prose-invert">
			<h1>Privacy Policy</h1>

			<p>
				Last updated: <strong>{new Date().toLocaleDateString('en-US')}</strong>
			</p>

			<p>
				Touchless Setup (the "Service") respects your privacy and is
				committed to protecting it through our compliance with this
				policy.
			</p>

			<h2>1. Information We Collect</h2>
			<p>
				We strive to keep data collection to the bare minimum needed to
				provide the Service. Specifically:
			</p>
			<ul>
				<li>
					<strong>Application selections.</strong> We temporarily store the
					list of WinGet package IDs you choose in order to build your
					custom installer. This data is deleted automatically within
					24&nbsp;hours.
				</li>
				<li>
					<strong>Device information.</strong> We do <em>not</em>{' '}
					collect any information about the computer where you run the
					generated installer. All installation actions happen locally.
				</li>
				<li>
					<strong>Analytics.</strong> We may use privacy-focused,
					cookie-less analytics (e.g., Plausible, Simple Analytics) to
					understand aggregate usage patterns. These analytics do not
					store personally identifiable information (PII).
				</li>
			</ul>

			<h2>2. Cookies</h2>
			<p>
				The website itself does not set any tracking cookies. Essential
				cookies may be used solely for security (e.g., rate-limiting) and
				session handling if you log in.
			</p>

			<h2>3. How We Use Information</h2>
			<ul>
				<li>To operate and maintain the Service.</li>
				<li>
					To create and deliver the custom installer you requested.
				</li>
				<li>To monitor, improve, and secure the Service.</li>
			</ul>

			<h2>4. Sharing of Information</h2>
			<p>We do not sell or rent your data. We share information only:</p>
			<ul>
				<li>
					With trusted service providers who help us run the Service (e.g.,
					hosting), bound by confidentiality agreements.
				</li>
				<li>
					If required to comply with a legal obligation or protect our
					rights.
				</li>
			</ul>

			<h2>5. Data Security</h2>
			<p>
				We employ industry-standard safeguards to protect the information
				we hold. No method of transmission over the internet or electronic
				storage is 100% secure; therefore, absolute security cannot be
				guaranteed.
			</p>

			<h2>6. Data Retention</h2>
			<p>
				Application selections are retained for up to 24&nbsp;hours and then
				purged. Aggregated analytics data may be retained indefinitely.
			</p>

			<h2>7. Children's Privacy</h2>
			<p>
				The Service is not directed to children under 13. We do not
				knowingly collect personal information from children. If you
				believe we have inadvertently collected such data, please contact us
				so we can delete it.
			</p>

			<h2>8. Your Choices</h2>
			<ul>
				<li>
					You can avoid analytics tracking by enabling "Do Not Track" in your
					browser; our analytics provider honors it.
				</li>
				<li>
					You may contact us to request deletion of any data we hold about
					you.
				</li>
			</ul>

			<h2>9. Changes to This Policy</h2>
			<p>
				We may update this Privacy Policy periodically. Any changes will be
				posted on this page with an updated "Last updated" date. Your
				continued use of the Service after updates constitutes acceptance of
				the revised policy.
			</p>

			<h2>10. Contact</h2>
			<p>
				For privacy-related questions, please email us at{' '}
				<Link href="mailto:privacy@touchless.dev">privacy@touchless.dev</Link>
				.
			</p>
		</main>
	);
} 