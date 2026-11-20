import { useRouter } from 'next/router';
import React, { FormEvent } from 'react';

import styles
	from '~/client/components/features/Alternance/Rechercher/FormulaireRecherche/FormulaireRechercheAlternance.module.scss';
import { BoutonsRecherche } from '~/client/components/ui/Form/BoutonsRecherche/BoutonsRecherche';
import { ComboboxCommune } from '~/client/components/ui/Form/Combobox/ComboboxCommune/ComboboxCommune';
import {
	ComboboxMetiers,
} from '~/client/components/ui/Form/Combobox/ComboboxMetiers';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { MetierDependenciesProvider } from '~/client/context/metier.context';
import { useAlternanceQuery } from '~/client/hooks/useAlternanceQuery';
import { mapToCommune } from '~/client/hooks/useCommuneQuery';
import { useReinitialisationFormulaire } from '~/client/hooks/useReinitialisationFormulaire';
import { MetierService } from '~/client/services/metiers/metier.service';
import { getFormAsQuery } from '~/client/utils/form.util';

function doNothing() {
	return;
}

interface FormulaireRechercheAlternanceProps {
	onSubmit?: () => void;
}

export function FormulaireRechercheAlternance(props: FormulaireRechercheAlternanceProps) {
	const onSubmit = props.onSubmit || doNothing;
	const queryParams = useAlternanceQuery();
	const { cle, reinitialiser, valeursInitiales } = useReinitialisationFormulaire(queryParams);
	const {
		libelleMetier,
		codeRomes,
		codeCommune,
		distanceCommune,
		longitudeCommune,
		latitudeCommune,
		ville,
		codePostal,
	} = valeursInitiales;

	const metierService = useDependency<MetierService>('metierLbaService');

	const domaineDefaultValue = (codeRomes && libelleMetier)
		? { code: codeRomes.toString(), label: libelleMetier }
		: undefined;

	const defaultCommune = mapToCommune({
		codeCommune,
		codePostal,
		latitudeCommune,
		longitudeCommune,
		ville,
	});

	const router = useRouter();

	async function updateRechercherAlternanceQueryParams(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onSubmit();
		const formEntries = getFormAsQuery(event.currentTarget, queryParams, false);
		return router.push({ query: new URLSearchParams(formEntries).toString() }, undefined, { scroll: false });
	}

	return (
		<>
			<p className={styles.champsObligatoires}>Tous les champs sont obligatoires</p>
			<form
				className={styles.rechercheOffreForm}
				aria-label="Rechercher une alternance"
				onSubmit={updateRechercherAlternanceQueryParams}>
				<div className={styles.filtresRechercherOffre} key={cle}>
					<MetierDependenciesProvider metierService={metierService}>
						<ComboboxMetiers
							defaultValue={domaineDefaultValue}
							required
							valueName={'codeRomes'} />
					</MetierDependenciesProvider>

					<ComboboxCommune
						defaultCommune={defaultCommune}
						showRadiusInput
						defaultDistance={distanceCommune}
						required />
				</div>
				<div className={styles.buttonRechercher}>
					<BoutonsRecherche onReinitialiser={reinitialiser} />
				</div>
			</form>
		</>
	);
}
