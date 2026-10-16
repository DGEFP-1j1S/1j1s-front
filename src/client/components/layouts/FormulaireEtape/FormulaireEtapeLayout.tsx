import React from 'react';

import { Container } from '~/client/components/layouts/Container/Container';
import { Link } from '~/client/components/ui/Link/Link';

import styles from './FormulaireEtapeLayout.module.scss';

interface FormulaireEtapeLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
	étape: string
	urlÉtapePrécédente?: string
}

export function FormulaireÉtapeLayout(props: FormulaireEtapeLayoutProps) {
	const { étape, urlÉtapePrécédente, children } = props;
	return (
		<Container className={styles.container}>
			<ÉtapeFormulaire étape={étape} />
			{ urlÉtapePrécédente && (
				<Link
					href={urlÉtapePrécédente}
					appearance="asSecondaryButton"
					className={styles.boutonRetour}>
					<Link.Icon name="angle-left" />
        Retour à l’étape précédente
				</Link>
			)}
			{ children }
		</Container>
	);
}


const ÉtapeFormulaire = (props: {étape: string}) => <div className={styles.étape}>{props.étape}</div>;
