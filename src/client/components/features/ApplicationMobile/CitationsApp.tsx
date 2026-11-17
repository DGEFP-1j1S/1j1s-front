import React from "react";
import { Citation } from "~/client/dsfr/Citation";

export function CitationsApp() {
	return (
		<section className="fr-container fr-mb-10w">
			<h2 className="fr-mb-9w">Ce qu’en disent les jeunes qui l’ont testée</h2>
			<ul className="fr-grid-row fr-grid-row--gutters">
				{ citations.map(citation => (
					<li key={citation.texte} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
						<Citation
							citation={citation.texte}
							auteurice={citation.auteurice}
						/>
					</li>
				))}
			</ul>
		</section>
	);
}

type CitationApp = {
	texte: string
	auteurice: string
}

const citations: CitationApp[] = [
	{
		texte: "”C'est très facile de communiquer avec ma conseillère, cela m'aide beaucoup pour les projets d'avenir et ce que je veux faire.”",
		auteurice: "Jeune suivi en mission locale"
	},
	{
		texte: "”L'application me permet d'être organisé et d'avoir tout un agenda des événements et ateliers qu'on fait chaque jour.”",
		auteurice: "Jeune suivi en mission locale"
	},
	{
		texte: "”Les rendez-vous, les ateliers, les offres d'emploi, les démarches, les logements, tout y est j'adore !”",
		auteurice: "Jeune suivi par France Travail"
	},
]
