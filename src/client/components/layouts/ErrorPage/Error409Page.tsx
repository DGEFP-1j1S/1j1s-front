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
				<ErrorLayout>
					<ErrorLayout.Title titleAs="h1">Erreur - Requête en conflit</ErrorLayout.Title>
					<ErrorLayout.SubTitle>
						La demande ne peut pas être traitée car elle est en conflit avec une autre demande.
					</ErrorLayout.SubTitle>
					<ErrorLayout.Content>
						Si le problème persiste, merci de nous contacter pour obtenir de l’aide.
					</ErrorLayout.Content>
				</ErrorLayout>
			</main>
		</>
	);
}
