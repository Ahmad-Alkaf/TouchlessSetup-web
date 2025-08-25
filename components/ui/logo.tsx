import {cn} from '@/lib/utils';

export function LogoTextRight({className}: {className?: string}) {
	return (
		<div className={cn('flex items-center gap-3', className)}>
			<img
				src="/logo/logo.svg"
				className="h-12 transition-transform duration-300 hover:scale-105"
				alt="TouchlessSetup Logo"
			/>
			<div className="flex flex-col">
				<span className="text-xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
					TouchlessSetup
				</span>
				<span className="text-xs text-gray-500">
					Automated PC Installation
				</span>
			</div>
		</div>
	);
}
export function LogoTextBottom({className}: {className?: string}) {
	return (
		<div className={cn('flex flex-col items-center gap-2', className)}>
			<img
				src="/logo/logo.svg"
				className="h-16 transition-transform duration-300 hover:scale-105"
				alt="TouchlessSetup Logo"
			/>
			<div className="flex flex-col items-center">
				<span className="text-xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
					TouchlessSetup
				</span>
				<span className="text-xs text-gray-500">
					Automated PC Installation
				</span>
			</div>
		</div>
	);
}

export function LogoWithoutText({className}: {className?: string}) {
	return (
		<div className={cn('relative inline-block', className)}>
			<img
				src="/logo/logo.svg"
				className={cn(
					'h-12 transition-all duration-300 hover:scale-105 drop-shadow-lg',
					className
				)}
				alt="TouchlessSetup Logo"
			/>
		</div>
	);
}

// Clean SVG Logo Component for special use cases
export function TouchlessLogo({
	className,
	size = 48
}: {
	className?: string;
	size?: number;
}) {
	return (
		<div className={cn('relative inline-block', className)}>
			<svg
				width={size}
				height={size}
				viewBox="0 0 120 120"
				className="touchless-logo transition-transform duration-200 hover:scale-102 cursor-pointer drop-shadow-lg">
				<defs>
					<linearGradient
						id="TouchlessMainGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="100%">
						<stop
							offset="0%"
							style={{stopColor: '#1e40af', stopOpacity: 1}}
						/>
						<stop
							offset="100%"
							style={{stopColor: '#3b82f6', stopOpacity: 1}}
						/>
					</linearGradient>

					<filter
						id="TouchlessShadow"
						x="-20%"
						y="-20%"
						width="140%"
						height="140%">
						<feDropShadow
							dx="0"
							dy="2"
							stdDeviation="3"
							floodColor="rgba(30, 64, 175, 0.2)"
						/>
					</filter>
				</defs>

				<circle
					cx="60"
					cy="60"
					r="50"
					fill="url(#TouchlessMainGradient)"
					filter="url(#TouchlessShadow)"
				/>

				<g transform="translate(60,60)">
					<rect
						x="-25"
						y="-18"
						width="50"
						height="32"
						rx="4"
						fill="white"
						opacity="0.95"
						stroke="none"
					/>
					<rect
						x="-22"
						y="-15"
						width="44"
						height="24"
						rx="3"
						fill="url(#TouchlessMainGradient)"
						opacity="0.8"
					/>

					<rect
						x="-18"
						y="-10"
						width="12"
						height="2.5"
						rx="1.25"
						fill="white"
						opacity="0.9"
					/>
					<rect
						x="-18"
						y="-6"
						width="20"
						height="2.5"
						rx="1.25"
						fill="white"
						opacity="0.7"
					/>
					<rect
						x="-18"
						y="-2"
						width="16"
						height="2.5"
						rx="1.25"
						fill="white"
						opacity="0.8"
					/>
					<rect
						x="-18"
						y="2"
						width="10"
						height="2.5"
						rx="1.25"
						fill="white"
						opacity="0.6"
					/>
					<rect
						x="-18"
						y="6"
						width="14"
						height="2.5"
						rx="1.25"
						fill="white"
						opacity="0.5"
					/>

					<g transform="translate(-35,0)" opacity="0.9">
						<circle
							cx="0"
							cy="0"
							r="8"
							fill="white"
							opacity="0.2"
						/>
						<path
							d="M-3,-4 L0,-1 L3,-4 M0,-6 L0,6"
							stroke="white"
							strokeWidth="2.5"
							strokeLinecap="round"
						/>
					</g>

					<circle cx="0" cy="25" r="2" fill="white" opacity="0.7" />
					<circle
						cx="-6"
						cy="22"
						r="1.5"
						fill="white"
						opacity="0.5"
					/>
					<circle cx="6" cy="22" r="1.5" fill="white" opacity="0.5" />
				</g>
			</svg>
		</div>
	);
}
