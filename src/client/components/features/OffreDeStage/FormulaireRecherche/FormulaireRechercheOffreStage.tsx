import { useRouter } from 'next/router';
import React, { FormEvent } from 'react';

import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ChampFacette } from '~/client/components/ui/Form/ChampFacette/ChampFacette';
import { ChampSuggestionsMultiples } from '~/client/components/ui/Form/ChampSuggestionsMultiples/ChampSuggestionsMultiples';
import { Input } from '~/client/components/ui/Form/Input';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { useStageQuery } from '~/client/hooks/useStageQuery';
import { StageService } from '~/client/services/stage/stage.service';
import { getFormAsQueryAvecValeursRepetees } from '~/client/utils/form.util';
import { Button } from '~/client/dsfr';
import { Facette } from '~/server/services/meilisearch/rechercheIndexee';
import { DomainesStage } from '~/server/stages/repository/domainesStage';

const MESSAGE_PAS_DE_RESULTAT = 'Aucune proposition ne correspond à votre saisie. Vérifiez que votre saisie correspond bien à un lieu. Exemple : Paris, Marseille …';

function sortASCII(a: Facette, b: Facette) {
	if (a.valeur < b.valeur) {
		return -1;
	}
	if (a.valeur > b.valeur) {
		return 1;
	}
	return 0;
}

export function sortWithNonRenseigneAtTheEnd(a: Facette, b: Facette) {
	if (a.valeur === DomainesStage.NON_RENSEIGNE) {
		return 1;
	} else if (b.valeur === DomainesStage.NON_RENSEIGNE) {
		return -1;
	}
	return a.valeur.localeCompare(b.valeur);
}

export function sortByDurationAscending(a: Facette, b: Facette) {
	const MOINS_D_UN_MOIS = '< 1 mois';
	if (a.valeur === MOINS_D_UN_MOIS) {
		return -1;
	}
	if (b.valeur === MOINS_D_UN_MOIS) {
		return 1;
	}
	return sortASCII(a, b);
}

interface FormulaireRechercheOffreStageProps {
	facettes: {
		domaines: Array<Facette>
		durees: Array<Facette>
	}
}

export function FormulaireRechercheOffreStage({ facettes }: FormulaireRechercheOffreStageProps) {
	const router = useRouter();
	const queryParams = useStageQuery();
	const stageService = useDependency<StageService>('stageService');

	function rechercher(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQueryAvecValeursRepetees(event.currentTarget, queryParams);
		router.push({ query }, undefined, { scroll: false });
	}

	return (
		<form className="border--blue fr-p-5w" role="search" aria-label="Rechercher un stage" onSubmit={rechercher}>
			<h2 className="fr-h4 fr-mb-3w">Trouvez un stage qui vous correspond</h2>
			<div className="fr-grid-row fr-grid-row--gutters">
				<div className="fr-col-12 fr-col-md-6">
					<Champ className="fr-input-group">
						<Champ.Label>
							Métiers, mots clés, …
							<Champ.Label.Complement>Exemples : designer, juriste…</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input render={Input} name="motCle" defaultValue={queryParams.motCle} />
						<Champ.Error />
					</Champ>
				</div>
				<div className="fr-col-12 fr-col-md-6">
					<ChampSuggestionsMultiples
						label="Localisation"
						labelComplement="Exemples : Toulouse, Paris…"
						name="localisations"
						optionsAriaLabel="villes"
						valeursInitiales={queryParams.localisations ?? []}
						rechercher={(saisie) => stageService.rechercherLocalisations(saisie)}
						messagePasDeResultat={MESSAGE_PAS_DE_RESULTAT}
						placeholder={placeholderLocalisations} />
				</div>
				<div className="fr-col-12 fr-col-md-6">
					<ChampFacette
						label="Domaines"
						name="domaines"
						facettes={facettes.domaines}
						valeursInitiales={queryParams.domaines ?? []}
						tri={sortWithNonRenseigneAtTheEnd} />
				</div>
				<div className="fr-col-12 fr-col-md-6">
					<ChampFacette
						label="Durée de stage"
						name="durees"
						facettes={facettes.durees}
						valeursInitiales={queryParams.durees ?? []}
						tri={sortByDurationAscending} />
				</div>
			</div>
			<div className="fr-grid-row fr-grid-row--center fr-mt-4w">
				<Button className="fr-btn--lg" label="Rechercher" type="submit" />
			</div>
		</form>
	);
}

function placeholderLocalisations(nombreDeLocalisations: number) {
	if (nombreDeLocalisations === 0) return undefined;
	if (nombreDeLocalisations === 1) return '1 localisation sélectionnée';
	return `${nombreDeLocalisations} localisations sélectionnées`;
}
