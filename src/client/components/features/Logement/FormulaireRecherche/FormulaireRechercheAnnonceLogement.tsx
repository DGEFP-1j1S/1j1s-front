import React from 'react';

import { MeilisearchInput } from '~/client/components/ui/Meilisearch/MeilisearchInput/MeilisearchInput';
import { MeilisearchRange } from '~/client/components/ui/Meilisearch/MeilisearchRange/MeilisearchRange';
import {
	MeilisearchSelectMultiple,
} from '~/client/components/ui/Meilisearch/MeilisearchSelectMultiple/MeilisearchSelectMultiple';

export const PRIX_MINIMUM = 0;
export const PRIX_MAXIMUM = 3000;
export const SURFACE_MINIMUM = 0;
export const SURFACE_MAXIMUM = 500;
export const DEVISE = '€';
export const UNITE_SURFACE = 'm²';

export function FormulaireRechercheAnnonceLogement() {
	return (
		<form
			className="border--blue fr-p-5w"
			role="search"
			onSubmit={(event) => event.preventDefault()}>
			<h2 className="fr-h4 fr-mb-3w">Trouvez un logement qui vous correspond</h2>
			<div className="fr-grid-row fr-grid-row--gutters">
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<MeilisearchInput
						label="Ville"
						name="ville"
						labelComplement="Exemples : Paris, Toulouse" />
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<MeilisearchSelectMultiple
						attribute="type"
						label="Type d‘offre"
						labelComplement="Exemple : Location"
						sortBy={['name:asc']} />
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<MeilisearchSelectMultiple
						attribute="typeBien"
						label="Type de bien"
						labelComplement="Exemple : Appartement"
						sortBy={['name:asc']} />
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<MeilisearchRange
						attribute="surface"
						label="Surface (m²)"
						placeholder="Surface"
						unite={UNITE_SURFACE}
						min={SURFACE_MINIMUM}
						max={SURFACE_MAXIMUM} />
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<MeilisearchRange
						attribute="prix"
						label="Prix"
						placeholder="Fourchette de prix"
						unite={DEVISE}
						min={PRIX_MINIMUM}
						max={PRIX_MAXIMUM} />
				</div>
			</div>
		</form>
	);
}
