'use client';

import {useContext} from 'react';
import {SelectedAppsContext} from '../../app/(static)/(landingpage)/components/context';
import {FormatTotalApps} from './format-total-apps';

export function TotalApps() {
	const {totalApps} = useContext(SelectedAppsContext);
	return <>{FormatTotalApps(totalApps)}</>;
}
