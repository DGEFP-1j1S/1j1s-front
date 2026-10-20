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
				<ErrorLayout
					title="Erreur - Demande Incorrecte"
					errorCode="400"
					subTitle="Votre navigateur a envoyé une demande que ce serveur n’a pas pu comprendre."
					content="Si le problème persiste, merci de nous contacter pour obtenir de l’aide.">
				</ErrorLayout>
			</main>
		</>
	);
}
