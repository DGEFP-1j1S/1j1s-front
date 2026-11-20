import React, { FormEvent } from 'react';

import { Button } from "~/client/dsfr";
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ComboboxCommune } from '~/client/components/ui/Form/Combobox/ComboboxCommune/ComboboxCommune';
import { Input } from '~/client/components/ui/Form/Input';
import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { TextArea } from '~/client/components/ui/Form/TextArea/TextArea';
import { Link } from '~/client/components/ui/Link/Link';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { ageOptions } from '~/client/domain/selectAgeData';
import {
	EtablissementAccompagnementService,
} from '~/client/services/etablissementAccompagnement/etablissementAccompagnement.service';
import { Age, DemandeDeContactAccompagnement } from '~/server/demande-de-contact/domain/demandeDeContact';
import { isSuccess } from '~/server/errors/either';
import {
	ContactEtablissementAccompagnement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';
import { emailRegex } from '~/shared/emailRegex';
import { telFrRegex } from '~/shared/telRegex';

interface FormulaireDemandeDeContactAccompagnementProps {
	contactEtablissementAccompagnement: ContactEtablissementAccompagnement
	onSuccess: () => void;
	onFailure: () => void;
}

export function FormulaireDemandeDeContactAccompagnement({
																													 contactEtablissementAccompagnement,
																													 onSuccess,
																													 onFailure,
																												 }: FormulaireDemandeDeContactAccompagnementProps) {
	const etablissementAccompagnementService = useDependency<EtablissementAccompagnementService>('établissementAccompagnementService');

	async function envoyerFormulaire(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form: HTMLFormElement = event.currentTarget;
		const data = new FormData(form);
		const demandeDeContactAccompagnement = mapDemandeDeContactAccompagnement(data, contactEtablissementAccompagnement);
		const result = await etablissementAccompagnementService.envoyerDemandeContact(demandeDeContactAccompagnement);
		if (isSuccess(result)) {
			onSuccess();
		} else {
			onFailure();
		}
	}

	return (
		<form
			onSubmit={envoyerFormulaire}>
			<div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
				<div className="fr-col-12 fr-col-lg-6">
					<Champ className="fr-input-group">
						<Champ.Label>
							Prénom
							<Champ.Label.Complement>Exemple : Jean</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input
							render={Input}
							type="text"
							name="firstname"
							required />
						<Champ.Error />
					</Champ>
				</div>

				<div className="fr-col-12 fr-col-lg-6">
					<Champ className="fr-input-group">
						<Champ.Label>
							Nom
							<Champ.Label.Complement>Exemple : Dupont</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input
							render={Input}
							type="text"
							name="lastname"
							required />
						<Champ.Error />
					</Champ>
				</div>
			</div>

			<div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
				<div className="fr-col-12 fr-col-lg-6">
					<Champ className="fr-input-group">
						<Champ.Label>
							Adresse e-mail (optionnel)
							<Champ.Label.Complement>Exemple : jean.dupont@gmail.com</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input
							render={Input}
							pattern={emailRegex}
							name="mail"
							type="email" />
						<Champ.Error />
					</Champ>
				</div>

				<div className="fr-col-12 fr-col-lg-6">
					<Champ className="fr-input-group">
						<Champ.Label>
							Téléphone
							<Champ.Label.Complement>Exemple : 0606060606</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input
							render={Input}
							pattern={telFrRegex}
							name="phone"
							type="tel"
							required />
						<Champ.Error />
					</Champ>
				</div>
			</div>

			<div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
				<div className="fr-col-12 fr-col-lg-6">
					<Champ className="fr-input-group">
						<Champ.Label>Age<Champ.Label.Complement>Exemple : 16 ans</Champ.Label.Complement></Champ.Label>
						<Champ.Input
							render={SelectSimple}
							required
							optionsList={ageOptions}
							name="age" />
						<Champ.Error />
					</Champ>
				</div>

				<div className="fr-col-12 fr-col-lg-6">
					<ComboboxCommune required />
				</div>
			</div>

			<Champ className="fr-mb-6w">
				<Champ.Label>Commentaires ou autres informations utiles (optionnel)</Champ.Label>
				<Champ.Input render={TextArea} name="commentaire" rows={5} />
				<Champ.Error />
			</Champ>

			<Button
				type="submit"
				className="fr-btn-lg fr-mb-4w	"
				label="Envoyer mes informations afin d‘être rappelé(e)" />

			<p className="background--blue-light fr-p-2w">
				Vous êtes informé que vos données à caractère personnel sont collectées et traitées par la DGEFP pour répondre
				à votre demande. Pour en savoir plus vous pouvez consulter la <Link href="/confidentialite">politique de
				confidentialité</Link> et les <Link href="/cgu">CGU</Link> de la DGEFP. En cliquant sur “Envoyer mes
				informations“ vos données seront transmises à la mission locale de la zone géographique dans laquelle vous
				résidez pour que celle-ci prenne contact avec vous.
			</p>
		</form>
	);

}

function mapDemandeDeContactAccompagnement(formData: FormData, contactEtablissementAccompagnement: ContactEtablissementAccompagnement): DemandeDeContactAccompagnement {
	return {
		age: Number(formData.get('age')) as Age,
		commentaire: String(formData.get('commentaire')),
		// TODO (BRUJ 16/07/2024): devrait être traité côté serveur
		commune: String(`${formData.get('ville')} (${formData.get('codePostal')})`),
		email: String(formData.get('mail')),
		nom: String(formData.get('lastname')),
		prénom: String(formData.get('firstname')),
		téléphone: String(formData.get('phone')),
		établissement: contactEtablissementAccompagnement,
	};
}
