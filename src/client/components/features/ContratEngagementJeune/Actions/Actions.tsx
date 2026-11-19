import React from "react";

import { Image } from "~/client/components/ui/Img";

const actions = [
	{
		icone: "fr-icon-chat-3-line",
		texte: "Des points réguliers en tête-à-tête avec mon conseiller qui me suit tout au long de mon parcours et jusqu’à ce que j’accède à un emploi durable",
	},
	{
		icone: "fr-icon-chat-quote-line",
		texte: "Des ateliers collectifs avec d’autres jeunes pour partager nos expériences",
	},
	{
		icone: "fr-icon-building-line",
		texte: "Des stages et immersions en entreprise pour découvrir différents métiers",
	},
	{
		icone: "fr-icon-list-unordered",
		texte: "Toutes les solutions du plan 1 jeune, 1 solution : formations qualifiantes, service civique, prépa apprentissage, école de la 2ème chance (E2C), Epide, etc.",
	},
	{
		icone: "fr-icon-smartphone-line",
		texte: "Une application 1 jeune 1 solution pour suivre l’évolution de mon parcours et tenir mes engagements",
	},
];

export default function Actions() {
	return (
		<section className="fr-container fr-py-9w">
			<h2 className="fr-mb-3w">Concrètement qu’est-ce qu’on fait en Contrat d’Engagement Jeune ?</h2>
			<p className="fr-text--lg fr-mb-3w">
				Accueilli au sein de France Travail ou de ma Mission Locale, en fonction de mon profil, de mes compétences et de mes envies, je pourrai avoir accès à :
			</p>
			<div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
				<div className="fr-col-lg-4 fr-hidden fr-unhidden-lg">
					<Image className="fr-responsive-img" src="/images/CEJ/vignette-conseiller.webp" alt="Pour mon avenir, pas d’impro, je suis coachée par un pro ! 1jeune1solution.gouv.fr" width="880" height="843" />
				</div>
				<div className="fr-col-12 fr-col-lg-8">
					<ul>
						{actions.map((action) => (
							<li key={action.icone} className="flex align-items--center fr-mb-3w">
								<span className={`${action.icone} fr-mr-1w`} aria-hidden="true" />
								<p className="fr-text--sm fr-mb-0">{action.texte}</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
