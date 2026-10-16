import React from 'react';

import { Head } from '../../head/Head';
import { ErrorLayout } from '../Error/ErrorLayout';

export default function Error404Page() {
	return (
		<>
			<Head
				title="Page indisponible | 1jeune1solution"
				robots="noindex" />
			<main id="contenu">
				<ErrorLayout>
					<ErrorLayout.Title titleAs="h1">Page non trouvée</ErrorLayout.Title>
					<ErrorLayout.SubTitle>
						La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.
					</ErrorLayout.SubTitle>
					<ErrorLayout.Content>
						Si vous avez tapé l’adresse web dans le navigateur, vérifiez qu’elle est correcte. La page n’est peut-être
						plus
						disponible. Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d’accueil.
					</ErrorLayout.Content>
				</ErrorLayout>
			</main>
		</>
	);
}
