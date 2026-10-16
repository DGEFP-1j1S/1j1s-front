import React from 'react';

import { Container } from '~/client/components/layouts/Container/Container';
import { Link } from '~/client/components/ui/Link/Link';
import { URL_DEPOSER_OFFRE } from '~/pages/stages/deposer-offre/index.page';

import styles from './StageDeposerOffreFormulaireEnvoye.module.scss';

export default function StageDeposerOffreFormulaireEnvoye() {
	return (
		<Container className={styles.container}>
			<div className={styles.texteValidation}>Cette offre est soumise à une validation avant sa mise en ligne.
			</div>
			<div className={styles.boutonsConfirmationEnvoi}>
				<Link
					href={URL_DEPOSER_OFFRE}
					appearance={'asPrimaryButton'}>
					Déposer une offre de stage
				</Link>
				<Link
					href={'/'}
					appearance={'asSecondaryButton'}>
					Retourner à l’accueil
				</Link>
			</div>
		</Container>
	);
}
