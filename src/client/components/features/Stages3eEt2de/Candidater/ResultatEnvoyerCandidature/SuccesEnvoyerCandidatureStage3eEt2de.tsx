import { useRouter } from 'next/router';

import { BackButton } from '~/client/components/features/ButtonRetour/BackButton';
import { Container } from '~/client/components/layouts/Container/Container';
import { Link } from '~/client/components/ui/Link/Link';
import { getSingleQueryParam } from '~/client/utils/queryParams.utils';
import { ModeDeContact } from '~/server/stage-3e-et-2de/domain/candidatureStage3eEt2de';

import styles from './ResultatEnvoyerCandidatureStage3eEt2de.module.scss';

const INSTRUCTION_CANDIDATURE_TELEPHONE = (
	<p className={styles.texte}>
	L’entreprise a choisi d’être contactée par télephone. Elle recevra donc vos informations et vous recontactera par la suite.
	</p>
);

const INSTRUCTION_CANDIDATURE_EN_PERSONNE = (
	<p className={styles.texte}>
	L’entreprise a choisi que vous vous présentiez directement pour candidater. Elle recevra donc vos informations et vous recontactera par la suite.
	</p>
);

export function SuccesEnvoyerCandidatureStage3eEt2de() {
	const router = useRouter();
	const modeDeContact = getSingleQueryParam(router.query.modeDeContact);

	return (
		<Container className={styles.container}>
			<h1 className={styles.titre}>Félicitations, vos informations ont bien été envoyées</h1>
			{modeDeContact === ModeDeContact.PHONE ? INSTRUCTION_CANDIDATURE_TELEPHONE : INSTRUCTION_CANDIDATURE_EN_PERSONNE}
			<div className={styles.boutonsCTA}>
				<BackButton
					label="Continuer la recherche"
					aria-label="Continuer la recherche"
					icon={undefined}
					className={styles.boutonContinuerRecherche}
					appearance="primary" />
				<Link
					href={'/'}
					appearance="asSecondaryButton"
					className={styles.boutonRetourAccueil}>
				Retour à l’accueil
				</Link>
			</div>
		</Container>
	);
}
