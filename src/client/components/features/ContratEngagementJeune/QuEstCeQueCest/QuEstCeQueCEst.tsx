import React from "react";

import { Carte } from "~/client/dsfr";
import { Footnote } from "~/client/components/ui/Footnote/Footnote";

const benefices = [
	{
		description: "Avec un conseiller dédié qui me suit tout au long de mon parcours et jusqu’à ce que j’accède à un emploi durable",
		titre: "Un accompagnement personnalisé",
	},
	{
		description: "Au minimum 15 à 20 heures par semaine composé de différents types d’activités",
		titre: "Un programme intensif",
	},
	{
		description: "En fonction de mon âge, de mes ressources, de mes revenus (du niveau de revenu fiscal du foyer auquel je suis rattaché) et du respect de mes engagements",
		titre: "Une allocation pouvant aller jusqu’à 561,68 €",
	},
];

export default function QuEstCeQueCEst() {
	return (
		<section className="fr-container fr-py-6w">
			<h2 className="fr-mb-5w">Le Contrat d’Engagement Jeune, qu’est-ce que c’est ?</h2>
			<p className="fr-text--lg fr-mb-3w">
				Un parcours entièrement personnalisé qui peut durer jusqu’à 12 mois<Footnote.Reference to="note-sur-la-duree" id="duree-reference" /> en fonction de mon profil, pour m’aider à définir mon projet professionnel et à trouver un emploi.
			</p>
			<p className="fr-text--lg fr-mb-4w" id="beneficesCEJ">Quand je signe mon contrat, je bénéficie de :</p>
			<ul aria-labelledby="beneficesCEJ" className="fr-grid-row fr-grid-row--gutters">
				{benefices.map((benefice) => (
					<li key={benefice.titre} className="fr-col-12 fr-col-md-4">
						<Carte titre={benefice.titre} className="fr-card--no-border background--blue-light">
							{benefice.description}
						</Carte>
					</li>
				))}
			</ul>
			<Footnote htmlFor="duree-reference" id="note-sur-la-duree" className="fr-text--lg fr-mt-3w fr-mb-0">La durée de l’accompagnement peut exceptionnellement aller jusqu’à 18 mois</Footnote>
		</section>
	);
}
