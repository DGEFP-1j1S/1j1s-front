import React from 'react';
import { Image } from "~/client/components/ui/Img";
import { Link } from "~/client/components/ui/Link/Link";

interface HeroApplicationMobileProps {
	estLive: boolean
}

export function HeroApplicationMobile({ estLive }: HeroApplicationMobileProps) {
	return (
		<section className="background--blue-light fr-py-9w">
			<div className="fr-container">
				<div className="fr-grid-row fr-grid-row--gutters">
					<div className="fr-col-lg-7 fr-col-12">
						<h1>La nouvelle application 1jeune1solution</h1>
						<p className="fr-text--lead fr-mb-8w">L’app 15-30 ans est ouverte à tous les jeunes et t’accompagne dans tous tes projets : études, logements, emploi mobilité santé loisir et bien plus.</p>
						{ estLive ? (
							<div className="fr-grid-row fr-grid-row--gutters">
								<ul className="fr-col-sm-6 fr-col-12 fr-btns-group fr-btns-group--equisized">
									<li className="fr-mb-4v">
										<Link
											className="fr-btn fr-btn--secondary"
											href="https://apps.apple.com/fr/app/contrat-dengagement-jeune/id1581603519">
											Télécharger sur l’App Store
										</Link>
									</li>
									<li>
										<Link
											className="fr-btn fr-btn--secondary"
											href="https://play.google.com/store/apps/details?id=fr.fabrique.social.gouv.passemploi&hl=fr">
											Télécharger sur Google Play
										</Link>
									</li>
								</ul>
								<div className="fr-col-sm-6 fr-col-12">
									<div className="flex align-items--center">
										<Image
											className="border--plain-grey"
											src="/images/application-mobile/qr-code.svg"
											alt="QR code vers https://doc.pass-emploi.beta.gouv.fr/telechargement-application-du-cej/"
											width="100"
											height="100"
											priority
										/>
										<p className="fr-mb-0 fr-ml-5v fr-text--bold">Télécharge l’application dès maintenant !</p>
									</div>
								</div>
							</div>
						) : (
							<p className="fr-h5">Bientôt disponible sur App Store et Google Play !</p>
						)}
					</div>
					<div className="fr-col-lg-5 fr-hidden fr-unhidden-lg justify--center">
						<Image
							src="/images/application-mobile/screen-app-mobile.png"
							alt="Écran d'accueil de l'application mobile 1jeune1solution"
							width="258"
							height="504"
							priority
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
