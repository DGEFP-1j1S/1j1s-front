import type { SearchResults } from 'algoliasearch-helper';
import React from 'react';

import styles
	from '~/client/components/features/OffreDeStage/FormulaireRecherche/FormulaireRechercheOffreStage.module.scss';
import { MeilisearchComboboxLocalisation } from '~/client/components/ui/Meilisearch/MeilisearchComboboxLocalisation/MeilisearchComboboxLocalisation';
import { MeilisearchInput } from '~/client/components/ui/Meilisearch/MeilisearchInput/MeilisearchInput';
import { MeilisearchSelectMultiple } from '~/client/components/ui/Meilisearch/MeilisearchSelectMultiple/MeilisearchSelectMultiple';
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
		<form className={styles.RechercherStageForm} onSubmit={(event) => event.preventDefault()}>
			<MeilisearchInput
				label="Métiers, mots clés, …"
				name="motCle"
				placeholder="Exemples : designer, juriste…" />
			<MeilisearchComboboxLocalisation
				attribute="localisationFiltree" />
			<MeilisearchSelectMultiple
				attribute="domaines"
				limit={LIMIT_MAX_DOMAINS}
				label="Domaines"
				sortBy={sortWithNonRenseigneAtTheEnd} />
			<MeilisearchSelectMultiple
				attribute="dureeCategorisee"
				label="Durée de stage"
				sortBy={sortByDurationAscending} />
		</form>
	);
}
