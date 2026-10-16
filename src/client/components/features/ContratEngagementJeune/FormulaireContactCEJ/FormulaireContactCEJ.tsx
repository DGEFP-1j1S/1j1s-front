import React, { FormEvent, useState } from 'react';

import {
	DéchargeRGPD,
} from '~/client/components/features/ContratEngagementJeune/FormulaireContactCEJ/DechargeRGPD/DéchargeRGPD';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { LoadingButton } from '~/client/components/ui/Button/LoadingButton';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ComboboxCommune } from '~/client/components/ui/Form/Combobox/ComboboxCommune/ComboboxCommune';
import { Input } from '~/client/components/ui/Form/Input';
import { SelectSimple } from '~/client/components/ui/Form/Select/SelectSimple';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { ageOptions } from '~/client/domain/selectAgeData';
import { DemandeDeContactService } from '~/client/services/demandeDeContact/demandeDeContact.service';
import { isSuccess } from '~/server/errors/either';
import { emailRegex } from '~/shared/emailRegex';
import { telFrRegex } from '~/shared/telRegex';

import styles from './FormulaireContactCEJ.module.scss';

interface FormulaireDeContactCEJProps {
	onSuccess: () => void;
	onFailure: () => void;
}

export function FormulaireDeContactCEJ({ onSuccess, onFailure }: FormulaireDeContactCEJProps) {
	const [isLoading, setIsLoading] = useState(false);
	const demandeDeContactService = useDependency<DemandeDeContactService>('demandeDeContactService');

	async function envoyerFormulaireDeContact(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form: HTMLFormElement = event.currentTarget;
		const data = new FormData(form);
		setIsLoading(true);
		const response = await demandeDeContactService.envoyerPourLeCEJ({
			age: Number(data.get('age')),
			codePostal: String(data.get('codePostal')),
			email: String(data.get('mail')),
			nom: String(data.get('lastname')),
			prénom: String(data.get('firstname')),
			téléphone: String(data.get('phone')),
			ville: String(data.get('ville')),
		});
		setIsLoading(false);
		if (isSuccess(response)) {
			onSuccess();
		} else {
			onFailure();
		}
	}

	return (
		<form
			className={styles.formulaire}
			onSubmit={envoyerFormulaireDeContact}
			aria-label="formulaire cej">
			<Champ>
				<Champ.Label>
					Prénom
					<Champ.Label.Complement>Exemple : Jean</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input name="firstname" render={Input} required autoComplete="given-name" />
				<Champ.Error />
			</Champ>

			<Champ>
				<Champ.Label>
					Nom
					<Champ.Label.Complement>Exemple : Dupont</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input name="lastname" render={Input} required autoComplete="family-name" />
				<Champ.Error />
			</Champ>

			<Champ>
				<Champ.Label>
					Adresse e-mail
					<Champ.Label.Complement>Exemple : jean.dupont@gmail.com</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input name="mail" render={Input} required pattern={emailRegex} type="email" autoComplete="email" />
				<Champ.Error />
			</Champ>

			<Champ>
				<Champ.Label>
					Téléphone
					<Champ.Label.Complement>Exemple : 0606060606</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input name="phone" render={Input} required pattern={telFrRegex} type="tel" autoComplete="tel-national" />
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

			<ComboboxCommune
				required
				label="Ville"
				name="commune" />

			{isLoading
				? <LoadingButton className={styles.formulaireButton} />
				: <ButtonComponent className={styles.formulaireButton} label="Envoyer la demande" type="submit" />
			}

			<div className={styles.formulaireDécharge}>
				<DéchargeRGPD />
			</div>
		</form>
	);
}
