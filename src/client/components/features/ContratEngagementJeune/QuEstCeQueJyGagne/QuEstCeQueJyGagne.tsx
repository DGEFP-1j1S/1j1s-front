import React from "react";

import { Carte } from "~/client/dsfr";

const gains = [
	{ pictogramme: "/images/dsfr/data-visualization.svg", titre: "Définir et bâtir un projet professionnel durable" },
	{ pictogramme: "/images/dsfr/avatar.svg", titre: "Mettre en valeur mes talents et mes compétences" },
	{ pictogramme: "/images/dsfr/companie.svg", titre: "Découvrir le monde professionnel et comprendre son fonctionnement et ses codes" },
	{ pictogramme: "/images/dsfr/ecosystem.svg", titre: "Construire mon réseau pour trouver plus facilement et plus rapidement un emploi" },
];

export default function QuEstCeQueJyGagne() {
	return (
		<section className="background--blue-light fr-py-6w">
			<div className="fr-container">
				<h2 className="fr-mb-3w">Mais en vrai, qu’est-ce que j’y gagne à long terme ?</h2>
				<p className="fr-text--lg fr-mb-5w">
					Quand je m’engage, je prépare mon avenir et je mets toutes les chances de mon côté pour :
				</p>
				<ul className="fr-grid-row fr-grid-row--gutters">
					{gains.map((gain) => (
						<li key={gain.titre} className="fr-col-12 fr-col-md-6 fr-col-lg-3">
							<Carte titre={gain.titre} pictogramme={gain.pictogramme} className="fr-card--sm" />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
