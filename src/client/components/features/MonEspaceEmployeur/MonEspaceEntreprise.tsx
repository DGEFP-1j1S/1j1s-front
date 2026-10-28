import React from 'react';

import { Banner } from "~/client/components/ui/Hero/Hero";
import { Image } from '~/client/components/ui/Img';
import { Link } from '~/client/components/ui/Link/Link';

import styles from './MonEspaceEntreprise.module.scss';

export function MonEspaceEntreprise() {
	const AUTHENTIFICATION_URL_LBA = `${process.env.NEXT_PUBLIC_LA_BONNE_ALTERNANCE_URL}espace-pro/authentification`;
	const INSCRIPTION_URL_LBA = `${process.env.NEXT_PUBLIC_LA_BONNE_ALTERNANCE_URL}espace-pro/creation/entreprise`;
	const MAIL_TO_CONTACT_1J1S = 'contact-1j1s@sg.social.gouv.fr';

	return (
		<section className="fr-container">
			<h1>Espace employeur</h1>
			<h2>Engagez-vous pour les jeunes : “Les entreprises s’engagent”</h2>
			<p className="fr-text--lead fr-mb-6w">
				Rejoignez une communauté d’entreprises mobilisées pour favoriser l’insertion des jeunes.
			</p>

			<div className="fr-grid-row fr-grid-row--gutters fr-mb-6w blocs-employeur">
				<div className="border--blue fr-p-4w bloc-employeur--2-blocs">
					<h3 className="fr-h5">
						Vous êtes déjà membre de la “Communauté les entreprises s’engagent” ?
					</h3>
					<p>
						Connectez-vous à votre espace sur la plateforme
						"Les entreprises s‘engagent" pour accéder à tous les services
						d‘accompagnement et valoriser votre engagement en faveur des jeunes.
					</p>
					<Link
						className="fr-btn fr-btn--lg bouton-employeur"
						href="https://www.lesentreprises-sengagent.gouv.fr/login"
					>
						Se connecter à la communauté
					</Link>
				</div>

				<div className="border--blue fr-p-4w bloc-employeur--2-blocs">
					<h3 className="fr-h5">Vous souhaitez vous engager ?</h3>
					<p>
						Découvrez la mobilisation et rejoignez une communauté
						d’entreprises engagées pour les jeunes.
					</p>
					<Link
						className="fr-btn fr-btn--lg fr-btn--secondary bouton-employeur"
						href="/les-entreprises-s-engagent"
					>
						Rejoindre la mobilisation
					</Link>
				</div>
			</div>

			<h2>Recrutez sur La Bonne Alternance</h2>
			<p className="fr-text--lead fr-mb-6w">
				Accédez aux services pour publier vos offres, recrutez des alternants et contribuer à l’insertion des jeunes
			</p>
			<div className="fr-grid-row fr-grid-row--gutters fr-mb-6w blocs-employeur">
				<div className="border--blue fr-p-4w bloc-employeur--3-blocs">
					<h3 className="fr-h5">
						Vous avez déjà publié une offre en alternance pour les jeunes ?
					</h3>
					<p>
						Connectez-vous à votre espace sur la plateforme "La bonne alternance" pour gérer vos offres actuelles ou en
						publier de nouvelles.
					</p>
					<Link
						className="fr-btn fr-btn--lg bouton-employeur"
						href={AUTHENTIFICATION_URL_LBA}
					>
						Gérer ses offres
					</Link>
				</div>

				<div className="border--blue fr-p-4w bloc-employeur--3-blocs">
					<h3 className="fr-h5">Pas encore inscrit ? Inscrivez votre entreprise</h3>
					<p>
						Diffusez simplement et gratuitement vos offres en alternance afin d’être visible auprès des jeunes en
						recherche de contrat, et des centres de formation pouvant vous accompagner.
					</p>
					<Link
						className="fr-btn fr-btn--lg fr-btn--secondary bouton-employeur"
						href={INSCRIPTION_URL_LBA}
					>
						Inscrire son entreprise
					</Link>
				</div>

				<div className="border--blue fr-p-4w bloc-employeur--3-blocs">
					<h3 className="fr-h5">Offres de stages d’études</h3>
					<p>
						Pour toutes demandes concernant les offres de stages d’etudes, veuillez nous contactez par email.
					</p>
					<Link
						className="fr-btn fr-btn--lg fr-btn--secondary bouton-employeur"
						href={`mailto:${MAIL_TO_CONTACT_1J1S}`}
					>
						Contacter par email
					</Link>
				</div>
			</div>
		</section>
	);
}
