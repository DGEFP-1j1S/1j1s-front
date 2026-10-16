import { useRouter } from 'next/router';
import React, { FormEvent, useRef } from 'react';

import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { ComboboxCommune } from '~/client/components/ui/Form/Combobox/ComboboxCommune/ComboboxCommune';
import { ComboboxMetiers } from '~/client/components/ui/Form/Combobox/ComboboxMetiers';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { MetierDependenciesProvider } from '~/client/context/metier.context';
import { mapToCommune } from '~/client/hooks/useCommuneQuery';
import { useStage3eEt2deQuery } from '~/client/hooks/useStage3eEt2deQuery';
import { MetierService } from '~/client/services/metiers/metier.service';
import { getFormAsQuery } from '~/client/utils/form.util';

import styles from './FormulaireRechercheStage3eEt2de.module.scss';

export function FormulaireRechercheStages3eEt2de() {
	const queryParams = useStage3eEt2deQuery();
	const {
		libelleMetier,
		codeMetier,
		codeCommune,
		codePostal,
		latitudeCommune,
		longitudeCommune,
		ville,
		distanceCommune,
	} = queryParams;

	const defaultCommuneValue = mapToCommune({ codeCommune, codePostal, latitudeCommune, longitudeCommune, ville });

	const metierDefaultValue = (codeMetier && libelleMetier)
		? { code: codeMetier, label: libelleMetier }
		: undefined;

	const metierService = useDependency<MetierService>('metierStage3eEt2deService');

	const rechercheStage3eEt2deForm = useRef<HTMLFormElement>(null);

	const router = useRouter();

	function updateRechercherStage3eEt2deQueryParams(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQuery(event.currentTarget, queryParams, false);
		return router.push({ query }, undefined, { shallow: true });
	}

	return (
		<>
			<p className={styles.champsInformation}>Tous les champs sont obligatoires sauf mention contraire</p>
			<form
				ref={rechercheStage3eEt2deForm}
				role="search"
				className={styles.rechercheOffreForm}
				aria-label="Rechercher un stage de 3e et 2de"
				onSubmit={updateRechercherStage3eEt2deQueryParams}>
				<div className={styles.filtresRechercherOffre}>
					<MetierDependenciesProvider metierService={metierService}>
						<ComboboxMetiers
							defaultValue={metierDefaultValue}
							placeholder={'Exemples : boulanger, styliste...'}
							label={'Métier (facultatif)'}
							valueName={'codeMetier'} />
					</MetierDependenciesProvider>
					<ComboboxCommune required showRadiusInput defaultCommune={defaultCommuneValue} defaultDistance={distanceCommune} />
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
