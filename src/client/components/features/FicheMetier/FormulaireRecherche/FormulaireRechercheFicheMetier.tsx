import { useRouter } from 'next/router';
import React, { FormEvent } from 'react';

import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ChampFacette } from '~/client/components/ui/Form/ChampFacette/ChampFacette';
import { Input } from '~/client/components/ui/Form/Input';
import { Button } from '~/client/dsfr';
import { useFicheMetierQuery } from '~/client/hooks/useFicheMetierQuery';
import { getFormAsQuery } from '~/client/utils/form.util';
import { Facette } from '~/server/services/meilisearch/rechercheIndexee';

interface FormulaireRechercheFicheMetierProps {
	facettes: {
		centresInteret: Array<Facette>
	}
}

export function FormulaireRechercheFicheMetier({ facettes }: FormulaireRechercheFicheMetierProps) {
	const router = useRouter();
	const queryParams = useFicheMetierQuery();

	function rechercher(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQuery(event.currentTarget, queryParams);
		router.push({ query }, undefined, { scroll: false });
	}

	return (
		<form className="border--blue fr-p-5w" role="search" aria-label="Rechercher un métier" onSubmit={rechercher}>
			<div className="fr-grid-row fr-grid-row--gutters">
				<div className="fr-col-12 fr-col-md-6">
					<Champ className="fr-input-group">
						<Champ.Label>
							Métier
							<Champ.Label.Complement>Exemple : cuisinier</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input render={Input} name="motCle" defaultValue={queryParams.motCle} />
						<Champ.Error />
					</Champ>
				</div>
				<div className="fr-col-12 fr-col-md-6">
					<ChampFacette
						label="Centres d‘intérêt"
						labelComplement="Exemple : J'ai le sens du contact"
						name="centresInteret"
						facettes={facettes.centresInteret}
						valeursInitiales={queryParams.centresInteret ?? []} />
				</div>
			</div>
			<div className="fr-grid-row fr-grid-row--center fr-mt-4w">
				<Button className="fr-btn--lg" label="Rechercher" type="submit" />
			</div>
		</form>
	);
}
