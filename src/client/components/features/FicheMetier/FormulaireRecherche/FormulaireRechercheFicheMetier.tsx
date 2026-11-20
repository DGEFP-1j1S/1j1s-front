import React from 'react';

import { BoutonsRecherche } from '~/client/components/ui/Form/BoutonsRecherche/BoutonsRecherche';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ChampFacette } from '~/client/components/ui/Form/ChampFacette/ChampFacette';
import { Input } from '~/client/components/ui/Form/Input';
import { useFicheMetierQuery } from '~/client/hooks/useFicheMetierQuery';
import { useReinitialisationFormulaire } from '~/client/hooks/useReinitialisationFormulaire';
import { useSoumissionRechercheIndexee } from '~/client/hooks/useSoumissionRechercheIndexee';
import { Facette } from '~/server/services/meilisearch/rechercheIndexee';

interface FormulaireRechercheFicheMetierProps {
	facettes: {
		centresInteret: Array<Facette>
	}
}

export function FormulaireRechercheFicheMetier({ facettes }: FormulaireRechercheFicheMetierProps) {
	const queryParams = useFicheMetierQuery();

	const rechercher = useSoumissionRechercheIndexee(queryParams);
	const { cle, reinitialiser, valeursInitiales } = useReinitialisationFormulaire(queryParams);

	return (
		<form className="border--blue fr-p-5w" role="search" aria-label="Rechercher un métier" onSubmit={rechercher}>
			<div className="fr-grid-row fr-grid-row--gutters" key={cle}>
				<div className="fr-col-12 fr-col-md-6">
					<Champ className="fr-input-group">
						<Champ.Label>
							Métier
							<Champ.Label.Complement>Exemple : cuisinier</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input render={Input} name="motCle" defaultValue={valeursInitiales.motCle} />
						<Champ.Error />
					</Champ>
				</div>
				<div className="fr-col-12 fr-col-md-6">
					<ChampFacette
						label="Centres d‘intérêt"
						labelComplement="Exemple : J'ai le sens du contact"
						name="centresInteret"
						facettes={facettes.centresInteret}
						valeursInitiales={valeursInitiales.centresInteret ?? []} />
				</div>
			</div>
			<div className="fr-grid-row fr-grid-row--center fr-mt-4w">
				<BoutonsRecherche onReinitialiser={reinitialiser} />
			</div>
		</form>
	);
}
