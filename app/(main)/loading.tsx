'use client';
import {LogoTextBottom} from '@/components/ui/logo';
import {useEffect, useState} from 'react';

export default function Loading() {
	const [dots, setDots] = useState('...');
	useEffect(() => {
		const int = setInterval(() => {
			if (dots.length >= 3) setDots('');
			else setDots(prev => prev + '.');
		}, 500);
		return clearInterval(int);
	}, []);
	return (
		<div className="h-[70vh] mx-auto flex flex-col items-center justify-center">
			<LogoTextBottom className="animate-pulse" />
			<h1 className="text-center opacity-40">Loading...</h1>
		</div>
	);
}
