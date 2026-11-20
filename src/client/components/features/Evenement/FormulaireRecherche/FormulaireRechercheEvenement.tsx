import React from 'react';

import styles
	from '~/client/components/features/Evenement/FormulaireRecherche/FormulaireRechercheEvenement.module.scss';
import { BoutonsRecherche } from '~/client/components/ui/Form/BoutonsRecherche/BoutonsRecherche';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ChampSuggestionsMultiples } from '~/client/components/ui/Form/ChampSuggestionsMultiples/ChampSuggestionsMultiples';
import { Input } from '~/client/components/ui/Form/Input';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { useEvenementQuery } from '~/client/hooks/useEvenementQuery';
import { useReinitialisationFormulaire } from '~/client/hooks/useReinitialisationFormulaire';
import { EvenementService } from '~/client/services/evenement/evenement.service';
import { useSoumissionRechercheIndexee } from '~/client/hooks/useSoumissionRechercheIndexee';

const MESSAGE_PAS_DE_RESULTAT = 'Aucune proposition ne correspond à votre saisie. Vérifiez que votre saisie correspond bien à un lieu. Exemple : Paris, Marseille …';

export function FormulaireRechercheEvenement() {
	const queryParams = useEvenementQuery();
	const evenementService = useDependency<EvenementService>('evenementService');

	const rechercher = useSoumissionRechercheIndexee(queryParams);
	const { cle, reinitialiser, valeursInitiales } = useReinitialisationFormulaire(queryParams);

	return (
		<form role="search" aria-label="Rechercher un évènement" onSubmit={rechercher}>
			<div className={styles.rechercherEvenementForm} key={cle}>
				<Champ className="fr-input-group">
					<Champ.Label>
						Mot-clé, métier, accompagnement…
						<Champ.Label.Complement>Exemples : gendarmerie, cuisinier, mentorat</Champ.Label.Complement>
					</Champ.Label>
					<Champ.Input render={Input} name="motCle" defaultValue={valeursInitiales.motCle} />
					<Champ.Error />
				</Champ>
				<ChampSuggestionsMultiples
					label="Localisation"
					labelComplement="Exemples : Toulouse, Paris…"
					name="lieux"
					optionsAriaLabel="villes"
					valeursInitiales={valeursInitiales.lieux ?? []}
					rechercher={(saisie) => evenementService.rechercherLieux(saisie)}
					messagePasDeResultat={MESSAGE_PAS_DE_RESULTAT} />
			</div>
			<div className="fr-grid-row fr-grid-row--center">
				<BoutonsRecherche onReinitialiser={reinitialiser} />
			</div>
		</form>
	);
}
