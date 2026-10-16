import React from 'react';

import { FormulairesProps } from '~/client/components/features/ContratEngagementJeune/Accompagnement/Accompagnement';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Icon } from '~/client/components/ui/Icon/Icon';

import styles from './AccompagnementFormulaireCommon.module.scss';

type PasDAccompagnementProps = Pick<FormulairesProps, 'setTypeFormulaireAffiché' | 'setIsMissionLocaleModalOpen' | 'onBackButton'>

export default function PasDAccompagnement({ setTypeFormulaireAffiché, setIsMissionLocaleModalOpen, onBackButton }: PasDAccompagnementProps) {

	return (
		<>
			<ButtonComponent
				appearance={'quaternary'}
				className={styles.boutonRetour}
				onClick={onBackButton}
				label="Retour"
				icon={<Icon name={'angle-left'} />}
				iconPosition={'left'} />
			<p className={styles.question}>Quel âge avez-vous ?</p>
			<div>
				<span>Sélectionnez l‘option qui vous correspond :</span>
				<button className={styles.optionBouton} onClick={() => setIsMissionLocaleModalOpen(true)}>Moins de 18 ans</button>
				<button className={styles.optionBouton} onClick={() => setTypeFormulaireAffiché('BesoinAide')}>Entre 18 et 25
				ans
				</button>
				<button className={styles.optionBouton} onClick={() => setTypeFormulaireAffiché('BesoinAide26ans')}>Plus de 25
				ans
				</button>
			</div>
		</>
	);
}
