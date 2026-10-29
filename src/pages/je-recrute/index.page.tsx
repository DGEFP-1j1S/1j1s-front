import documentSvg from "public/images/dsfr/document.svg";
import { Head } from "~/client/components/head/Head";
import { Banner } from "~/client/components/ui/Hero/Hero";
import { Link } from "~/client/components/ui/Link/Link";
import { Carte, Tuile } from "~/client/dsfr";
import useAnalytics from "~/client/hooks/useAnalytics";
import analytics from "~/pages/je-recrute/index.analytics";
import { LBA_RECRUTEUR_URL } from "~/shared/lbaLandingUrls";

export default function JeRecrutePage() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Recruter et agir pour les jeunes | 1jeune1solution"
				description="Emploi, formation, accompagnement"
				robots="index,follow"
			/>
			<main id="contenu">
				<Banner>
					<h1>
						Vous cherchez à recruter ?
					</h1>
					<p className="fr-text--lead fr-mb-0">
						Dans le cadre du plan 1 jeune, 1 solution, nous vous accompagnons dans la recherche de vos futurs collaborateurs.
					</p>
				</Banner>

				<section className="fr-container fr-py-5w">
					<h2>Recrutez</h2>
					<ul className="fr-grid-row fr-grid-row--gutters fr-pl-0">
						<li className="fr-col-12 fr-col-md-4">
							<Tuile lien="/emplois/deposer-offre" titre="Déposer une offre d’emploi" />
						</li>
						<li className="fr-col-12 fr-col-md-4">
							<Tuile lien={LBA_RECRUTEUR_URL} titre="Déposer une offre d’alternance" />
						</li>
						<li className="fr-col-12 fr-col-md-4">
							<Tuile lien="/stages/deposer-offre" titre="Déposer une offre de stage" />
						</li>
					</ul>
				</section>

				<section className="fr-container fr-py-5w">
					<h2>Découvrez l’apprentissage</h2>
					<p>Les avantages, les coûts, des témoignages de jeunes ayant fait l’expérience de l’apprentissage, des conseils pratiques</p>
					<ul className="fr-grid-row fr-grid-row--gutters">
						<li className="fr-col-12 fr-col-md-5">
							<Tuile
								lien="/documents/pourquoi-recruter-un-apprenti-2026.pdf"
								titre="Télécharger le flyer “Pourquoi recruter un apprenti ?”"
								telechargement="PDF - 1,2 Mo"
								pictogramme={documentSvg}
							/>
						</li>
						<li className="fr-col-12 fr-col-md-5">
							<Tuile
								lien="/faq/apprentissage-employeurs-apprentis"
								titre="FAQ : L’apprentissage le bon choix pour l’entreprise"
							/>
						</li>
					</ul>
				</section>

				<section className="fr-container fr-py-5w">
					<h2>Découvrez et engagez-vous</h2>
					<ul className="fr-grid-row fr-grid-row--gutters">
						<li className="fr-col-12 fr-col-md-4">
							<Carte
								className="height--full"
								titre="Découvrez les mesures du plan 1jeune1solution pour vous aider à recruter plus facilement"
								footer={
									<div className="flex justify-center">
										<Link href="/mesures-employeurs" className="fr-btn">
											Découvrir les mesures employeurs
										</Link>
									</div>
								}>
									Déposez facilement une offre d’emploi, d’alternance ou de stage et découvrez les aides à l’embauche et les dispositifs pour faciliter votre recrutement
								</Carte>
						</li>
						<li className="fr-col-12 fr-col-md-4">
							<Carte
								className="height--full"
								titre="Les entreprises s’engagent, une mobilisation des entreprises pour l’emploi des jeunes"
								footer={
									<div className="flex justify-center">
										<Link href="/les-entreprises-s-engagent" className="fr-btn">
											Rejoindre la mobilisation
										</Link>
									</div>
								}>
									Rejoignez les entreprises s’engagent, et bénéficiez de services inédits : un accompagnement personnalisé si vous le souhaitez, des aides pour communiquer, etc
							</Carte>
						</li>
					</ul>
				</section>
			</main>
		</>
	);
}
