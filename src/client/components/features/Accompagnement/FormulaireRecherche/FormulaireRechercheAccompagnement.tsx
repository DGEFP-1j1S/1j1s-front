import { useRouter } from 'next/router';
import React, { FormEvent, Fragment, useRef } from 'react';

import { BoutonsRecherche } from '~/client/components/ui/Form/BoutonsRecherche/BoutonsRecherche';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ComboboxCommune } from '~/client/components/ui/Form/Combobox/ComboboxCommune/ComboboxCommune';
import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { useAccompagnementQuery } from '~/client/hooks/useAccompagnementQuery';
import { mapToCommune } from '~/client/hooks/useCommuneQuery';
import { useReinitialisationFormulaire } from '~/client/hooks/useReinitialisationFormulaire';
import { getFormAsQuery } from '~/client/utils/form.util';
import { TypeEtablissement } from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

const typeAccompagnementListe = [
	{libellé: 'Agences France Travail', valeur: TypeEtablissement.FRANCE_TRAVAIL},
	{libellé: 'Missions locales', valeur: TypeEtablissement.MISSION_LOCALE},
	{libellé: 'Info jeunes', valeur: TypeEtablissement.INFO_JEUNE},
];

export function FormulaireRechercheAccompagnement() {
	const rechercheAccompagnementForm = useRef<HTMLFormElement>(null);


	const accompagnementQueryParams = useAccompagnementQuery();
	const { cle, reinitialiser, valeursInitiales } = useReinitialisationFormulaire(accompagnementQueryParams);
	const {
		codeCommune,
		codePostal,
		ville,
		longitudeCommune,
		latitudeCommune,
		typeAccompagnement,
	} = valeursInitiales;

	const defaultCommuneValue = mapToCommune({
		codeCommune,
		codePostal,
		latitudeCommune,
		longitudeCommune,
		ville,
	});

	const router = useRouter();


	async function updateRechercheAccompagnementQueryParams(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQuery(event.currentTarget, accompagnementQueryParams, false);
		return router.push({query}, undefined, {shallow: true});
	}

	return (
		<>
			<form
				ref={rechercheAccompagnementForm}
				className="border--blue fr-p-5w"
				aria-label="Rechercher un accompagnement"
				onSubmit={updateRechercheAccompagnementQueryParams}>
				<h2 className="fr-h4 fr-mb-3w">Trouvez un accompagnement</h2>
				<p className="fr-hint">Tous les champs sont obligatoires sauf mention contraire</p>
				<div className="fr-grid-row fr-grid-row--gutters">
					<Fragment key={cle}>
						<div className="fr-col-12 fr-col-md-6">
							<ComboboxCommune
								defaultCommune={defaultCommuneValue}
								required/>
						</div>
						<div className="fr-col-12 fr-col-md-6">
							<Champ className="fr-input-group">
								<Champ.Label>Type d‘accompagnement<Champ.Label.Complement>Exemple : Missions
									locales</Champ.Label.Complement></Champ.Label>
								<Champ.Input
									render={SelectSimple}
									required
									optionsList={typeAccompagnementListe}
									name="typeAccompagnement"
									defaultValue={typeAccompagnement}/>
								<Champ.Error/>
							</Champ>
						</div>
					</Fragment>
					<div className="fr-m-auto fr-mt-4w">
						<BoutonsRecherche onReinitialiser={reinitialiser}/>
					</div>
				</div>
			</form>
		</>
	);
}
