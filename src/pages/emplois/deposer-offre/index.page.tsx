import React from 'react';

import { Head } from '~/client/components/head/Head';
import { Banner } from '~/client/components/ui/Hero/Hero';
import { Link } from '~/client/components/ui/Link/Link';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/emplois/deposer-offre/index.analytics';

export default function DéposerUneOffreDEmploi() {
	useAnalytics(analytics);

	return (
		<main id="contenu">
			<Head
				title="Déposer une offre d‘emploi ou d‘alternance | 1jeune1solution"
				robots="index,follow" />
			<Banner>
				<h1>
						Je dépose une offre d‘emploi ou d‘alternance sur 1jeune1solution
				</h1>
				<p className="fr-h3">En partenariat avec France Travail</p>
				<p>Si vous avez besoin d’échanger avec un conseiller, contactez le 39 95 (service gratuit + le prix d’un appel local, du lundi au samedi inclus, de 7h30 à 20h). Depuis l’étranger (entreprises frontalières par exemple), composez le +33 1 77 86 39 95. Vous pouvez également programmer une demande de rappel par un conseiller sur :  <Link href='https://urldefense.com/v3/__https:/pro.francetravail.fr/accueil/demandederappel__;!!FiWPmuqhD5aF3oDTQnc!iyqpB-G35-BrqkJViRoO2702VTRuXwLqnyLallEQawiA6ZOpWOZVGffzeAty1JVAg0Xd80FiILE_IXJnt1sB9oIiZimxZ8LNd0uw6vjcAPSzA24d3k1P$'>francetravail.fr</Link>. Pour rappel, le numéro unique 3995 vous permet d’échanger avec un conseiller du lundi au samedi inclus, de 7h30 à 20h, avec un système de demande de rappel en cas d’indisponibilité.</p>
				<Link className='fr-btn fr-btn--lg' href='https://pro.francetravail.fr/depotoffrerecruteur/accueil'>Publier une offre</Link>
			</Banner>
		</main>
	);
}

