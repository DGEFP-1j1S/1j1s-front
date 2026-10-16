import React from 'react';

import {
	ListeRésultatsRechercherSolution,
} from '~/client/components/layouts/RechercherSolution/ListeRésultats/ListeRésultatsRechercherSolution';
import {
	ResultatRechercherSolution,
} from '~/client/components/layouts/RechercherSolution/Resultat/ResultatRechercherSolution';
import { ResultatRechercheAlternanceEntreprise } from '~/server/alternances/domain/alternance';

export function ListeSolutionAlternanceEntreprise({ entrepriseList }: {
	entrepriseList: Array<ResultatRechercheAlternanceEntreprise>
}): React.ReactElement {
	const getTags = (entreprise: ResultatRechercheAlternanceEntreprise) => {
		const tags: Array<string> = [];
		if (entreprise.nombreSalariés) {
			if (entreprise.nombreSalariés.min === entreprise.nombreSalariés.max && entreprise.nombreSalariés.max > 0) {
				tags.push(`${entreprise.nombreSalariés.min} salariés`);
			} else if (entreprise.nombreSalariés.min !== entreprise.nombreSalariés.max) {
				tags.push(`${entreprise.nombreSalariés.min} à ${entreprise.nombreSalariés.max} salariés`);
			}
		}
		if (entreprise.candidaturePossible) {
			tags.push('Candidature spontanée');
		} else {
			tags.push('Rencontre au sein de l’entreprise', 'Candidature sur le site de l’entreprise');
		}
		return tags;
	};

	return (
		<>
			<ListeRésultatsRechercherSolution aria-label="Entreprises">
				{entrepriseList.map((entreprise, index) => (
					<li key={`${entreprise.id}-${index}`}>
						<ResultatRechercherSolution
							lienOffre={entreprise.candidaturePossible ? `http://labonnealternance.apprentissage.beta.gouv.fr/emploi/recruteurs_lba/${entreprise.id}/job?utm_source=1jeune1solution&utm_medium=web&utm_campaign=1j1s_recherche-emploi-candidat` : undefined}
							intituléOffre={entreprise.nom}
							intituléLienOffre={'Candidater'}
							étiquetteOffreList={getTags(entreprise)}>
							<ul>
								{entreprise.secteurs && entreprise.secteurs.length > 0 &&
									<li>{entreprise.secteurs.join(', ')}</li>}
								{entreprise.adresse && <li>{entreprise.adresse}</li>}
							</ul>
						</ResultatRechercherSolution>
					</li>
				))}
			</ListeRésultatsRechercherSolution>
		</>
	);
}
