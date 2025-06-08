export function LogoTextRight({className}: {className?: string}) {
	return (
		<img
			src="/logo/logo-with-text-right.svg"
			className={className ?? 'h-12'}
		/>
	);
}
export function LogoTextBottom({className}: {className?: string}) {
	return (
		<img
			src="/logo/logo-with-text-bottom.svg"
			className={className ?? 'h-12'}
		/>
	);
}
export function LogoWithoutText({className}: {className?: string}) {
	return <img src="/logo/logo.svg" className={className ?? 'h-12'} />;
}
