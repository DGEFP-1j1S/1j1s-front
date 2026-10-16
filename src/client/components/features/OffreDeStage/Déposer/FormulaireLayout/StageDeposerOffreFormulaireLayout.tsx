import React, {
	FormEvent,
	RefObject,
} from 'react';

import styles from './StageDeposerOffreFormulaireLayout.module.scss';

interface StageDeposerOffreFormulaireLayoutProps extends React.ComponentPropsWithoutRef<'form'>{
	inputsObligatoires: React.ReactElement
	inputsFacultatifs: React.ReactElement
	formRef: RefObject<HTMLFormElement>
	handleFormSubmit: (event: FormEvent<HTMLFormElement>) => Promise<boolean | undefined>
	boutonValidation: React.ReactElement
}
export function StageDeposerOffreFormulaireLayout({ inputsObligatoires, inputsFacultatifs, formRef, handleFormSubmit, boutonValidation, ...rest }: StageDeposerOffreFormulaireLayoutProps) {
	return (
		<form
			className={styles.formulaire}
			ref={formRef}
			onSubmit={handleFormSubmit}
			{...rest}>
			<p className={styles.informationChamp}>
				Les champs suivants sont obligatoires
			</p>
			<div className={styles.champsFormulaire}>
				{inputsObligatoires}
			</div>
			<p className={styles.informationChamp}>
				Les champs suivants sont facultatifs mais recommandés
			</p>
			<div className={styles.champsFormulaire}>
				{inputsFacultatifs}
			</div>
			<div className={styles.validation}>
				{boutonValidation}
			</div>
		</form>
	);
}
