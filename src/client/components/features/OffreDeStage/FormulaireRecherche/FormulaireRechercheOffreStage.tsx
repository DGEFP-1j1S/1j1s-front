import type { SearchResults } from 'algoliasearch-helper';
import React from 'react';

import {
	MeilisearchComboboxLocalisation
} from '~/client/components/ui/Meilisearch/MeilisearchComboboxLocalisation/MeilisearchComboboxLocalisation';
import { MeilisearchInput } from '~/client/components/ui/Meilisearch/MeilisearchInput/MeilisearchInput';
import {
	MeilisearchSelectMultiple
} from '~/client/components/ui/Meilisearch/MeilisearchSelectMultiple/MeilisearchSelectMultiple';
import { DomainesStage } from '~/server/stages/repository/domainesStage';

const LIMIT_MAX_DOMAINS = 100;

function sortASCII(a: SearchResults.FacetValue, b: SearchResults.FacetValue) {
	if (a.name < b.name) {
		return -1;
	}
	if (a.name > b.name) {
		return 1;
	}
	return 0;
}

export function sortWithNonRenseigneAtTheEnd(a: SearchResults.FacetValue, b: SearchResults.FacetValue) {
	if (a.name === DomainesStage.NON_RENSEIGNE) {
		return 1;
	} else if (b.name === DomainesStage.NON_RENSEIGNE) {
		return -1;
	}
	return a.name.localeCompare(b.name);
}

export function sortByDurationAscending(a: SearchResults.FacetValue, b: SearchResults.FacetValue) {
	const MOINS_D_UN_MOIS = '< 1 mois';
	if (a.name === MOINS_D_UN_MOIS) {
		return -1;
	}
	if (b.name === MOINS_D_UN_MOIS) {
		return 1;
	}
	return sortASCII(a, b);
}

export function FormulaireRechercheOffreStage() {
	return (
		<form className="border--blue fr-p-5w" onSubmit={(event) => event.preventDefault()}>
			<h2 className="fr-h4 fr-mb-3w">Trouvez un stage qui vous correspond</h2>
			<div className="fr-grid-row fr-grid-row--gutters">
				<div className="fr-col-12 fr-col-md-6">
					<MeilisearchInput
						label="Métiers, mots clés, …"
						name="motCle"
						labelComplement="Exemples : designer, juriste…"/>
				</div>
				<div className="fr-col-12 fr-col-md-6">
					<MeilisearchComboboxLocalisation attribute="localisationFiltree"/>
				</div>
				<div className="fr-col-12 fr-col-md-6">
					<MeilisearchSelectMultiple
						attribute="domaines"
						limit={LIMIT_MAX_DOMAINS}
						label="Domaines"
						sortBy={sortWithNonRenseigneAtTheEnd}/>
				</div>
				<div className="fr-col-12 fr-col-md-6">
					<MeilisearchSelectMultiple
						attribute="dureeCategorisee"
						label="Durée de stage"
						sortBy={sortByDurationAscending}/>
				</div>
			</div>
		</form>
	);
}
