import { SearchResults } from 'algoliasearch-helper';
import { SortBy } from 'instantsearch.js/es/types';

import { MeilisearchInput } from '~/client/components/ui/Meilisearch/MeilisearchInput/MeilisearchInput';
import { MeilisearchSelectMultiple } from '~/client/components/ui/Meilisearch/MeilisearchSelectMultiple/MeilisearchSelectMultiple';
import React from "react";

const MEILISEARCH_SORT_BY_LABEL_ASC: SortBy<SearchResults.FacetValue> = ['name:asc'];

export function FormulaireRechercheFicheMetier() {
	return (
		<form className="border--blue fr-p-5w" onSubmit={(event) => event.preventDefault()}>
			<div className="fr-grid-row fr-grid-row--gutters">
				<div className="fr-col-12 fr-col-md-6">
					<MeilisearchInput
						label="Métier"
						name="metier"
						labelComplement="Exemple : cuisinier" />
				</div>
				<div className="fr-col-12 fr-col-md-6">
					<MeilisearchSelectMultiple
						attribute="centres_interet"
						limit={100}
						label="Centres d‘intérêt"
						labelComplement="Exemple : J'ai le sens du contact"
						sortBy={MEILISEARCH_SORT_BY_LABEL_ASC} />
				</div>
			</div>
		</form>
	);
}
