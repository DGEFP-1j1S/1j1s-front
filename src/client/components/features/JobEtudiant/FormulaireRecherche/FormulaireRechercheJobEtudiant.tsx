import { useRouter } from 'next/router';
import React, { FormEvent, Fragment, useRef } from 'react';

import { BoutonsRecherche } from '~/client/components/ui/Form/BoutonsRecherche/BoutonsRecherche';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ComboboxLocalisation } from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/ComboboxLocalisation';
import {
	mapToDefaultLocalisation,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/defaultLocalisation/mapToDefaultLocalisation';
import { Input } from '~/client/components/ui/Form/Input';
import { SelectMultiple } from '~/client/components/ui/Form/Select/SelectMultiple';
import { referentielDomaineList } from '~/client/domain/referentielDomaineList';
import { useOffreQuery } from '~/client/hooks/useOffreQuery';
import { useReinitialisationFormulaire } from '~/client/hooks/useReinitialisationFormulaire';
import { getFormAsQuery } from '~/client/utils/form.util';
import { mapReferentielDomaineToOffreCheckboxFiltre } from '~/client/utils/offreEmploi.mapper';


export function FormulaireRechercheJobEtudiant() {
	const rechercheJobEtudiantForm = useRef<HTMLFormElement>(null);

	const queryParams = useOffreQuery();
	const router = useRouter();
	const { cle, reinitialiser, valeursInitiales } = useReinitialisationFormulaire(queryParams);

	const inputLocalisation = mapToDefaultLocalisation(valeursInitiales.codeLocalisation, valeursInitiales.typeLocalisation, valeursInitiales.nomLocalisation, valeursInitiales.codePostalLocalisation);

	async function updateRechercherJobEtudiantQueryParams(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQuery(event.currentTarget, queryParams);
		return router.push({ query }, undefined, { scroll: false });
	}

	return (
		<form
			className="border--blue fr-p-5w"
			ref={rechercheJobEtudiantForm}
			aria-label="Rechercher un job étudiant"
			onSubmit={updateRechercherJobEtudiantQueryParams}
			role="search">
			<h2 className="fr-h4 fr-mb-5w">Trouvez votre job étudiant</h2>
			<div className="fr-grid-row fr-grid-row--gutters">
				<Fragment key={cle}>
					<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
						<Champ className="fr-input-group">
							<Champ.Label>
								Métier, mot-clé (minimum 2 caractères)
								<Champ.Label.Complement>Exemples : boulanger, informatique…</Champ.Label.Complement>
							</Champ.Label>
							<Champ.Input
								render={Input}
								defaultValue={valeursInitiales.motCle}
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
								defaultValue={valeursInitiales.grandDomaine?.split(',')}>
								{mapReferentielDomaineToOffreCheckboxFiltre(referentielDomaineList).map((option) =>
									<SelectMultiple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectMultiple.Option>,
								)}
							</Champ.Input>
							<Champ.Error />
						</Champ>
					</div>
				</Fragment>
				<div className="fr-m-auto fr-mt-4w">
					<BoutonsRecherche onReinitialiser={reinitialiser} />
				</div>
			</div>
		</form>
	);
}
