import React from 'react';

import AvantagesMobilisation from '~/client/components/features/LesEntreprisesSEngagent/Avantages/AvantagesMobilisation';
import RejoignezMobilisation from '~/client/components/features/LesEntreprisesSEngagent/Rejoignez/RejoignezMobilisation';
import { Head } from '~/client/components/head/Head';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/les-entreprises-s-engagent/index.analytics';

export default function LesEntreprisesSEngagent() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Les entreprises s'engagent | 1jeune1solution"
				description="Votre entreprise recrute ou porte une initiative pour les jeunes ?"
				robots="index,follow" />
			<main id="contenu">
				<RejoignezMobilisation />
				<AvantagesMobilisation />
			</main>
		</>
	);
}
