import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useRef, useState } from 'react';

import {
	StageDeposerOffreFormulaireLayout,
} from '~/client/components/features/OffreDeStage/Deposer/FormulaireLayout/StageDeposerOffreFormulaireLayout';
import { OffreDeStageDeposeeLocalisation } from '~/client/components/features/OffreDeStage/Deposer/StageDeposerOffre';
import { FormulaireEtapeLayout } from "~/client/components/layouts/FormulaireEtape/FormulaireEtapeLayout";
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { Input } from '~/client/components/ui/Form/Input';
import { ModalErrorSubmission } from '~/client/components/ui/Form/ModaleErrorSubmission/ModalErrorSubmission';
import { SpinnerIcon } from "~/client/components/ui/Icon/spinner.icon";
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { Button } from "~/client/dsfr";
import { paysList } from '~/client/domain/pays';
import { StageService } from '~/client/services/stage/stage.service';
import {
	StageDeposerOffreEtape1PersistenceService,
} from '~/client/services/stageDeposerOffreEtape1Persistence/stageDeposerOffreEtape1Persistence.service';
import {
	StageDeposerOffreEtape2PersistenceService,
} from '~/client/services/stageDeposerOffreEtape2Persistence/stageDeposerOffreEtape2Persistence.service';
import {
	StageDeposerOffreEtape3PersistenceService,
} from '~/client/services/stageDeposerOffreEtape3Persistence/stageDeposerOffreEtape3Persistence.service';
import { URL_DEPOSER_OFFRE } from '~/pages/stages/deposer-offre/index.page';
import { isSuccess } from '~/server/errors/either';

// NOTE (BRUJ 06/05/2024): Pour éviter l'hydratation mismatch lié au fait que le local storage peut modifier le contenu du html (valeur par défaut) cf https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const ComboboxPays = dynamic(() => import('~/client/components/ui/Form/Combobox/ComboboxPays').then((mod) => mod.ComboboxPays), { ssr: false });

enum LocalisationInputName {
	PAYS = 'pays',
	VILLE = 'ville',
	ADRESSE = 'adresse',
	CODE_POSTAL = 'codePostal',
	REGION = 'region',
	DEPARTEMENT = 'departement',
}

