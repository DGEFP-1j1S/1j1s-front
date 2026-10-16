import { BackButton } from '~/client/components/features/ButtonRetour/BackButton';
import { EtatSoumission } from '~/client/components/features/Stages3eEt2de/Candidater/CandidaterStage3eEt2de';
import { Container } from '~/client/components/layouts/Container/Container';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';

import styles from './ResultatEnvoyerCandidatureStage3eEt2de.module.scss';

const DESCRIPTION_ERREUR_CONFLIT_D_IDENTIFIANT = <p className={styles.texte}>Une candidature pour cette offre avec cette adresse email existe déjà.</p>;
const DESCRIPTION_ERREUR_AUTRE = <p className={styles.texte}>Nous n’avons pas pu envoyer vos informations à l’entreprise. Veuillez réessayer plus tard</p>;

export function EchecEnvoyerCandidatureStage3eEt2de(props: {
	etatSoumission: EtatSoumission,
	retourFormulaire: () => void,
}) {
	return (
		<Container className={styles.container}>
			<h1 className={styles.titre}>Une erreur est survenue</h1>
			{props.etatSoumission === ErreurMetier.CONFLIT_D_IDENTIFIANT ? DESCRIPTION_ERREUR_CONFLIT_D_IDENTIFIANT : DESCRIPTION_ERREUR_AUTRE}
			<div className={styles.boutonsCTA}>
				<ButtonComponent
					appearance="primary"
					label="Retour au formulaire"
					onClick={props.retourFormulaire}
					className={styles.boutonRetourFormulaire} />
				<BackButton
					label="Retour à la recherche"
					aria-label="Retour à la recherche"
					icon={undefined}
					className={styles.boutonRetourRecherche}
					appearance="secondary" />
			</div>
		</Container>
	);
}
