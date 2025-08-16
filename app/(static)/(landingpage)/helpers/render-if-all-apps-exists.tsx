'use client';
import {useContext} from 'react';
import {SelectedAppsContext} from '../components/context';

export default function RenderIfAllAppsExist({
	children
}: {
	children: React.ReactNode;
}) {
	const {apps} = useContext(SelectedAppsContext);
	if (apps == null) return null;
	return children;
}
