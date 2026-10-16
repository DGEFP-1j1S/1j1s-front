import React from 'react';

import { Container } from '~/client/components/layouts/Container/Container';
import { LightHeroPrimaryText, LightHeroSecondaryText } from '~/client/components/ui/Hero/LightHero';
import { Image } from '~/client/components/ui/Img';
import { Link } from '~/client/components/ui/Link/Link';

import styles from './MonEspaceEntreprise.module.scss';

export function MonEspaceEntreprise() {
	const AUTHENTIFICATION_URL_LBA = `${process.env.NEXT_PUBLIC_LA_BONNE_ALTERNANCE_URL}espace-pro/authentification`;
	const INSCRIPTION_URL_LBA = `${process.env.NEXT_PUBLIC_LA_BONNE_ALTERNANCE_URL}espace-pro/creation/entreprise`;
	const MAIL_TO_CONTACT_1J1S = 'contact-1j1s@sg.social.gouv.fr';

	return (
		<section className={styles.monEspace}>
			<Container>
				<h1>
					<LightHeroPrimaryText>
						Les entreprises s‘engagent auprès de la jeunesse !
					</LightHeroPrimaryText>
				</h1>
				<div className={styles.entreprisesPourLaJeunesse}>
					<Image src="/images/logos/les-entrerprises-s-engagent.svg" alt="" width={150} height={150} />
					<h2>
						<LightHeroSecondaryText>
							<span>Vous êtes déjà membre de la Communauté</span> &quot;Les entreprises s‘engagent&quot; ?
						</LightHeroSecondaryText>
					</h2>
					<p>
						<span>
							Connectez-vous à votre espace sur la plateforme &quot;Les entreprises s‘engagent&quot; pour accéder à tous les services d‘accompagnement et valoriser votre engagement en faveur des jeunes.
						</span>
					</p>
					<div>
						<Link
							href="https://www.lesentreprises-sengagent.gouv.fr/login"
							appearance="asPrimaryButton">
							Se connecter
							<Link.Icon />
						</Link>
						<Link
							appearance={'asQuaternaryButton'}
							href="/les-entreprises-s-engagent">
							<Link.Icon name="information" />
							Pas encore inscrit ? Rejoignez la mobilisation
						</Link>
					</div>
					<Image
						src="/images/logos/la-bonne-alternance.svg"
						alt=""
						width={200}
						height={200} />
					<h2>
						<LightHeroSecondaryText>
							Vous avez déjà publié une offre en alternance pour les jeunes ?
						</LightHeroSecondaryText>
					</h2>
					<p>
						<span>
							Connectez-vous à votre espace sur la plateforme &quot;La bonne alternance&quot; pour gérer vos offres
							actuelles ou en publier de nouvelles.
						</span>
					</p>
					<div>
						<Link href={AUTHENTIFICATION_URL_LBA} appearance="asPrimaryButton">Se connecter<Link.Icon /></Link>
						<Link
							appearance={'asQuaternaryButton'}
							href={INSCRIPTION_URL_LBA}>
							<Link.Icon name="information" />
							Pas encore inscrit ? Inscrivez votre entreprise
						</Link>
					</div>
				</div>
				<p className={styles.contact}>
					Pour toute demande concernant les offres de stages d‘études, veuillez <Link
						href={`mailto:${MAIL_TO_CONTACT_1J1S}`}>nous contacter par email<Link.Icon /></Link>
				</p>
			</Container>
		</section>
	);
}
