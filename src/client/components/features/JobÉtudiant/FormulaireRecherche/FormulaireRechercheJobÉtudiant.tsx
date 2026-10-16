import { useRouter } from 'next/router';
import React, { FormEvent, useRef } from 'react';

import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ComboboxLocalisation } from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/ComboboxLocalisation';
import {
	mapToDefaultLocalisation,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/defaultLocalisation/mapToDefaultLocalisation';
import { Input } from '~/client/components/ui/Form/Input';
import { SelectMultiple } from '~/client/components/ui/Form/Select/SelectMultiple';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { référentielDomaineList } from '~/client/domain/référentielDomaineList';
import { useOffreQuery } from '~/client/hooks/useOffreQuery';
import { getFormAsQuery } from '~/client/utils/form.util';
import { mapRéférentielDomaineToOffreCheckboxFiltre } from '~/client/utils/offreEmploi.mapper';

import styles from './FormulaireRechercheJobEtudiant.module.scss';


export function FormulaireRechercheJobÉtudiant() {
	const rechercheJobÉtudiantForm = useRef<HTMLFormElement>(null);

	const queryParams = useOffreQuery();
	const router = useRouter();

	const inputLocalisation = mapToDefaultLocalisation(queryParams.codeLocalisation, queryParams.typeLocalisation, queryParams.nomLocalisation, queryParams.codePostalLocalisation);

	async function updateRechercherJobÉtudiantQueryParams(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQuery(event.currentTarget, queryParams);
		return router.push({ query }, undefined, { scroll: false });
	}

	return (
		<form
			ref={rechercheJobÉtudiantForm}
			role="search"
			className={styles.rechercheOffreForm}
			onSubmit={updateRechercherJobÉtudiantQueryParams}>
			<div className={styles.filtres}>
				<Champ>
					<Champ.Label>
						Métier, mot-clé (minimum 2 caractères)
						<Champ.Label.Complement>Exemples : boulanger, informatique…</Champ.Label.Complement>
					</Champ.Label>
					<Champ.Input
						render={Input}
						defaultValue={queryParams.motCle}
						name="motCle"
						minLength={2} />
					<Champ.Error />
				</Champ>

				<ComboboxLocalisation
					defaultValue={inputLocalisation} />

				<Champ className={styles.domaine}>
					<Champ.Label>
						Domaines
						<Champ.Label.Complement>Exemple : Commerce, Immobilier…</Champ.Label.Complement>
					</Champ.Label>
					<Champ.Input
						render={SelectMultiple}
						optionsAriaLabel={'Domaines'}
						name="grandDomaine"
						defaultValue={queryParams.grandDomaine?.split(',')}>
						{mapRéférentielDomaineToOffreCheckboxFiltre(référentielDomaineList).map((option) =>
							<SelectMultiple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectMultiple.Option>,
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
	);
}
