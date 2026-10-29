import React from 'react';

import { Carte } from "~/client/dsfr";
import { Link } from '~/client/components/ui/Link/Link';

export function MonEspaceEntreprise() {
	const AUTHENTIFICATION_URL_LBA = `${process.env.NEXT_PUBLIC_LA_BONNE_ALTERNANCE_URL}espace-pro/authentification`;
	const INSCRIPTION_URL_LBA = `${process.env.NEXT_PUBLIC_LA_BONNE_ALTERNANCE_URL}espace-pro/creation/entreprise`;
	const MAIL_TO_CONTACT_1J1S = 'contact-1j1s@sg.social.gouv.fr';

	return (
		<>
			<section className="fr-py-3w">
				<h2>Engagez-vous pour les jeunes : “Les entreprises s’engagent”</h2>
				<p className="fr-text--lead fr-mb-4w">
					Rejoignez une communauté d’entreprises mobilisées pour favoriser l’insertion des jeunes.
				</p>

				<ul className="fr-grid-row fr-grid-row--gutters">
					<li className="fr-col-12 fr-col-lg-6">
						<Carte
							titre="Vous êtes déjà membre de la “Communauté les entreprises s’engagent” ?"
							footer={<Link
								className="fr-btn fr-btn--lg"
								href="https://www.lesentreprises-sengagent.gouv.fr/login"
							>
								Se connecter à la communauté
							</Link>}
						>
							Connectez-vous à votre espace sur la plateforme
							“Les entreprises s‘engagent” pour accéder à tous les services
							d‘accompagnement et valoriser votre engagement en faveur des jeunes.
						</Carte>
					</li>

					<li className="fr-col-12 fr-col-lg-6">
						<Carte
							titre="Vous souhaitez vous engager ?"
							footer={<Link
								className="fr-btn fr-btn--lg fr-btn--secondary"
								href="/les-entreprises-s-engagent"
							>
								Rejoindre la mobilisation
							</Link>}
						>
							Découvrez la mobilisation et rejoignez une communauté
							d’entreprises engagées pour les jeunes.
						</Carte>
					</li>
				</ul>
			</section>

			<section className="fr-py-3w">
				<h2>Recrutez sur La Bonne Alternance</h2>
				<p className="fr-text--lead fr-mb-4w">
					Accédez aux services pour publier vos offres, recrutez des alternants et contribuer à l’insertion des jeunes
				</p>

				<ul className="fr-grid-row fr-grid-row--gutters">
					<li className="fr-col-12 fr-col-lg-4">
						<Carte
							titre="Vous avez déjà publié une offre en alternance pour les jeunes ?"
							footer={<Link
								className="fr-btn fr-btn--lg"
								href={AUTHENTIFICATION_URL_LBA}
							>
								Gérer ses offres
							</Link>}
						>
							Connectez-vous à votre espace sur la plateforme “La bonne alternance” pour gérer vos offres
							actuelles ou en publier de nouvelles.
						</Carte>
					</li>

					<li className="fr-col-12 fr-col-lg-4">
						<Carte
							titre="Pas encore inscrit ? Inscrivez votre entreprise"
							footer={<Link
								className="fr-btn fr-btn--lg fr-btn--secondary"
								href={INSCRIPTION_URL_LBA}
							>
								Inscrire son entreprise
							</Link>}
						>
							Diffusez simplement et gratuitement vos offres en alternance afin d’être visible auprès des jeunes en
							recherche de contrat, et des centres de formation pouvant vous accompagner.
						</Carte>
					</li>

					<li className="fr-col-12 fr-col-lg-4">
						<Carte
							titre="Offres de stages d’études"
							footer={<Link
								className="fr-btn fr-btn--lg fr-btn--secondary"
								href={`mailto:${MAIL_TO_CONTACT_1J1S}`}
							>
								Contacter par email
							</Link>}
						>
							Pour toutes demandes concernant les offres de stages d’etudes, veuillez nous contactez par email.
						</Carte>
					</li>
				</ul>
			</section>
		</>
	);
}
