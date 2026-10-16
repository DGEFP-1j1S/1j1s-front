import React from 'react';

import { Head } from '~/client/components/head/Head';
import { HeroWithButtonLink } from '~/client/components/ui/Hero/HeroWithButtonLink';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/creer-mon-cv/index.analytics';

export default function FormationPage() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Créer mon CV personnalisé | 1jeune1solution"
				robots="index,follow" />
			<main id="contenu">
				<HeroWithButtonLink
					titlePrimaryText="Je crée un CV personnalisé qui valorise mes compétences "
					titleSecondaryText="et s’adapte à chaque annonce"
					content={heroCVContent()}
					buttonHref="https://diagoriente.fr/"
					buttonLabel="Créer mon CV"
					imgSrc="/images/créer-son-cv.webp" />
			</main>
		</>
	);
};

function heroCVContent() {
	return(
		<span>Booster vos chances de trouver un emploi en personnalisant votre CV et en mettant en valeur vos compétences en fonction des annonces auxquelles vous postulez.</span>
	);
}
