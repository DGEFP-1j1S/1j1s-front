import React from 'react';

import { ErrorLayout } from './ErrorLayout';

export default function ErrorUnavailableService() {
	return (
		<ErrorLayout
			title="Service Indisponible"
			errorCode="503"
			subTitle="Désolé, le service est temporairement inaccessible, la page demandée ne peut pas être affichée."
			content="Merci de réessayer plus tard, vous serez bientôt en mesure de réutiliser le service. Si vous avez besoin d’une
					aide immédiate, merci de nous contacter.">
		</ErrorLayout>
	);
}
