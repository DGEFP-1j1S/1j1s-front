import { useRouter } from 'next/router';
import React, { FormEvent, useRef } from 'react';

import {
	StageDeposerOffreFormulaireLayout,
} from '~/client/components/features/OffreDeStage/Déposer/FormulaireLayout/StageDeposerOffreFormulaireLayout';
import { OffreDeStageDeposeeEntreprise } from '~/client/components/features/OffreDeStage/Déposer/StageDeposerOffre';
import { FormulaireÉtapeLayout } from '~/client/components/layouts/FormulaireEtape/FormulaireEtapeLayout';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { Input } from '~/client/components/ui/Form/Input';
import { TextArea } from '~/client/components/ui/Form/TextArea/TextArea';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import {
	StageDeposerOffreEtape1PersistenceService,
} from '~/client/services/stageDeposerOffreEtape1Persistence/stageDeposerOffreEtape1Persistence.service';
import { URL_DEPOSER_OFFRE } from '~/pages/stages/deposer-offre/index.page';
import { emailRegex } from '~/shared/emailRegex';

import styles from './StageDeposerOffreFormulaireÉtape1Entreprise.module.scss';

const URL_REGEX = '(https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*))';

enum InputName {
	DESCRIPTION = 'descriptionEmployeur',
	EMAIL = 'emailEmployeur',
	LOGO = 'logoEmployeur',
	NOM = 'nomEmployeur',
	SITE = 'siteEmployeur'
}

export default function StageDeposerOffreFormulaireÉtape1Entreprise() {
	const formRef = useRef<HTMLFormElement>(null);

	const router = useRouter();

	const persistenceEntreprise = useDependency<StageDeposerOffreEtape1PersistenceService>('stageDeposerOffreEtape1PersistenceService');
	const informationsEntreprise = persistenceEntreprise.getInformationsEtape1();

	const champsObligatoires = (
		<>
			<Champ className={styles.nomEntreprise}>
				<Champ.Label>Nom de l’entreprise ou de l’employeur
					<Champ.Label.Complement>Exemples : Crédit Agricole, SNCF…</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					name={InputName.NOM}
					required
					type="text"
					maxLength={255}
					defaultValue={informationsEntreprise?.nomEmployeur}
					autoComplete="organization" />
				<Champ.Error />
				<Champ.Hint>255 caractères maximum</Champ.Hint>
			</Champ>
			<Champ>
				<Champ.Label>Adresse mail de contact
					<Champ.Label.Complement>Exemple : contactRH@example.com</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					name={InputName.EMAIL}
					pattern={emailRegex}
					defaultValue={informationsEntreprise?.emailEmployeur}
					required
					type="email"
					autoComplete="email" />
				<Champ.Error />
				<Champ.Hint>
				Cette adresse de contact sera utilisée dans le cas où
				il manquerait des informations pour valider votre demande, ou pour vous informer du statut de cette dernière.
				Cette adresse peut donc être différente de l’adresse sur laquelle il faudra candidater.
				</Champ.Hint>
			</Champ>
			<Champ className={styles.textareaWrapper}>
				<Champ.Label>Courte description de l’entreprise (500 caractères maximum)
					<Champ.Label.Complement>Informations sur votre entreprise : son histoire, des objectifs, des
					enjeux...</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={TextArea}
					name={InputName.DESCRIPTION}
					onChange={(event) => event.currentTarget}
					defaultValue={informationsEntreprise?.descriptionEmployeur}
					required
					rows={10}
					maxLength={500} />
				<Champ.Error />
			</Champ>
		</>
	);

	const champsFacultatifs = (
		<>
			<Champ>
				<Champ.Label>Logo de l’entreprise - lien/URL
					<Champ.Label.Complement>Exemple :
					https://www.1jeune1solution.gouv.fr/images/logos/r%C3…</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input render={Input}
					type="url"
					name={InputName.LOGO}
					defaultValue={informationsEntreprise?.logoEmployeur}
					pattern={URL_REGEX} />
				<Champ.Error />
			</Champ>
			<Champ>
				<Champ.Label>Lien du site de l’entreprise - lien/URL
					<Champ.Label.Complement>Exemple : https://1jeune1solution.gouv.fr</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input render={Input}
					type="url"
					name={InputName.SITE}
					defaultValue={informationsEntreprise?.siteEmployeur}
					pattern={URL_REGEX} />
				<Champ.Error />
			</Champ>
		</>
	);

	const boutonValidation = (
		<ButtonComponent
			icon={<Icon name="angle-right" />}
			iconPosition="right"
			label="Suivant"
			type="submit" />
	);

	function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form: HTMLFormElement = event.currentTarget;
		const data = new FormData(form);
		const donnéesEntreprise = parseDonnéesEntreprise(data);
		persistenceEntreprise.setInformationsEtape1(donnéesEntreprise);
		return router.push(`${URL_DEPOSER_OFFRE}/votre-offre-de-stage`);
	}

	return (
		<FormulaireÉtapeLayout
			étape="Étape 1 sur 3 : Votre entreprise">
			<StageDeposerOffreFormulaireLayout
				inputsObligatoires={champsObligatoires}
				inputsFacultatifs={champsFacultatifs}
				formRef={formRef}
				handleFormSubmit={handleFormSubmit}
				boutonValidation={boutonValidation} />
		</FormulaireÉtapeLayout>
	);
};

function parseDonnéesEntreprise(formData: FormData): OffreDeStageDeposeeEntreprise {
	return {
		descriptionEmployeur: String(formData.get(InputName.DESCRIPTION)),
		emailEmployeur: String(formData.get(InputName.EMAIL)),
		logoEmployeur: String(formData.get(InputName.LOGO)),
		nomEmployeur: String(formData.get(InputName.NOM)),
		siteEmployeur: String(formData.get(InputName.SITE)),
	};
}
