import React from 'react';

import { EmploiEnEuropeContent } from '~/client/components/features/Europe/EmploiEnEuropeContent';
import { Head } from '~/client/components/head/Head';
import useAnalytics from '~/client/hooks/useAnalytics';

import analytics from './index.analytics';


export default function EuropePage() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title={'Trouver un emploi ou un volontariat en Europe  | 1jeune1solution'}
				robots="index,follow" />
			<EmploiEnEuropeContent />
		</>
	);
}

