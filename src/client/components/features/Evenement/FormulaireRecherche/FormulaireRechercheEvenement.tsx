import React from 'react';

import styles
	from '~/client/components/features/Evenement/FormulaireRecherche/FormulaireRechercheEvenement.module.scss';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ChampSuggestionsMultiples } from '~/client/components/ui/Form/ChampSuggestionsMultiples/ChampSuggestionsMultiples';
import { Input } from '~/client/components/ui/Form/Input';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { Button } from '~/client/dsfr';
import { useEvenementQuery } from '~/client/hooks/useEvenementQuery';
import { EvenementService } from '~/client/services/evenement/evenement.service';
import { useSoumissionRechercheIndexee } from '~/client/hooks/useSoumissionRechercheIndexee';

const MESSAGE_PAS_DE_RESULTAT = 'Aucune proposition ne correspond à votre saisie. Vérifiez que votre saisie correspond bien à un lieu. Exemple : Paris, Marseille …';

export function FormulaireRechercheEvenement() {
	const queryParams = useEvenementQuery();
	const evenementService = useDependency<EvenementService>('evenementService');

	const rechercher = useSoumissionRechercheIndexee(queryParams);

	return (
		<form role="search" aria-label="Rechercher un évènement" onSubmit={rechercher}>
			<div className={styles.rechercherEvenementForm}>
				<Champ className="fr-input-group">
					<Champ.Label>
						Mot-clé, métier, accompagnement…
						<Champ.Label.Complement>Exemples : gendarmerie, cuisinier, mentorat</Champ.Label.Complement>
					</Champ.Label>
					<Champ.Input render={Input} name="motCle" defaultValue={queryParams.motCle} />
					<Champ.Error />
				</Champ>
				<ChampSuggestionsMultiples
					label="Localisation"
					labelComplement="Exemples : Toulouse, Paris…"
					name="lieux"
					optionsAriaLabel="villes"
					valeursInitiales={queryParams.lieux ?? []}
					rechercher={(saisie) => evenementService.rechercherLieux(saisie)}
					messagePasDeResultat={MESSAGE_PAS_DE_RESULTAT}
					placeholder={placeholderLieux} />
			</div>
			<div className="fr-grid-row fr-grid-row--center">
				<Button className="fr-btn--lg" label="Rechercher" type="submit" />
			</div>
		</form>
	);
}

function placeholderLieux(nombreDeLieux: number) {
	if (nombreDeLieux === 0) return undefined;
	if (nombreDeLieux === 1) return '1 localisation sélectionnée';
	return `${nombreDeLieux} localisations sélectionnées`;
}
