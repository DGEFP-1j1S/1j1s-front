import React from 'react';

import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Link } from '~/client/components/ui/Link/Link';

import { ModalComponent } from '../../Modal/ModalComponent';
import styles from './ModalErrorSubmission.module.scss';

interface ModaleErrorSubmissionProps {
	isOpen: boolean
	onClose: () => void
	onBackToForm: () => void
	description?: React.ReactElement | string
}

export function ModalErrorSubmission({ isOpen, onClose, description, onBackToForm }: ModaleErrorSubmissionProps) {
	return (
		<ModalComponent isOpen={isOpen} close={onClose} aria-labelledby={'error_title'}>
			<ModalComponent.Content className={styles.content}>
				<ModalComponent.Title className={styles.title} id={'error_title'}>
				Une erreur est survenue lors de l‘envoi du formulaire
				</ModalComponent.Title>
				{
					description && (
						<div className={styles.description}>
							{description}
						</div>
					)
				}
				<span className={styles.redirections}>
					<ButtonComponent appearance={'primary'} onClick={onBackToForm} label={'Retour au formulaire'} />
					<Link appearance={'asSecondaryButton'} href="/">
					Aller à l‘accueil
						<Link.Icon />
					</Link>
				</span>
			</ModalComponent.Content>
		</ModalComponent>
	);
}

