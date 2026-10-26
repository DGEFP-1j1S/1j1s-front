import React from 'react';

import { Head } from '~/client/components/head/Head';
import { Banner } from '~/client/components/ui/Hero/Hero';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/immersions/referencer-mon-entreprise/index.analytics';

const POLITIQUE_DE_CONFIDENTIALITÉ_URL = 'https://immersion-facile-1.gitbook.io/mentions-legales/politique-de-confidentialite';
const CONDITIONS_GÉNÉRALES_UTILISATION_URL = 'https://immersion-facile-1.gitbook.io/mentions-legales/conditions-generales-dutilisation';

export default function ImmersionReferenceMonEntreprisePage() {
	useAnalytics(analytics);

	return (
		<main id="contenu">
			<Head
				title="je référence mon entreprise pour des immersions | 1jeune1solution"
				robots="index,follow"/>
			<Banner>
				<h1 className="fr-h1">
					Je référence mon entreprise afin de proposer des immersions
				</h1>
				<p className="fr-text--lead fr-mb-0"> Ce formulaire vous permet d‘indiquer les métiers de votre établissement
					ouverts aux immersions. Si votre
					entreprise comprend plusieurs établissements, il convient de renseigner un formulaire pour chaque
					établissement (SIRET différent).</p>
			</Banner>
			<div className="fr-container">
				<iframe
					className="iframe"
					src="https://immersion-facile.beta.gouv.fr/accueil-beneficiaires"
					title="Formulaire recueil des entreprises volontaires pour l‘accueil des immersions professionnelles"/>
				<p className="background--blue-light fr-p-2w fr-my-6w">
					Vous êtes informé que vos données sont collectées et traitées par le Groupement d‘intérêt public de
					plateforme de l‘inclusion pour traiter votre demande de référencement de votre entreprise. Pour en savoir plus
					sur vos droits consultez la <a href={POLITIQUE_DE_CONFIDENTIALITÉ_URL}>Politique de Confidentialité</a> du
					Groupement d‘intérêt public de plateforme de l‘inclusion. En cliquant sur «&nbsp;confirmer&nbsp;» vous
					reconnaissez avoir pris connaissance et accepter les <a href={CONDITIONS_GÉNÉRALES_UTILISATION_URL}>Conditions
					Générales d‘Utilisation</a> du Groupement d‘intérêt public de plateforme de l‘inclusion.
				</p>
			</div>
		</main>
	);
}
