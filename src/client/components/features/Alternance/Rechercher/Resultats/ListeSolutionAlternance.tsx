import React from 'react';

import {
	ListeRésultatsRechercherSolution,
} from '~/client/components/layouts/RechercherSolution/ListeRésultats/ListeRésultatsRechercherSolution';
import {
	ResultatRechercherSolution,
} from '~/client/components/layouts/RechercherSolution/Resultat/ResultatRechercherSolution';
import {
	AlternanceContrat,
	AlternanceSource,
	isMatcha,
	ResultatRechercheAlternanceOffre,
} from '~/server/alternances/domain/alternance';

export function ListeSolutionAlternance({ alternanceList }: {
	alternanceList: Array<ResultatRechercheAlternanceOffre>
}): React.ReactElement {
	const getLogo = (alternance: ResultatRechercheAlternanceOffre) => {
		if (alternance.source === AlternanceSource.MATCHA) {
			return '/images/logos/la-bonne-alternance-candidat.svg';
		}
		return '/images/logos/france-travail.svg';
	};

	const getAlternativeTextuelle = (alternance: ResultatRechercheAlternanceOffre) => {
		if (isMatcha(alternance.source)) {
			return 'la bonne alternance';
		}
		return 'france travail';
	};

	function getTags(alternance: ResultatRechercheAlternanceOffre) {
		const tags = [];
		if (alternance.localisation) tags.push(alternance.localisation);

		if (alternance.source === AlternanceSource.FRANCE_TRAVAIL) {
			tags.push(AlternanceContrat.ALTERNANCE);
			if (alternance.typeDeContrat && alternance.typeDeContrat.length > 0) tags.push(...alternance.typeDeContrat);
			return tags;
		}

		if (alternance.typeDeContrat && alternance.typeDeContrat.length > 0) tags.push(...alternance.typeDeContrat);
		if (alternance.niveauRequis) tags.push(alternance.niveauRequis);
		return tags;
	}

	return (
		<>
			<ListeRésultatsRechercherSolution aria-label="Offres d’alternances">
				{alternanceList.map((alternance) => (
					<li key={alternance.id}>
						<ResultatRechercherSolution
							lienOffre={`/apprentissage/${alternance.id}`}
							intituléOffre={alternance.titre}
							logo={getLogo(alternance)}
							étiquetteOffreList={getTags(alternance)}
							sousTitreOffre={alternance.entreprise.nom}
							logoAlt={getAlternativeTextuelle(alternance)} />
					</li>
				))}
			</ListeRésultatsRechercherSolution>
		</>
	);
}
