import React from 'react';

import { Head } from '../../head/Head';
import { ErrorLayout } from '../Error/ErrorLayout';

export default function Error429Page() {
	return (
		<>
			<Head
				title="Trop de requêtes | 1jeune1solution"
				robots="noindex" />
			<main id="contenu">
				<ErrorLayout
					title="Trop de requêtes"
					errorCode="429"
					subTitle="Vous avez effectué trop de requêtes en peu de temps. Veuillez réessayer ultérieurement."
					content="Si le problème persiste, merci de nous contacter pour obtenir de l’aide.">
				</ErrorLayout>
			</main>
		</>
	);
}
