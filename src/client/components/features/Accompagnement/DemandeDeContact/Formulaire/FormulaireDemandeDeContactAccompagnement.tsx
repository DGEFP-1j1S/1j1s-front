import React, { FormEvent, useState } from 'react';
import styles
	from 'src/client/components/features/Accompagnement/DemandeDeContact/Formulaire/FormulaireDemandeDeContactAccompagnement.module.scss';

import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { LoadingButton } from '~/client/components/ui/Button/LoadingButton';
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
} from '~/client/services/établissementAccompagnement/etablissementAccompagnement.service';
import { Age, DemandeDeContactAccompagnement } from '~/server/demande-de-contact/domain/demandeDeContact';
import { isSuccess } from '~/server/errors/either';
import {
	ContactEtablissementAccompagnement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';
import { emailRegex } from '~/shared/emailRegex';
import { telFrRegex } from '~/shared/telRegex';

interface FormulaireDemandeDeContactAccompagnementProps {
	contactÉtablissementAccompagnement: ContactEtablissementAccompagnement
	onSuccess: () => void;
	onFailure: () => void;
}

export function FormulaireDemandeDeContactAccompagnement({
																													 contactÉtablissementAccompagnement,
																													 onSuccess,
																													 onFailure,
																												 }: FormulaireDemandeDeContactAccompagnementProps) {
	const établissementAccompagnementService = useDependency<EtablissementAccompagnementService>('établissementAccompagnementService');
	const [isLoading, setIsLoading] = useState(false);

	async function envoyerFormulaire(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);
		const form: HTMLFormElement = event.currentTarget;
		const data = new FormData(form);
		const demandeDeContactAccompagnement = mapDemandeDeContactAccompagnement(data, contactÉtablissementAccompagnement);
		const result = await établissementAccompagnementService.envoyerDemandeContact(demandeDeContactAccompagnement);
		setIsLoading(false);
		if (isSuccess(result)) {
			onSuccess();
		} else {
			onFailure();
		}
	}

	return (
		<form
			className={styles.formulaire}
			onSubmit={envoyerFormulaire}>
			<Champ>
				<Champ.Label>
					Prénom
					<Champ.Label.Complement>Exemple : Jean</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					name="firstname"
					required />
				<Champ.Error />
			</Champ>

			<Champ>
				<Champ.Label>
					Nom
					<Champ.Label.Complement>Exemple : Dupont</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					name="lastname"
					required />
				<Champ.Error />
			</Champ>

			<Champ>
				<Champ.Label>
					Adresse e-mail (facultatif)
					<Champ.Label.Complement>Exemple : jean.dupont@gmail.com</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					pattern={emailRegex}
					name="mail"
					type="email" />
				<Champ.Error />
			</Champ>

			<Champ>
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

			<Champ>
				<Champ.Label>Age<Champ.Label.Complement>Exemple : 16 ans</Champ.Label.Complement></Champ.Label>
				<Champ.Input
					render={SelectSimple}
					required
					optionsAriaLabel={'années'}
					name="age">
					{ageOptions.map((option) =>
						<SelectSimple.Option key={option.libellé} value={option.valeur}>{option.libellé}</SelectSimple.Option>,
					)}
				</Champ.Input>
				<Champ.Error />
			</Champ>

			<ComboboxCommune required />
			<Champ className={styles.commentaireDemandeDeContact}>
				<Champ.Label>Commentaires ou autres informations utiles (facultatif)</Champ.Label>
				<Champ.Input render={TextArea} name="commentaire" rows={5} />
				<Champ.Error />
			</Champ>

			{isLoading
				? <LoadingButton className={styles.formulaireValidateButton} />
				: (
					<>
						<ButtonComponent
							type="submit"
							className={styles.formulaireValidateButton}
							label={<>Envoyer mes informations <span className={styles.desktopOnly}>afin d‘être rappelé(e)</span></>} />
					</>
				)
			}
			<div className={styles.formulaireDécharge}>
				<p>
					Vous êtes informé que vos données à caractère personnel sont collectées et traitées par la DGEFP pour répondre
					à votre demande. Pour en savoir plus vous pouvez consulter la <Link href="/confidentialite">politique de
					confidentialité</Link> et les <Link href="/cgu">CGU</Link> de la DGEFP. En cliquant sur “Envoyer mes
					informations“ vos données seront transmises à la mission locale de la zone géographique dans laquelle vous
					résidez pour que celle-ci prenne contact avec vous.
				</p>
			</div>
		</form>
	);

}

function mapDemandeDeContactAccompagnement(formData: FormData, contactÉtablissementAccompagnement: ContactEtablissementAccompagnement): DemandeDeContactAccompagnement {
	return {
		age: Number(formData.get('age')) as Age,
		commentaire: String(formData.get('commentaire')),
		// TODO (BRUJ 16/07/2024): devrait être traité côté serveur
		commune: String(`${formData.get('ville')} (${formData.get('codePostal')})`),
		email: String(formData.get('mail')),
		nom: String(formData.get('lastname')),
		prénom: String(formData.get('firstname')),
		téléphone: String(formData.get('phone')),
		établissement: contactÉtablissementAccompagnement,
	};
}
