import React, { Dispatch, SetStateAction } from "react";

import { Link } from "~/client/components/ui/Link/Link";

export type Formulaires =
	'Démarrage'
	| 'PasDAccompagnement'
	| 'BesoinAide'
	| 'BesoinAide26ans'
	| 'AutresBesoins'
	| 'Handicap'
	| 'AutresBesoins26ans';

export interface FormulairesProps {
	setTypeFormulaireAffiché: Dispatch<SetStateAction<Formulaires>>;
	setIsFranceTravailModalOpen: Dispatch<SetStateAction<boolean>>;
	setIsInscriptionFranceTravailModalOpen: Dispatch<SetStateAction<boolean>>;
	setIsMissionLocaleModalOpen: Dispatch<SetStateAction<boolean>>;
	setIsDispositifsReferencesModalOpen: Dispatch<SetStateAction<boolean>>;
	onBackButton: () => void
}

const situations = [
	"Je suis accompagné(e) par France Travail",
	"Je suis accompagné(e) par une Mission Locale",
	"Je ne bénéficie d’aucun accompagnement",
];

export default function Accompagnement() {
	return (
		<section className="background--blue-light fr-py-8w">
			<div className="fr-container">
				<h2 id="accompagnement" className="fr-mb-5w">Le Contrat d’Engagement Jeune, je me lance !</h2>
				<div className="fr-grid-row fr-grid-row--gutters">
					<div className="fr-col-12 fr-col-lg-6">
						<p className="fr-text--lg">
							Pour entrer en Contrat d’Engagement Jeune, vous devez vous rapprocher d’un professionnel de l’accompagnement chez France Travail ou en Mission Locale.
						</p>
						<p className="fr-text--lg fr-mb-0">
							Pour vous aider à identifier le bon interlocuteur, répondez à quelques questions.
						</p>
					</div>
					<div className="fr-col-12 fr-col-lg-6">
						<p className="fr-text--lg">
							Je souhaite obtenir des informations et être contacté(e) par le bon interlocuteur dans le cadre du Contrat d’Engagement Jeune.
						</p>
						<p className="fr-text--lg fr-mb-2w">Quelle est ma situation ?</p>
						<ul className="fr-raw-list">
							{situations.map((situation) => (
								<li key={situation} className="fr-mb-2w">
									<Link className="fr-link fr-link--lg" href="#">{situation}</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
