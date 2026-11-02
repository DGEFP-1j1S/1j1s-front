import React from "react";
import { Citation } from "../../../dsfr/Citation";

export function CitationsApp() {
	return (
		<section className="fr-container fr-py-5w fr-mb-5w">
			<h2 className="fr-mb-9w">Ce qu&#39;en disent les jeunes qui l&#39;ont testée</h2>
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
		texte: "c'est très facile de communiquer avec ma conseillère, cela m'aide beaucoup pour les projets d'avenir et ce que je veux faire.",
		auteurice: "jeune suivi en mission locale"
	},
	{
		texte: "L'application me permet d etre organisé et d'avoir tout un agenda des événements et ateliers qu'on fait chaque jour",
		auteurice: "jeune suivi en mission locale"
	},
	{
		texte: "les rendez-vous, les ateliers, les offres d'emploi, les démarches, les logements, tout y est j'adore ! ",
		auteurice: "jeune suivi par France Travail"
	},
]
