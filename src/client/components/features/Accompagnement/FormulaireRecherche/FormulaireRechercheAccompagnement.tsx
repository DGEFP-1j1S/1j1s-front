import { useRouter } from 'next/router';
import React, { FormEvent, useRef } from 'react';

import styles
	from '~/client/components/features/Accompagnement/FormulaireRecherche/FormulaireRechercheAccompagnement.module.scss';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ComboboxCommune } from '~/client/components/ui/Form/Combobox/ComboboxCommune/ComboboxCommune';
import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { useAccompagnementQuery } from '~/client/hooks/useAccompagnementQuery';
import { mapToCommune } from '~/client/hooks/useCommuneQuery';
import { getFormAsQuery } from '~/client/utils/form.util';
import { TypeÉtablissement } from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

const typeAccompagnementListe = [
	{ libellé: 'Agences France Travail', valeur: TypeÉtablissement.FRANCE_TRAVAIL },
	{ libellé: 'Missions locales', valeur: TypeÉtablissement.MISSION_LOCALE },
	{ libellé: 'Info jeunes', valeur: TypeÉtablissement.INFO_JEUNE },
];

export function FormulaireRechercheAccompagnement() {
	const rechercheAccompagnementForm = useRef<HTMLFormElement>(null);


	const accompagnementQueryParams = useAccompagnementQuery();
	const {
		codeCommune,
		codePostal,
		ville,
		longitudeCommune,
		latitudeCommune,
		typeAccompagnement,
	} = accompagnementQueryParams;

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
		return router.push({ query }, undefined, { shallow: true });
	}

	return (
		<>
			<div className={styles.rechercherAccompagnementHint}>Tous les champs sont obligatoires</div>
			<form
				ref={rechercheAccompagnementForm}
				aria-label="Rechercher un accompagnement"
				className={styles.rechercheAccompagnementForm}
				onSubmit={updateRechercheAccompagnementQueryParams}>
				<div className={styles.filtresRecherche}>
					<div className={styles.comboboxCommune}>
						<ComboboxCommune
							defaultCommune={defaultCommuneValue}
							required />
					</div>

					<Champ>
						<Champ.Label>Type d‘accompagnement<Champ.Label.Complement>Exemple : Missions locales</Champ.Label.Complement></Champ.Label>
						<Champ.Input
							render={SelectSimple}
							required
							optionsAriaLabel={'type d‘accompagnement'}
							name="typeAccompagnement"
							defaultValue={typeAccompagnement}>
							{typeAccompagnementListe.map((option) =>
								<SelectSimple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectSimple.Option>,
							)}
						</Champ.Input>
						<Champ.Error />
					</Champ>

				</div>
				<div className={styles.buttonRechercher}>
					<ButtonComponent
						label="Rechercher"
						icon={<Icon name="magnifying-glass" />}
						iconPosition="right"
						type="submit" />
				</div>
				
			</form>
		</>
	);
}
