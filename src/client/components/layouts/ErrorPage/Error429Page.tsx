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
				<ErrorLayout>
					<ErrorLayout.Title titleAs="h1">Trop de requêtes</ErrorLayout.Title>
					<ErrorLayout.SubTitle>
						Vous avez effectué trop de requêtes en peu de temps. Veuillez réessayer ultérieurement.
					</ErrorLayout.SubTitle>
					<ErrorLayout.Content>
						Si le problème persiste, merci de nous contacter pour obtenir de l’aide.
					</ErrorLayout.Content>
				</ErrorLayout>
			</main>
		</>
	);
}
