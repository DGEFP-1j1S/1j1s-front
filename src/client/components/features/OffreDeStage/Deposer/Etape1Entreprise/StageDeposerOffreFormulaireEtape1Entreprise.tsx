import { useRouter } from 'next/router';
import React, { FormEvent, useRef } from 'react';

import {
	StageDeposerOffreFormulaireLayout,
} from '~/client/components/features/OffreDeStage/Deposer/FormulaireLayout/StageDeposerOffreFormulaireLayout';
import { OffreDeStageDeposeeEntreprise } from '~/client/components/features/OffreDeStage/Deposer/StageDeposerOffre';
import { FormulaireEtapeLayout } from "~/client/components/layouts/FormulaireEtape/FormulaireEtapeLayout";
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { Input } from '~/client/components/ui/Form/Input';
import { TextArea } from '~/client/components/ui/Form/TextArea/TextArea';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { Button } from "~/client/dsfr";
import {
	StageDeposerOffreEtape1PersistenceService,
} from '~/client/services/stageDeposerOffreEtape1Persistence/stageDeposerOffreEtape1Persistence.service';
import { URL_DEPOSER_OFFRE } from '~/pages/stages/deposer-offre/index.page';
import { emailRegex } from '~/shared/emailRegex';

const URL_REGEX = '(https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*))';
const MESSAGE_ERREUR_EMAIL = "Veuillez saisir une adresse e-mail valide, au format camille@email.fr";

function validerEmail(value: string | number | readonly string[] | undefined): string {
	const email = String(value ?? "").trim();
	if (email === "" || new RegExp(emailRegex).test(email)) return "";
	return MESSAGE_ERREUR_EMAIL;
}

enum InputName {
	DESCRIPTION = 'descriptionEmployeur',
	EMAIL = 'emailEmployeur',
	LOGO = 'logoEmployeur',
	NOM = 'nomEmployeur',
	SITE = 'siteEmployeur'
}

export default function StageDeposerOffreFormulaireEtape1Entreprise() {
	const formRef = useRef<HTMLFormElement>(null);

	const router = useRouter();

	const persistenceEntreprise = useDependency<StageDeposerOffreEtape1PersistenceService>('stageDeposerOffreEtape1PersistenceService');
	const informationsEntreprise = persistenceEntreprise.getInformationsEtape1();

	const champsObligatoires = (
		<>
			<Champ className="fr-input-group fr-col-12 fr-col-lg-6 fr-col-offset-lg-6--right">
				<Champ.Label>Nom de l’entreprise ou de l’employeur
					<Champ.Label.Complement>255 caractères maximum</Champ.Label.Complement>
					<Champ.Label.Complement>Exemples : Crédit Agricole, SNCF… </Champ.Label.Complement>
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
			</Champ>
			<Champ className="fr-input-group fr-col-12 fr-col-lg-6 fr-col-offset-lg-6--right">
				<Champ.Label>Adresse mail de contact
					<Champ.Label.Complement>
						Cette adresse de contact sera utilisée dans le cas où
						il manquerait des informations pour valider votre demande, ou pour vous informer du statut de cette dernière.
						Cette adresse peut donc être différente de l’adresse sur laquelle il faudra candidater.
					</Champ.Label.Complement>
					<Champ.Label.Complement>
						Exemple : contactRH@example.com
					</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					name={InputName.EMAIL}
					pattern={emailRegex}
					validation={validerEmail}
					defaultValue={informationsEntreprise?.emailEmployeur}
					required
					type="email"
					autoComplete="email" />
				<Champ.Error />
			</Champ>
			<Champ className="fr-input-group fr-col-12">
				<Champ.Label>Courte description de l’entreprise
					<Champ.Label.Complement>
						500 caractères maximum
					</Champ.Label.Complement>
					<Champ.Label.Complement>
						Informations sur votre entreprise : son histoire, des objectifs, des enjeux...
					</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={TextArea}
					name={InputName.DESCRIPTION}
					onChange={(event) => event.currentTarget}
					defaultValue={informationsEntreprise?.descriptionEmployeur}
					required
					rows={4}
					maxLength={500} />
				<Champ.Error />
			</Champ>
		</>
	);

	const champsoptionnels = (
		<>
			<Champ className="fr-input-group fr-col-12 fr-col-lg-6">
				<Champ.Label>Logo de l’entreprise - lien/URL (optionnel)
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
			<Champ className="fr-input-group fr-col-12 fr-col-lg-6">
				<Champ.Label>Lien du site de l’entreprise - lien/URL (optionnel)
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
		<Button
			className="fr-btn--lg"
			label="Passer à l'étape suivante"
			type="submit" />
	);

	function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form: HTMLFormElement = event.currentTarget;
		const data = new FormData(form);
		const donneesEntreprise = parseDonneesEntreprise(data);
		persistenceEntreprise.setInformationsEtape1(donneesEntreprise);
		return router.push(`${URL_DEPOSER_OFFRE}/votre-offre-de-stage`);
	}

	return (
		<FormulaireEtapeLayout
			etapeCourante={1}
			nombreEtapes={3}
			titre="Votre entreprise"
			titreEtapeSuivante="Votre offre de stage">
			<StageDeposerOffreFormulaireLayout
				inputsObligatoires={champsObligatoires}
				inputsoptionnels={champsoptionnels}
				formRef={formRef}
				handleFormSubmit={handleFormSubmit}
				boutonValidation={boutonValidation} />
		</FormulaireEtapeLayout>
	);
};

function parseDonneesEntreprise(formData: FormData): OffreDeStageDeposeeEntreprise {
	return {
		descriptionEmployeur: String(formData.get(InputName.DESCRIPTION)),
		emailEmployeur: String(formData.get(InputName.EMAIL)),
		logoEmployeur: String(formData.get(InputName.LOGO)),
		nomEmployeur: String(formData.get(InputName.NOM)),
		siteEmployeur: String(formData.get(InputName.SITE)),
	};
}
