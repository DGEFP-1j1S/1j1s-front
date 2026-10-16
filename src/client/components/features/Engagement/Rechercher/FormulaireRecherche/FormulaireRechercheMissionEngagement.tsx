import { useRouter } from 'next/router';
import React, { FormEvent } from 'react';

import styles
	from '~/client/components/features/Engagement/Rechercher/FormulaireRecherche/FormulaireRechercheMissionEngagement.module.scss';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Checkbox } from '~/client/components/ui/Checkbox/Checkbox';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ComboboxCommune } from '~/client/components/ui/Form/Combobox/ComboboxCommune/ComboboxCommune';
import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { mapToCommune } from '~/client/hooks/useCommuneQuery';
import { useMissionEngagementQuery } from '~/client/hooks/useMissionEngagementQuery';
import { getFormAsQuery } from '~/client/utils/form.util';
import { MissionEngagementDomaine } from '~/server/engagement/domain/engagement';

interface FormulaireRechercheMissionEngagementProps {
	domainList: MissionEngagementDomaine[]
}

export function FormulaireRechercheMissionEngagement({ domainList }: FormulaireRechercheMissionEngagementProps) {
	const router = useRouter();
	const queryParams = useMissionEngagementQuery();

	const {
		codeCommune,
		latitudeCommune,
		longitudeCommune,
		ville,
		codePostal,
		distanceCommune,
		domain,
	} = queryParams;

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
		return router.push({ query }, undefined, { shallow: true });
	}

	return (
		<form
			className={styles.rechercheMissionEngagementForm}
			onSubmit={rechercherMission}
			aria-label="Rechercher une mission d'engagement">
			<div className={styles.filtreRecherche}>
				<Champ>
					<Champ.Label>
						Domaine
						<Champ.Label.Complement>Exemple : Culture et loisirs</Champ.Label.Complement>
					</Champ.Label>
					<Champ.Input
						render={SelectSimple}
						optionsAriaLabel={'Domaines'}
						name="domain"
						defaultValue={domain}>
						{domainList.map((option) =>
							<SelectSimple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectSimple.Option>,
						)}
					</Champ.Input>
					<Champ.Error />
				</Champ>

				<ComboboxCommune
					defaultCommune={defaultCommune}
					defaultDistance={distanceCommune}
					showRadiusInput />

				<Checkbox
					label="Dès 16 ans"
					id="ouvertAuxMineurs"
					key={queryParams.ouvertsAuxMineurs ? 'true' : 'false'}
					defaultChecked={queryParams.ouvertsAuxMineurs || false}
					name="ouvertsAuxMineurs"
					value="true" />
			</div>

			<div className={styles.rechercherMissionEngagementButton}>
				<ButtonComponent label="Rechercher"
					icon={<Icon name="magnifying-glass" />}
					iconPosition="right"
								 type="submit" />
			</div>
		</form>
	);
}
