import React from "react";

export function PourquoiLUtiliser() {
	return (
		<section className="fr-container fr-py-10w">
			<h2 className="fr-mb-5w">Pourquoi l&#39;utiliser</h2>
			{ pourquois.map(pourquoi => (
				<React.Fragment key={pourquoi.titre}>
					<h3 className={`fr-h5 fr-mb-3v ${pourquoi.iconClass}`}>
						<span className="fr-ml-1w">{pourquoi.titre}</span>
					</h3>
					<p className="fr-mb-5v">{pourquoi.texte}</p>
				</React.Fragment>
			))}
		</section>
	);
}

type Pourquoi = {
	titre: string
	iconClass: string
	texte: string
}

const pourquois: Pourquoi[] = [
	{
		titre: "Tout au même endroit",
		iconClass: "fr-icon-phone-find-line",
		texte: "Offres, événements et pistes d'actions pour ton projet réunis dans une seule application. Si tu es accompagné, tes rendez-vous et tes messages s'y ajoutent."
	},
	{
		titre: "Ne rate aucune offre",
		iconClass: "fr-icon-gift-line",
		texte: "Crée une alerte sur ta recherche et reçois une notification dès qu'une nouvelle offre d'emploi, d'immersion, d'alternance ou de service civique correspond à ce que tu cherches."
	},
	{
		titre: "Un service public, tes données protégées",
		iconClass: "fr-icon-shield-line",
		texte: "L'application sera éditée par l'État : gratuite, sans publicité. Tes informations servent uniquement à t'aider dans ton projet."
	},
]
