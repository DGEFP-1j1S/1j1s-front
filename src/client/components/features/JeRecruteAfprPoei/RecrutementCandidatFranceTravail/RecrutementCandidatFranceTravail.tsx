import React from 'react';

import { Footnote } from '~/client/components/ui/Footnote/Footnote';
import { Link } from '~/client/components/ui/Link/Link';

export default function RecrutementCandidatFranceTravail() {
	return (
		<section className="fr-container">
			<div className="fr-grid-row fr-grid-row-gutters align-items--center">
				<div className="fr-col-lg-8 fr-col-12">
					<h1>
						Je m’engage à recruter des candidats formés avec l’aide de France Travail
						(POE, AFPR)
						<Footnote.Reference to={'abreviation-reference'} id={'abreviation'}/>
					</h1>
				</div>
			</div>
			<p className="fr-text--lead">
				Formez un candidat à vos besoins. Bénéficiez d’une aide au financement de la formation, anticipez vos
				besoins en recrutement sur vos métiers en tension et améliorez l’intégration des jeunes en entreprise
			</p>
			<Footnote htmlFor={'abreviation'} id={'abreviation-reference'}>POE : Préparation
				Opérationnelle à l’Emploi ; AFPR : Action de Formation Préalable au Recrutement
			</Footnote>
			<div className="fr-grid-row fr-grid-row--center fr-pb-4w">
				<ul className="fr-btns-group fr-btns-group--inline">
					<li>
						<Link className="fr-btn fr-btn--lg fr-mr-2w"
									href="https://entreprise.francetravail.fr/accueil/description/afpr">M‘engager à recruter
						</Link>
					</li>
					<li>
						<Link className="fr-btn fr-btn--lg fr-btn--secondary"
									href="https://entreprise.francetravail.fr/accueil/choixauthentification?goto=https://entreprise.francetravail.fr/accueil/description/afpr">Compléter
							une demande
						</Link>
					</li>
				</ul>
			</div>
		</section>
	);
}
