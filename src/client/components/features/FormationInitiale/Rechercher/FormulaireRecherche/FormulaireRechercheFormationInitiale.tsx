import { useRouter } from 'next/router';
import React, { FormEvent } from 'react';

import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { Input } from '~/client/components/ui/Form/Input';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { useFormationInitialeQuery } from '~/client/hooks/useFormationInitialeQuery';
import { getFormAsQuery } from '~/client/utils/form.util';

import styles from './FormulaireRechercheFormationInitiale.module.scss';

export function FormulaireRechercheFormationInitiale() {
	const queryParams = useFormationInitialeQuery();
	const router = useRouter();

	async function submitForm(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQuery(event.currentTarget, queryParams);
		return router.push({ query }, undefined, { shallow: true });
	}


	return (
		<form
			className={styles.RechercheFormationInitialeForm}
			role="search"
			onSubmit={submitForm}>
			<Champ>
				<Champ.Label>Domaine, mot-clé…
					<Champ.Label.Complement>Exemples: boulanger, informatique</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={Input}
					key={queryParams.motCle || ''}
					defaultValue={queryParams.motCle || ''}
					name="motCle"
					autoFocus />
				<Champ.Error />
			</Champ>

			<div className={styles.buttonWrapper}>
				<ButtonComponent
					label="Rechercher"
					icon={<Icon name="magnifying-glass" />}
					iconPosition="right"
					type="submit" />
			</div>
		</form>
	);
}
