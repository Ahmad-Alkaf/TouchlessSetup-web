'use client';

import {useContext} from 'react';
import {SelectedAppsContext} from '../components/context';

export function TotalApps() {
	const {totalApps} = useContext(SelectedAppsContext);
	return <>{totalApps.toLocaleString('us')}</>;
}
