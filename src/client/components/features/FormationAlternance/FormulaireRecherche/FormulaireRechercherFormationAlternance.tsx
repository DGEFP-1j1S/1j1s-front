import { useRouter } from 'next/router';
import React, { FormEvent } from 'react';

import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ComboboxCommune } from '~/client/components/ui/Form/Combobox/ComboboxCommune/ComboboxCommune';
import { ComboboxMetiers } from '~/client/components/ui/Form/Combobox/ComboboxMetiers';
import { Metier } from '~/client/components/ui/Form/Combobox/ComboboxMetiers/Metier';
import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { MetierDependenciesProvider } from '~/client/context/metier.context';
import { mapToCommune } from '~/client/hooks/useCommuneQuery';
import { useFormationQuery } from '~/client/hooks/useFormationQuery';
import { MetierService } from '~/client/services/metiers/metier.service';
import { getFormAsQuery } from '~/client/utils/form.util';
import { estQueryIdentiqueAAsPath } from '~/client/utils/queryString.util';
import { FORMATION_NIVEAU_ETUDES } from '~/server/formations/domain/formation';

import {Button} from "~/client/dsfr";

type FormulaireRechercherFormationAlternanceProps = {
	enEtatErreur?: boolean
}

export function FormulaireRechercherFormationAlternance({ enEtatErreur = false }: FormulaireRechercherFormationAlternanceProps) {
	const queryParams = useFormationQuery();
	const {
		libelleMetier,
		codeRomes,
		codeCommune,
		latitudeCommune,
		longitudeCommune,
		distanceCommune,
		ville,
		codePostal,
		niveauEtudes,
	} = queryParams;

	const domaineDefaultValue: Metier | undefined = (codeRomes && libelleMetier)
		? { code: codeRomes.toString(), label: libelleMetier }
		: undefined;

	const metierService = useDependency<MetierService>('metierLbaService');

	const communeDefaultValue = mapToCommune({
		codeCommune,
		codePostal,
		latitudeCommune,
		longitudeCommune,
		ville,
	});
	const router = useRouter();

	async function updateRechercherFormationQueryParams(event: FormEvent<HTMLFormElement>): Promise<boolean | void> {
		event.preventDefault();
		const query = getFormAsQuery(event.currentTarget, queryParams, false);
		// NOTE: en état d‘erreur, resoumettre à l‘identique est le geste de réessai de l‘utilisateur : la garde doit être levée.
		if (!enEtatErreur && estQueryIdentiqueAAsPath(router.asPath, query)) return;
		return router.push({ query });
	}

	return (
		<>
			<form
				className="border--blue fr-p-5w"
				aria-label="Rechercher une formation"
				onSubmit={updateRechercherFormationQueryParams}>
				<h2 className="fr-h4 fr-mb-3w">Trouvez une formation en alternance</h2>
				<p className="fr-hint">Tous les champs sont obligatoires sauf mention contraire</p>
				<div className="fr-grid-row fr-grid-row--gutters">
					<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
						<MetierDependenciesProvider metierService={metierService}>
							<ComboboxMetiers
								defaultValue={domaineDefaultValue}
								required
								autoFocus
								valueName={'codeRomes'}/>
						</MetierDependenciesProvider>
					</div>
					<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
						<ComboboxCommune
							defaultCommune={communeDefaultValue}
							showRadiusInput
							defaultDistance={distanceCommune}
							required/>
					</div>
					<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
						<Champ className="fr-select-group">
							<Champ.Label>
								Niveau d’études visé (facultatif)
								<Champ.Label.Complement>Exemples : CAP, Bac...</Champ.Label.Complement>
							</Champ.Label>
							<Champ.Input
								render={SelectSimple}
								optionsList={FORMATION_NIVEAU_ETUDES}
								name="niveauEtudes"
								defaultValue={niveauEtudes}/>
							<Champ.Error/>
						</Champ>
					</div>
					<div className="fr-m-auto fr-mt-4w">
						<Button label="Rechercher" type="submit" className="fr-btn--lg" />
					</div>
				</div>
			</form>
		</>
	);
}
