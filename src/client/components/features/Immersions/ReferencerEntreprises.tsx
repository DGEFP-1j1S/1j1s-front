import React from 'react';

import { Link } from '~/client/components/ui/Link/Link';

export function RéférencerEntreprises() {
	return (
		<>
			<div className="fr-container">
				<div className="fr-grid-row fr-grid-row-gutters align-items--center">
					<div className="fr-col-lg-7 fr-col-12">
						<h1>
							Je référence mon entreprise afin de proposer des immersions</h1>
						<p className="fr-text--lead fr-mb-2w">Proposer une immersion c’est permettre à des jeunes :</p>
					</div>
				</div>
				<ul>
					<li>De découvrir un métier</li>
					<li>De les aider à confirmer un projet professionnel en situation réelle de travail</li>
					<li>D’initier un parcours d’embauche pour leur permettre d’accéder à un emploi ou dans le cadre d’une
						reconversion
					</li>
				</ul>
				<Link
					className="fr-btn fr-btn--lg fr-mt-2w"
					href="/immersions/referencer-mon-entreprise">
					Référencer mon entreprise
				</Link>
			</div>
		</>
	);
}
