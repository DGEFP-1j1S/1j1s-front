import React from 'react';

import { Head } from '../../head/Head';
import { ErrorLayout } from '../Error/ErrorLayout';

export default function Error400Page() {
	return (
		<>
			<Head
				title="Demande incorrecte | 1jeune1solution"
				robots="noindex" />
			<main id="contenu">
				<ErrorLayout>
					<ErrorLayout.Title titleAs="h1">Erreur - Demande Incorrecte</ErrorLayout.Title>
					<ErrorLayout.SubTitle>
						Votre navigateur a envoyé une demande que ce serveur n’a pas pu comprendre.
					</ErrorLayout.SubTitle>
					<ErrorLayout.Content>
						Si le problème persiste, merci de nous contacter pour obtenir de l’aide.
					</ErrorLayout.Content>
				</ErrorLayout>
			</main>
		</>
	);
}
