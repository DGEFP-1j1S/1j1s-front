import { useRouter } from 'next/router';
import React, { FormEvent, useRef } from 'react';

import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ComboboxLocalisation } from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/ComboboxLocalisation';
import {
	mapToDefaultLocalisation,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/defaultLocalisation/mapToDefaultLocalisation';
import { Input } from '~/client/components/ui/Form/Input';
import { SelectMultiple } from '~/client/components/ui/Form/Select/SelectMultiple';
import { Button } from '~/client/dsfr';
import { referentielDomaineList } from '~/client/domain/referentielDomaineList';
import { useOffreQuery } from '~/client/hooks/useOffreQuery';
import { getFormAsQuery } from '~/client/utils/form.util';
import { mapReferentielDomaineToOffreCheckboxFiltre } from '~/client/utils/offreEmploi.mapper';

export function FormulaireRechercheJobEte() {
	const rechercheJobEteForm = useRef<HTMLFormElement>(null);

	const queryParams = useOffreQuery();
	const router = useRouter();

	const inputLocalisation = mapToDefaultLocalisation(queryParams.codeLocalisation, queryParams.typeLocalisation, queryParams.nomLocalisation, queryParams.codePostalLocalisation);

	async function updateRechercherJobEteQueryParams(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQuery(event.currentTarget, queryParams);
		return router.push({ query }, undefined, { scroll: false });
	}

	return (
		<form
			className="border--blue fr-p-5w"
			ref={rechercheJobEteForm}
			aria-label="Rechercher un job d’été"
			onSubmit={updateRechercherJobEteQueryParams}
			role="search">
			<h2 className="fr-h4 fr-mb-5w">Trouvez votre job d’été</h2>
			<div className="fr-grid-row fr-grid-row--gutters">
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<Champ className="fr-input-group">
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
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<ComboboxLocalisation defaultValue={inputLocalisation} />
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<Champ className="fr-select-group">
						<Champ.Label>
							Domaines
							<Champ.Label.Complement>Exemple : Commerce, Immobilier…</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input
							render={SelectMultiple}
							optionsAriaLabel={'Domaines'}
							name="grandDomaine"
							defaultValue={queryParams.grandDomaine?.split(',')}>
							{mapReferentielDomaineToOffreCheckboxFiltre(referentielDomaineList).map((option) =>
								<SelectMultiple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectMultiple.Option>,
							)}
						</Champ.Input>
						<Champ.Error />
					</Champ>
				</div>
				<div className="fr-m-auto fr-mt-4w">
					<Button className="fr-btn--lg"
						label="Rechercher"
						type="submit" />
				</div>
			</div>
		</form>
	);
}
