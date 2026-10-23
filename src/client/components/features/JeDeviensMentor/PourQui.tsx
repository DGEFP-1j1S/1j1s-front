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
				<h2 className="fr-h3">
					Qu‘est-ce que le mentorat ?
				</h2>
				<p>
					Le mentorat, c’est l’accompagnement individuel bénévole d’un jeune par un mentor, qui peut aussi bien être
					lycéen qu’étudiant, actif ou retraité. Le « binôme » que forment le mentor et le jeune se rencontre plusieurs
					fois par mois (pendant au moins 6 mois) pour répondre aux objectifs du mentoré selon son âge et ses besoins.
					Le binôme est encadré par une structure, le plus souvent une association, qui offre un cadre sécurisé pour
					chacun.
				</p>
			</section>
			<div className="fr-grid-row fr-grid-row--center fr-pb-4w">
				<Link className="fr-btn fr-btn--lg fr-mr-2w"
							href="https://www.1jeune1mentor.fr/formulaire-mentor?1jeune1solution">Devenir
					mentor</Link>
				<Link className="fr-btn fr-btn--lg fr-btn--secondary" href="/les-entreprises-s-engagent">Engager mon
					entreprise</Link>
			</div>
		</>
	);
}
