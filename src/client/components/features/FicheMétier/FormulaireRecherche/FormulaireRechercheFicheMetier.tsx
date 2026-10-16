import { SearchResults } from 'algoliasearch-helper';
import { SortBy } from 'instantsearch.js/es/types';

import styles
	from '~/client/components/features/FicheMétier/FormulaireRecherche/FormulaireRechercheFicheMetier.module.scss';
import { MeilisearchInput } from '~/client/components/ui/Meilisearch/MeilisearchInput/MeilisearchInput';
import { MeilisearchSelectMultiple } from '~/client/components/ui/Meilisearch/MeilisearchSelectMultiple/MeilisearchSelectMultiple';

const MEILISEARCH_SORT_BY_LABEL_ASC: SortBy<SearchResults.FacetValue> = ['name:asc'];

export function FormulaireRechercheFicheMetier() {
	return (
		<form className={styles.RechercherMetierForm} onSubmit={(event) => event.preventDefault()}>
			<MeilisearchInput
				className={styles.inputNomMetier}
				label="Métier"
				name="metier"
				placeholder="Exemple : cuisinier" />
			<MeilisearchSelectMultiple
				className={styles.inputCentresInteret}
				attribute="centres_interet"
				limit={100}
				label="Centres d‘intérêt"
				sortBy={MEILISEARCH_SORT_BY_LABEL_ASC} />
		</form>
	);
}
