import { useRouter } from 'next/router';
import React, { FormEvent, Fragment } from 'react';

import { Checkbox } from '~/client/components/ui/Checkbox/Checkbox';
import { BoutonsRecherche } from '~/client/components/ui/Form/BoutonsRecherche/BoutonsRecherche';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ComboboxCommune } from '~/client/components/ui/Form/Combobox/ComboboxCommune/ComboboxCommune';
import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { mapToCommune } from '~/client/hooks/useCommuneQuery';
import { useMissionEngagementQuery } from '~/client/hooks/useMissionEngagementQuery';
import { useReinitialisationFormulaire } from '~/client/hooks/useReinitialisationFormulaire';
import { getFormAsQuery } from '~/client/utils/form.util';
import { MissionEngagementDomaine } from '~/server/engagement/domain/engagement';

interface FormulaireRechercheMissionEngagementProps {
	domainList: MissionEngagementDomaine[]
}

export function FormulaireRechercheMissionEngagement({domainList}: FormulaireRechercheMissionEngagementProps) {
	const router = useRouter();
	const queryParams = useMissionEngagementQuery();
	const { cle, reinitialiser, valeursInitiales } = useReinitialisationFormulaire(queryParams);

	const {
		codeCommune,
		latitudeCommune,
		longitudeCommune,
		ville,
		codePostal,
		distanceCommune,
		domain,
	} = valeursInitiales;

	const defaultCommune = mapToCommune({
		codeCommune,
		codePostal,
		latitudeCommune,
		longitudeCommune,
		ville,
	});

	async function rechercherMission(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQuery(event.currentTarget, queryParams);
		return router.push({query}, undefined, {shallow: true});
	}

	return (
		<form
			className="border--blue fr-p-5w"
			onSubmit={rechercherMission}
			aria-label="Rechercher une mission d'engagement">
			<h2 className="fr-h4 fr-mb-3w">Trouvez une mission d&apos;engagement</h2>
			<div className="fr-grid-row fr-grid-row--gutters">
				<Fragment key={cle}>
					<div className="fr-col-12 fr-col-md-6">
						<Champ className="fr-select-group">
							<Champ.Label>
								Domaine
								<Champ.Label.Complement>Exemple : Culture et loisirs</Champ.Label.Complement>
							</Champ.Label>
							<Champ.Input
								render={SelectSimple}
								optionsList={domainList}
								name="domain"
								defaultValue={domain}/>
							<Champ.Error/>
						</Champ>
					</div>
					<div className="fr-col-12 fr-col-md-6">
						<ComboboxCommune
							defaultCommune={defaultCommune}
							defaultDistance={distanceCommune}
							showRadiusInput/>
					</div>
					<div className="fr-col-12">
						<Checkbox
							label="Dès 16 ans"
							id="ouvertAuxMineurs"
							key={valeursInitiales.ouvertsAuxMineurs ? 'true' : 'false'}
							defaultChecked={valeursInitiales.ouvertsAuxMineurs || false}
							name="ouvertsAuxMineurs"
							value="true"/>
					</div>
				</Fragment>
				<div className="fr-m-auto">
					<BoutonsRecherche onReinitialiser={reinitialiser}/>
				</div>
			</div>
		</form>
	);
}
