import React from 'react';

import { FormulairesProps } from '~/client/components/features/ContratEngagementJeune/Accompagnement/Accompagnement';

import styles from './AccompagnementFormulaireCommon.module.scss';

type DemarrageProps = Pick<FormulairesProps, 'setTypeFormulaireAffiché' | 'setIsFranceTravailModalOpen' | 'setIsMissionLocaleModalOpen'>
export default function Démarrage({ setTypeFormulaireAffiché, setIsFranceTravailModalOpen, setIsMissionLocaleModalOpen }: DemarrageProps) {

	return (
		<>
			<p className={styles.question}>Bénéficiez-vous actuellement d‘un accompagnement ?</p>
			<div>
				<span>Sélectionnez l‘option qui vous correspond :</span>
				<button className={styles.optionBouton} onClick={() => setIsMissionLocaleModalOpen(true)}>
				Oui, je suis accompagné(e) par la Mission Locale
				</button>
				<button className={styles.optionBouton} onClick={() => setIsFranceTravailModalOpen(true)}>
				Oui, je suis accompagné(e) par France Travail
				</button>
				<button className={styles.optionBouton} onClick={() => setTypeFormulaireAffiché('PasDAccompagnement')}>
				Non, je ne bénéficie d‘aucun accompagnement
				</button>
			</div>
		</>
	);
}