export default function StageDeposerOffreFormulaireEtape3Localisation() {
	const router = useRouter();
	const [isModalErrorSubmitOpen, setIsModalErrorSubmitOpen] = useState<boolean>(false);
	const stageService = useDependency<StageService>('stageService');

	const formRef = useRef<HTMLFormElement>(null);

	const [isLoading, setIsLoading] = useState(false);

	const persistenceEntreprise = useDependency<StageDeposerOffreEtape1PersistenceService>('stageDeposerOffreEtape1PersistenceService');
	const informationsEntreprise = persistenceEntreprise.getInformationsEtape1();

	const persistenceStage = useDependency<StageDeposerOffreEtape2PersistenceService>('stageDeposerOffreEtape2PersistenceService');
	const informationsStage = persistenceStage.getInformationsEtape2();

	const persistenceLocalisation = useDependency<StageDeposerOffreEtape3PersistenceService>('stageDeposerOffreEtape3PersistenceService');
	const informationsLocalisation = persistenceLocalisation.getInformationsEtape3();

	function getPaysDefaultValue() {
		const paysCodeStored = informationsLocalisation?.pays;
		if (!paysCodeStored) return undefined;

		const paysLabel = paysList.find((pays) => pays.code === paysCodeStored)?.libellé;
		if (!paysLabel) return undefined;

		return { code: paysCodeStored, label: paysLabel };
	}

	const paysDefaultValue = getPaysDefaultValue();

	useEffect(() => {
		if (!informationsEntreprise || !informationsStage) {
			router.push(URL_DEPOSER_OFFRE);
		}
	}, [router, informationsEntreprise, informationsStage]);

	const champsObligatoires = (
		<>
			<div className="fr-col-12 fr-col-xl-6">
				<ComboboxPays
					paysList={paysList}
					defaultValue={paysDefaultValue}
					label={'Pays'}
					labelComplement={'Exemple : France'}
					valueName={LocalisationInputName.PAYS}
					required />
			</div>
			<Champ className="fr-input-group fr-col-12 fr-col-xl-6">
				<Champ.Label>
				Ville
					<Champ.Label.Complement>Exemple : Paris</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					name={LocalisationInputName.VILLE}
					required
					defaultValue={informationsLocalisation?.ville} />
				<Champ.Error />
			</Champ>
			<Champ className="fr-input-group fr-col-12 fr-col-xl-6">
				<Champ.Label>
				Adresse
					<Champ.Label.Complement>Exemple : 127 rue de Grenelle</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					name={LocalisationInputName.ADRESSE}
					required
					defaultValue={informationsLocalisation?.adresse} />
				<Champ.Error />
			</Champ>
			<Champ className="fr-input-group fr-col-12 fr-col-xl-6">
				<Champ.Label>
				Code postal
					<Champ.Label.Complement>Exemple : 75007</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					name={LocalisationInputName.CODE_POSTAL}
					required
					defaultValue={informationsLocalisation?.codePostal} />
				<Champ.Error />
			</Champ>
		</>
	);

	const champsFacultatifs = (
		<>
			<Champ className="fr-input-group fr-col-12 fr-col-xl-6">
				<Champ.Label>
				Région
					<Champ.Label.Complement>Exemple : Île-De-France</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					name={LocalisationInputName.REGION}
					defaultValue={informationsLocalisation?.region} />
				<Champ.Error />
			</Champ>
			<Champ className="fr-input-group fr-col-12 fr-col-xl-6">
				<Champ.Label>
				Département
					<Champ.Label.Complement>Exemple : Yvelines</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					name={LocalisationInputName.DEPARTEMENT}
					defaultValue={informationsLocalisation?.departement} />
				<Champ.Error />
			</Champ>
		</>
	);

	const boutonValidation = isLoading
		? <Button disabled label="Envoi en cours" icon={<SpinnerIcon />} iconPosition="left" />
		: (
			<Button
				className="fr-btn--icon-right fr-icon-arrow-right-line"
				label="Envoyer ma demande de dépôt d’offre"
				type="submit"
				disabled={isLoading} />
		);

	async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
		setIsLoading(true);
		event.preventDefault();
		const form: HTMLFormElement = event.currentTarget;
		const data = new FormData(form);
		const donneesLocalisation = parseDonneesLocalisation(data);
		persistenceLocalisation.setInformationsEtape3(donneesLocalisation);

		if (informationsEntreprise !== null && informationsStage !== null) {
			const result = await stageService.enregistrerOffreDeStage(informationsEntreprise, informationsStage, donneesLocalisation);
			if (isSuccess(result)) {
				persistenceStage.removeInformationsEtape2();
				return router.push(`${URL_DEPOSER_OFFRE}/confirmation-envoi`);
			}
			setIsModalErrorSubmitOpen(true);
			setIsLoading(false);
		}
	}

	return (
		<>
			<FormulaireEtapeLayout
				etapeCourante={3}
				nombreEtapes={3}
				titre="Localisation du stage"
				urlEtapePrecedente={`${URL_DEPOSER_OFFRE}/votre-offre-de-stage`}>
				<StageDeposerOffreFormulaireLayout
					inputsObligatoires={champsObligatoires}
					inputsFacultatifs={champsFacultatifs}
					formRef={formRef}
					handleFormSubmit={handleFormSubmit}
					boutonValidation={boutonValidation} />
			</FormulaireEtapeLayout>
			<ModalErrorSubmission
				isOpen={isModalErrorSubmitOpen}
				onClose={() => setIsModalErrorSubmitOpen(false)}
				onBackToForm={() => setIsModalErrorSubmitOpen(false)} />
		</>
	);
};

function parseDonneesLocalisation(formData: FormData): OffreDeStageDeposeeLocalisation {
	return {
		adresse: String(formData.get(LocalisationInputName.ADRESSE)),
		codePostal: String(formData.get(LocalisationInputName.CODE_POSTAL)),
		departement: String(formData.get(LocalisationInputName.DEPARTEMENT)),
		pays: String(formData.get(LocalisationInputName.PAYS)),
		region: String(formData.get(LocalisationInputName.REGION)),
		ville: String(formData.get(LocalisationInputName.VILLE)),
	};
}
