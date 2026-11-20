import { useRouter } from 'next/router';
import React, { FormEvent, Fragment, useRef } from 'react';

import { BoutonsRecherche } from '~/client/components/ui/Form/BoutonsRecherche/BoutonsRecherche';
import { ComboboxCommune } from '~/client/components/ui/Form/Combobox/ComboboxCommune/ComboboxCommune';
import { ComboboxMetiers } from '~/client/components/ui/Form/Combobox/ComboboxMetiers';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { MetierDependenciesProvider } from '~/client/context/metier.context';
import { mapToCommune } from '~/client/hooks/useCommuneQuery';
import { useReinitialisationFormulaire } from '~/client/hooks/useReinitialisationFormulaire';
import { useStage3eEt2deQuery } from '~/client/hooks/useStage3eEt2deQuery';
import { MetierService } from '~/client/services/metiers/metier.service';
import { getFormAsQuery } from '~/client/utils/form.util';

export function FormulaireRechercheStages3eEt2de() {
	const queryParams = useStage3eEt2deQuery();
	const { cle, reinitialiser, valeursInitiales } = useReinitialisationFormulaire(queryParams);
	const {
		libelleMetier,
		codeMetier,
		codeCommune,
		codePostal,
		latitudeCommune,
		longitudeCommune,
		ville,
		distanceCommune,
	} = valeursInitiales;

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
					<Fragment key={cle}>
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
					</Fragment>
					<div className="fr-m-auto fr-mt-4w">
						<BoutonsRecherche onReinitialiser={reinitialiser}/>
					</div>
				</div>
			</form>
		</>
	);
}
