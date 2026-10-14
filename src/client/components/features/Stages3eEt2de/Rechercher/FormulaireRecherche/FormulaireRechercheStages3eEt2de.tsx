import { useRouter } from 'next/router';
import React, { FormEvent, useRef } from 'react';

import { ComboboxCommune } from '~/client/components/ui/Form/Combobox/ComboboxCommune/ComboboxCommune';
import { ComboboxMetiers } from '~/client/components/ui/Form/Combobox/ComboboxMetiers';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { MetierDependenciesProvider } from '~/client/context/metier.context';
import { mapToCommune } from '~/client/hooks/useCommuneQuery';
import { useStage3eEt2deQuery } from '~/client/hooks/useStage3eEt2deQuery';
import { MetierService } from '~/client/services/metiers/metier.service';
import { getFormAsQuery } from '~/client/utils/form.util';

import { Button } from "~/client/dsfr";

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

	const defaultCommuneValue = mapToCommune({codeCommune, codePostal, latitudeCommune, longitudeCommune, ville});

	const metierDefaultValue = (codeMetier && libelleMetier)
		? {code: codeMetier, label: libelleMetier}
		: undefined;

	const metierService = useDependency<MetierService>('metierStage3eEt2deService');

	const rechercheStage3eEt2deForm = useRef<HTMLFormElement>(null);

	const router = useRouter();

	function updateRechercherStage3eEt2deQueryParams(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQuery(event.currentTarget, queryParams, false);
		return router.push({query}, undefined, {shallow: true});
	}

	return (
		<>
			<form
				className="border--blue fr-p-5w"
				ref={rechercheStage3eEt2deForm}
				role="search"
				aria-label="Rechercher un stage de 3e et 2de"
				onSubmit={updateRechercherStage3eEt2deQueryParams}>
				<h2 className="fr-h4 fr-mb-3w">Trouvez un stage de 3e et 2nde</h2>
				<p className="fr-hint">Tous les champs sont obligatoires sauf mention contraire</p>
				<div className="fr-grid-row fr-grid-row--gutters">
					<div className="fr-col-12 fr-col-md-6">
						<MetierDependenciesProvider metierService={metierService}>
							<ComboboxMetiers
								defaultValue={metierDefaultValue}
								placeholder={'Exemples : boulanger, styliste...'}
								label={'Métier (optionnel)'}
								valueName={'codeMetier'}/>
						</MetierDependenciesProvider>
					</div>
					<div className="fr-col-12 fr-col-md-6">
						<ComboboxCommune required showRadiusInput
														 defaultCommune={defaultCommuneValue}
						                 defaultDistance={distanceCommune}/>
					</div>
					<div className="fr-m-auto fr-mt-4w">
						<Button label="Rechercher" type="submit" className="fr-btn--lg"/>
					</div>
				</div>
			</form>
		</>
	);
}
