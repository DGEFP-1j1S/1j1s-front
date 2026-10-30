import React from 'react';

import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { SelectMultiple } from '~/client/components/ui/Form/Select/SelectMultiple';
import { getCapitalizedItems } from '~/client/utils/getCapitalizedItems';
import { Facette } from '~/server/services/meilisearch/rechercheIndexee';

interface ChampFacetteProps {
	label: string
	labelComplement?: string
	name: string
	facettes: Array<Facette>
	valeursInitiales: Array<string>
	tri?: (a: Facette, b: Facette) => number
}

const triAlphabetique = (a: Facette, b: Facette) => a.valeur.localeCompare(b.valeur);

export function ChampFacette({ label, labelComplement, name, facettes, valeursInitiales, tri = triAlphabetique }: ChampFacetteProps) {
	// NOTE : une valeur cochée peut ne plus avoir de résultat avec les autres filtres ; elle doit rester proposée pour être décochée
	const valeursAbsentes = valeursInitiales.filter((valeur) => !facettes.some((facette) => facette.valeur === valeur));
	const options = [...facettes, ...valeursAbsentes.map((valeur) => ({ nombre: 0, valeur }))].sort(tri);

	return (
		<Champ className="fr-select-group">
			<Champ.Label>
				{label}
				{labelComplement && <Champ.Label.Complement>{labelComplement}</Champ.Label.Complement>}
			</Champ.Label>
			<Champ.Input
				render={SelectMultiple}
				name={name}
				optionsAriaLabel={label}
				defaultValue={valeursInitiales}>
				{options.map((option) => (
					<SelectMultiple.Option key={option.valeur} value={option.valeur}>{getCapitalizedItems(option.valeur)}</SelectMultiple.Option>
				))}
			</Champ.Input>
			<Champ.Error />
		</Champ>
	);
}
