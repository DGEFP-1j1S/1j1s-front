import React from 'react';

import { FormulairesProps } from '~/client/components/features/ContratEngagementJeune/Accompagnement/Accompagnement';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Icon } from '~/client/components/ui/Icon/Icon';

import styles from './AccompagnementFormulaireCommon.module.scss';

type HandicapProps = Pick<FormulairesProps, 'setTypeFormulaireAffiché' | 'setIsInscriptionFranceTravailModalOpen' | 'onBackButton'>
export default function Handicap({ setTypeFormulaireAffiché, setIsInscriptionFranceTravailModalOpen, onBackButton }: HandicapProps) {
	return (
		<>
			<ButtonComponent
				appearance={'quaternary'}
				className={styles.boutonRetour}
				onClick={onBackButton}
				label="Retour"
				icon={<Icon name={'angle-left'} />}
				iconPosition={'left'} />
			<p className={styles.question}>Êtes-vous en situation de handicap (RQTH) ?</p>
			<div>
				<button className={styles.optionBouton} onClick={() => setTypeFormulaireAffiché('AutresBesoins26ans')}>Oui
				</button>
				<button className={styles.optionBouton} onClick={() => setIsInscriptionFranceTravailModalOpen(true)}>Non</button>
			</div>
		</>
	);
}
