import React from 'react';

import { Head } from '~/client/components/head/Head';
import { HeroWithButtonLink } from '~/client/components/ui/Hero/HeroWithButtonLink';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/mes-aides/index.analytics';

export default function MesAidesPage() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Mes aides financières | 1jeune1solution"
				robots="index,follow" />
			<main id="contenu">
				<div className={'background-white-lilac'}>
					<HeroWithButtonLink
						titlePrimaryText="Je découvre les aides auxquelles j’ai droit en moins de 5 minutes"
						content={heroAidesContent()}
						buttonHref="https://mes-aides.1jeune1solution.beta.gouv.fr/simulation/individu/demandeur/date_naissance?utm_source=1jeune1solution"
						buttonLabel="Commencer la simulation"
						imgSrc="/images/aides-financières.webp" />

				</div>
			</main>
		</>
	);
}

function heroAidesContent() {
	return(
		<>Avant de démarrer la simulation de vos aides, pensez à vous munir de vos ressources et de celles de vos parents si vous êtes encore à leur charge.</>
	);
}
