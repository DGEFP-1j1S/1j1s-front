import React from "react";

import { Image } from "~/client/components/ui/Img";

const criteres = [
	"J’ai entre 16 et 25 ans (moins de 30 si je suis en situation de handicap)",
	"Je suis sans emploi ni formation",
	"Je n’ai pas de projet professionnel défini et j’ai perdu confiance en moi",
	"Je fais face à des difficultés matérielles et financières",
	"Je suis prêt(e) à m’engager à suivre le programme",
];

export default function PourquoiCEstFaitPourMoi() {
	return (
		<section className="background--blue-light fr-py-6w">
			<div className="fr-container">
				<h2 className="fr-mb-4w">Le Contrat d’Engagement Jeune est fait pour moi si :</h2>
				<div className="fr-grid-row fr-grid-row--gutters">
					<div className="fr-col-12 fr-col-lg-6">
						<ul className="fr-raw-list">
							{criteres.map((critere) => (
								<li key={critere} className="fr-text--lg fr-text--bold fr-mb-3w">
									<span className="fr-icon-check-line fr-mr-1w" aria-hidden="true" />
									{critere}
								</li>
							))}
						</ul>
					</div>
					<div className="fr-col-lg-5 fr-col-offset-lg-1 fr-hidden fr-unhidden-lg">
						<Image className="fr-responsive-img" src="/images/CEJ/eligibilite.webp" alt="" width="1054" height="1244" />
					</div>
				</div>
			</div>
		</section>
	);
}
