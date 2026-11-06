import React from 'react';
import { Image } from "~/client/components/ui/Img";
import { Link } from "~/client/components/ui/Link/Link";

interface HeroApplicationMobileProps {
	estLive: boolean
}

export function BandeauAccueilApplicationMobile({ estLive }: HeroApplicationMobileProps) {
	return (
		<section className="fr-container background--blue-light fr-p-0 fr-my-5v border-left border-left--large border-left--high-blue">
			<div className="fr-grid-row">
				<div className="fr-col-lg-7 fr-col-12 fr-py-md-6w fr-py-3w fr-pl-md-8w fr-pr-md-0 fr-px-4w">
					<h1>La nouvelle application 1jeune1solution</h1>
					{ !estLive &&
						<div className="fr-hidden fr-unhidden-lg">
							<div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom fr-mb-5v">
								<div className="fr-col-auto">
									<p className="background--purple-glycine fr-text--bold text--uppercase fr-mb-0 fr-p-1w color--inherit">Bientôt disponible</p>
								</div>
								<div className="fr-col-auto">
									<p className="fr-text--bold fr-mb-0">Sur App Store et Google Play</p>
								</div>
							</div>
						</div>
					}
					<p className="fr-h5">Des suggestions d’actions personnalisées selon ton projet.</p>
					<p className="fr-mb-0 fr-mb-md-3w">Emploi, formation, mobilité… L’app te propose les bonnes actions, au bon moment.</p>
					<CTAsLgDevice estLive={estLive} />
				</div>
				<div className="fr-col-lg-5 fr-col-12">
					<Image
						src="/images/application-mobile/banner-app-mobile.svg"
						alt="Écran d'accueil de l'application mobile 1jeune1solution"
						width="650"
						height="498"
						priority
						className="max-width--full height--full fr-mx-auto block"
					/>
				</div>
				<CTAsMdDevices estLive={estLive} />
			</div>
		</section>
	);
}


function CTAsLgDevice({estLive}: HeroApplicationMobileProps) {
	if (estLive) {
		return (
			<div className="fr-hidden fr-unhidden-lg">
				<div className="fr-grid-row fr-grid-row--gutters">
					<ul className="fr-col-sm-6 fr-col-12 fr-btns-group fr-btns-group--equisized">
						<li>
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
			</div>
		)
	} else {
		return (
			<Link
				className="fr-btn fr-btn--secondary fr-hidden fr-unhidden-lg"
				href="/application-mobile">
				Découvrir l’application
			</Link>
		)
	}
}

function CTAsMdDevices({estLive}: HeroApplicationMobileProps) {
	if (estLive) {
		return (
			<ul className="fr-col-lg-6 fr-col-12 fr-mt-3w fr-mx-0 fr-btns-group fr-hidden-lg">
				<li>
					<Link
						className="fr-btn"
						href="https://doc.pass-emploi.beta.gouv.fr/telechargement-application-du-cej/">
						Télécharger l’application
					</Link>
				</li>
				<li>
					<Link
						className="fr-btn fr-btn--secondary"
						href="/application-mobile">
						Découvrir l’application
					</Link>
				</li>
			</ul>
		)
	} else {
		return (
			<Link
				className="fr-btn fr-btn--lg fr-btn--secondary fr-mx-2w fr-my-4w justify--center width--full fr-hidden-lg"
				href="/application-mobile">
				Découvrir l’application
			</Link>
		)
	}
}
