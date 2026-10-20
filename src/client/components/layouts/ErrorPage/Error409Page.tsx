import React from 'react';

import { Head } from '../../head/Head';
import { ErrorLayout } from '../Error/ErrorLayout';

export default function Error409Page() {
	return (
		<>
			<Head
				title="Conflit d'identifiant | 1jeune1solution"
				robots="noindex" />
			<main id="contenu">
				<ErrorLayout
					title="Erreur - Requête en conflit"
					errorCode="409"
					subTitle="La demande ne peut pas être traitée car elle est en conflit avec une autre demande."
					content="Si le problème persiste, merci de nous contacter pour obtenir de l’aide.">
				</ErrorLayout>
			</main>
		</>
	);
}
