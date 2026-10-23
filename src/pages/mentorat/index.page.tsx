import React from 'react';

import { Head } from '~/client/components/head/Head';
import { Banner } from '~/client/components/ui/Hero/Hero';
import { Image } from '~/client/components/ui/Img';
import { Link } from '~/client/components/ui/Link/Link';
import { Carte } from '~/client/dsfr';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/mentorat/index.analytics';

export default function MentoratPage() {
	useAnalytics(analytics);

	const raisonsParticipation = [
	{
		description: "Votre mentor pourra vous aider à organiser votre travail et à améliorer vos résultats scolaires",
		titre: "J'ai des difficultés à l'école",
	},
	{
		description: "Votre mentor pourra vous conseiller et vous guider",
		titre: "Je ne sais pas quelle orientation choisir",
	},
	{
		description: "Votre mentor pourra vous aider et vous ouvrir son réseau professionnel",
		titre: "Je cherche un stage, une alternance, un premier emploi",
	},
];

	return (
		<>
			<Head
				title="Mentorat | 1jeune1solution"
				description="Se rendre utile tout en préparant son avenir grâce aux missions de service civique"
				robots="index,follow" />
			<main id="contenu">
				<Banner>
					<h1 className="fr-h1">
						1 jeune 1 mentor, être accompagné par un mentor pour réussir
					</h1>
					<p className="fr-text--lead fr-mb-0">Faites la rencontre qui change tout !</p>
				</Banner>

				<div className="fr-container fr-mb-5w">
					<div className="fr-grid-row fr-grid-row--gutters">
						<div className="fr-col-12 fr-col-md-6">
							<Carte
								titreAs="h2"
								className="height--full"
								titre="Vous avez moins de 30 ans ?"
								footer={
									<Link
										href="https://www.1jeune1mentor.fr/formulaire?1jeune1solution"
										className="fr-btn"
										title="Trouver mon mentor - nouvelle fenêtre"
									>
										Trouver mon mentor
									</Link>
								}>
								Rencontrez le mentor qui vous correspond et bénéficiez de son accompagnement régulier et de ses
								conseils pour atteindre vos objectifs : améliorer vos résultats scolaires, définir votre
								orientation, trouver vos premières expériences professionnelles…
							</Carte>
						</div>
						<div className="fr-col-12 fr-col-md-6">
							<Carte
								titreAs="h2"
								className="height--full"
								titre="Vous voulez devenir mentor ?"
								footer={
									<Link href="/je-deviens-mentor" className="fr-btn fr-btn--icon-right fr-icon-arrow-right-line">
										Devenir mentor
									</Link>
								}>
								Embarquez dans une aventure humaine hors du commun, pour partager votre expérience, favoriser
								l’égalité des chances et continuer à apprendre en accompagnant un jeune
							</Carte>
						</div>
					</div>
				</div>

				<section className="background--blue-light fr-py-5w">
					<div className="fr-container">
						<h2 className="fr-h3">Qu’est-ce que le mentorat ?</h2>
						<div className="fr-highlight">
							<p>
								Le mentorat, c’est l’accompagnement individuel bénévole d’un jeune par un mentor, qui peut aussi bien
								être lycéen qu’étudiant, actif ou retraité. Le “binôme” que forment le mentor et le jeune se rencontre
								plusieurs fois par mois (pendant au moins 6 mois) pour répondre aux objectifs du mentoré selon son âge
								et ses besoins. Le binôme est encadré par une structure, le plus souvent une association, qui offre un
								cadre sécurisé pour chacun.
							</p>
						</div>
					</div>
				</section>

				<section className="fr-container fr-py-5w">
					<div className="fr-grid-row fr-grid-row--gutters align-items--center">
						<div className="fr-col-12 fr-col-lg-7">
							<h2 className="fr-h3">Pourquoi participer à l’aventure du mentorat ?</h2>
							<ul className="list-style-none fr-pl-0">
								{raisonsParticipation.map(({ titre, description }) => (
									<li key={titre}>
										<p className="fr-text--bold fr-mb-1w">
											<span className="fr-icon-arrow-right-line fr-mr-1w" aria-hidden="true" />
											{titre}
										</p>
										<p>{description}</p>
									</li>
								))}
							</ul>
						</div>
						<div className="fr-col-lg-5 fr-hidden fr-unhidden-lg">
							<Image
								className="img-contain"
								src="/illustrations/aventure-du-mentorat.svg"
								alt=""
								width={490}
								height={370} />
						</div>
					</div>
				</section>
			</main>
		</>
	);
}

