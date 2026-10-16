import React, { FormEvent } from 'react';

import { FormulairesProps } from '~/client/components/features/ContratEngagementJeune/Accompagnement/Accompagnement';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Checkbox } from '~/client/components/ui/Checkbox/Checkbox';
import { Icon } from '~/client/components/ui/Icon/Icon';

import styles from './AccompagnementFormulaireCommon.module.scss';


const NAME_CHECKBOX = 'besoin';
type AutresBesoins = Pick<FormulairesProps, 'setIsMissionLocaleModalOpen' | 'setIsInscriptionFranceTravailModalOpen' | 'onBackButton'>
export default function AutresBesoins26ans(
	{
		onBackButton,
		setIsMissionLocaleModalOpen,
		setIsInscriptionFranceTravailModalOpen,
	}: AutresBesoins) {

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const isMoreThanOneCheckboxSelected = formData.getAll(NAME_CHECKBOX).length > 0;
		if (isMoreThanOneCheckboxSelected) {
			setIsMissionLocaleModalOpen(true);
		} else {
			setIsInscriptionFranceTravailModalOpen(true);
		}
	}

	return (
		<>
			<ButtonComponent
				appearance={'quaternary'}
				className={styles.boutonRetour}
				onClick={onBackButton}
				label="Retour"
				icon={<Icon name={'angle-left'} />}
				iconPosition={'left'} />
			<form onSubmit={onSubmit} className={styles.autresBesoins}>
				<fieldset>
					<legend className={styles.question}>Rencontrez-vous d’autres besoins ?</legend>
					<div className={styles.autresBesoinsReponsesWrapper}>
						<Checkbox
							name={NAME_CHECKBOX}
							label="Logement" />
						<Checkbox
							name={NAME_CHECKBOX}
							label="Santé" />
						<Checkbox
							name={NAME_CHECKBOX}
							label="Difficultés administratives ou juridiques" />
						<Checkbox
							name={NAME_CHECKBOX}
							label="Problématique d‘accès aux droits" />
						<Checkbox
							name={NAME_CHECKBOX}
							label="Maîtrise de français" />
						<Checkbox
							name={NAME_CHECKBOX}
							label="Contraintes familiales" />
					</div>
				</fieldset>
				<ButtonComponent label="Valider" />
			</form>
		</>
	);
}
