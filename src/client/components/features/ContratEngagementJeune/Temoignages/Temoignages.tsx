import React from "react";

import { Carte } from "~/client/dsfr";
import { Badge } from "~/client/dsfr/Badge";

const temoignages = [
	{
		badge: "Mission Locale · 12 mois",
		description: "Sans diplôme et sans aucune ressource financière, il pourra bénéficier du Contrat d’Engagement Jeune.",
		imageSrc: "/images/CEJ/vignette-kevin.jpg",
		nom: "Kévin, 18 ans",
		programme: [
			"3 mois dans sa Mission Locale avec son conseiller qui lui proposera des ateliers collectifs pour travailler sur son projet professionnel et effectuer des stages en entreprise en bénéficiant d’une allocation de 561,68 euros par mois.",
			"Intéressé par le sport, il pourra ensuite faire un service civique de 8 mois dans une association qui propose des activités sportives à des jeunes en difficulté.",
			"Pour finir, avant de se lancer sur le marché du travail, il retournera dans sa Mission Locale pendant 1 mois pour préparer des entretiens d’embauche avec son conseiller et démarcher des entreprises.",
			"Objectif : à la fin de son programme, Kévin aura trouvé un emploi dans un domaine dans lequel il s’épanouit.",
		],
	},
	{
		badge: "France Travail · 9 mois",
		description: "Diplômée d’un CAP gestion, sans emploi et sans aucune ressource financière, elle pourra bénéficier du Contrat d’Engagement Jeune.",
		imageSrc: "/images/CEJ/vignette-latifa.jpg",
		nom: "Latifa, 22 ans",
		programme: [
			"Un parcours de 9 mois construit avec son conseiller France Travail, dont 6 mois d’accompagnement intensif avec des séances individuelles, des ateliers collectifs et des immersions en entreprise pour découvrir des métiers.",
			"Elle bénéficiera d’une allocation de 561,68 euros par mois, car elle n’a pas de ressources financières.",
			"Après cette période et la découverte d’un métier qui l’intéresse, elle pourra se former encore pendant 3 mois en prépa apprentissage.",
			"Objectif : elle pourra candidater à un contrat en apprentissage dans une entreprise.",
		],
	},
];

export function Temoignages() {
	return (
		<section className="fr-container fr-py-8w">
			<h2 className="fr-mb-5w">Ce que le Contrat d’Engagement Jeune peut vous proposer</h2>
			{temoignages.map((temoignage) => (
				<div key={temoignage.nom} className="fr-grid-row fr-grid-row--gutters fr-mb-5w">
					<div className="fr-col-12 fr-col-lg-6">
						<Carte
							titre={temoignage.nom}
							badges={[<Badge key={temoignage.badge} className="fr-badge--sm fr-badge--purple-glycine">{temoignage.badge}</Badge>]}
							imageSrc={temoignage.imageSrc}
							className="fr-card--grey fr-card--no-border"
							horizontal>
							{temoignage.description}
						</Carte>
					</div>
					<div className="fr-col-12 fr-col-lg-6">
						<p className="fr-text--bold fr-mb-1w">Son programme :</p>
						<ul>
							{temoignage.programme.map((etape) => (
								<li key={etape}>{etape}</li>
							))}
						</ul>
					</div>
				</div>
			))}
		</section>
	);
}
