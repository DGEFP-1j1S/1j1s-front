import React from 'react';

import { Banner } from "~/client/components/ui/Hero/Hero";
import { Link } from '~/client/components/ui/Link/Link';

export function PourQui() {
	return (
		<>
			<Banner>
				<h1>1 jeune 1 mentor, accompagner un jeune pour l‘aider à réussir</h1>
				<p className="fr-text--lead">
					Faites la rencontre qui change tout !
				</p>
			</Banner>

			<section className="fr-container">
				<h2 className="fr-h3">
					Vous êtes employeur ou citoyen et souhaitez devenir mentor ?
				</h2>
				<p>
					Embarquer dans une aventure humaine hors du commun, pour partager votre expérience, favoriser l‘égalité des
					chances et continuer à apprendre en accompagnant un jeune.
				</p>
				<h2 className="fr-h3">
					Votre entreprise recrute ou porte une initiative pour les jeunes ? Rejoignez la mobilisation !
				</h2>
				<p>
					Permettez à votre entreprise d’apporter des solutions pour les jeunes, rejoignez des milliers d’entreprises
					déjà engagées et bénéficiez de services inédits.
				</p>
				<div className="fr-pb-4w">
					<ul className="fr-btns-group fr-btns-group--inline fr-btns-group--equisized">
						<li>
							<Link className="fr-btn fr-btn--lg fr-mr-2w"
										href="https://www.1jeune1mentor.fr/formulaire-mentor?1jeune1solution">Devenir
								mentor</Link>
						</li>
						<li>
							<Link className="fr-btn fr-btn--lg fr-btn--secondary" href="/les-entreprises-s-engagent">Engager mon
								entreprise</Link>
						</li>
					</ul>
				</div>
			</section>
		</>
	);
}
