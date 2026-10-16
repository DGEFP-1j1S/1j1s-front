import React, { useState } from 'react';

import {
	FormulaireDemandeDeContactAccompagnement,
} from '~/client/components/features/Accompagnement/DemandeDeContact/Formulaire/FormulaireDemandeDeContactAccompagnement';
import styles
	from '~/client/components/features/Accompagnement/DemandeDeContact/ModalDemandeDeContactAccompagnement.module.scss';
import { ModalErrorSubmission } from '~/client/components/ui/Form/ModaleErrorSubmission/ModalErrorSubmission';
import { ModaleSuccessSubmission } from '~/client/components/ui/Form/ModaleSuccessSubmission/ModaleSuccessSubmission';
import { ModalComponent } from '~/client/components/ui/Modal/ModalComponent';
import {
	ContactEtablissementAccompagnement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

interface ModalDemandeDeContactAccompagnementProps {
	contactÉtablissementAccompagnement: ContactEtablissementAccompagnement
	isOpen: boolean
	setIsOpen: (value: boolean) => void
}

type formulaireStatus = 'notSubmitted' | 'error' | 'success'

export function ModalDemandeDeContactAccompagnement({ contactÉtablissementAccompagnement, isOpen, setIsOpen }: ModalDemandeDeContactAccompagnementProps) {
	const [statusForm, setStatusForm] = useState<formulaireStatus>('notSubmitted');

	return (
		<>
			<ModalComponent
				isOpen={isOpen}
				close={() => setIsOpen(false)}
				aria-labelledby={'dialog_label'}>
				<ModalComponent.Title className={styles.modalTitle} id="dialog_label">
						Je souhaite être contacté(e) par la Mission Locale
				</ModalComponent.Title>
				<ModalComponent.Content>
					<small className={styles.modalSubTitle}>Tous les champs sont obligatoires sauf mention contraire</small>
					<FormulaireDemandeDeContactAccompagnement
						contactÉtablissementAccompagnement={contactÉtablissementAccompagnement}
						onSuccess={() => {
							setIsOpen(false);
							setStatusForm('success');
						}}
						onFailure={() => {
							setIsOpen(false);
							setStatusForm('error');
						}} />
				</ModalComponent.Content>
			</ModalComponent>

			<ModaleSuccessSubmission isOpen={statusForm === 'success'}
				onClose={() => {
					setIsOpen(false);
					setStatusForm('notSubmitted');
				}} />

			<ModalErrorSubmission isOpen={statusForm === 'error'} 
				onClose={() => {
					setStatusForm('notSubmitted');
				}}
				onBackToForm={() => {
					setIsOpen(true);
					setStatusForm('notSubmitted');
				}} />
		</>

	);
}
