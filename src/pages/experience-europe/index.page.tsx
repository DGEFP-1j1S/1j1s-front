import React from 'react';
import { Head } from '~/client/components/head/Head';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from './index.analytics';
import { ExperiencesEnEurope } from '~/client/components/features/Europe/Sections/ExperiencesEnEurope';
import { Dispositifs } from '~/client/components/features/Europe/Sections/Dispositifs';
import { LiensUtiles } from '~/client/components/features/Europe/Sections/LiensUtiles';


export default function EuropePage() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title={'Trouver un emploi ou un volontariat en Europe  | 1jeune1solution'}
				robots="index,follow"
			/>
			<main id="contenu">
				<ExperiencesEnEurope />
				<Dispositifs />
				<LiensUtiles />
			</main>
		</>
	);
}

