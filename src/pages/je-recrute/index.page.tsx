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
					<h1 className="fr-h1">
						Vous cherchez à recruter ?
					</h1>
					<p className="fr-text--lead fr-mb-0">
						Dans le cadre du plan 1 jeune, 1 solution, nous vous accompagnons dans la recherche de vos futurs collaborateurs.
					</p>
				</Banner>

				<div className="fr-container fr-mb-5w">
					<ul className="fr-grid-row fr-grid-row--gutters fr-pl-0">
						<li className="fr-col-12 fr-col-md-4">
							<Tuile titreAs="h2" lien="/emplois/deposer-offre" titre="Déposer une offre d’emploi" />
						</li>
						<li className="fr-col-12 fr-col-md-4">
							<Tuile titreAs="h2" lien={LBA_RECRUTEUR_URL} titre="Déposer une offre d’alternance" />
						</li>
						<li className="fr-col-12 fr-col-md-4">
							<Tuile titreAs="h2" lien="/stages/deposer-offre" titre="Déposer une offre de stage" />
						</li>
					</ul>
				</div>

				<section className="fr-container fr-py-5w">
					<h2 className="fr-h2">Découvrez et engagez-vous</h2>
					<div className="fr-grid-row fr-grid-row--gutters">
						<div className="fr-col-12 fr-col-md-4">
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
						</div>
						<div className="fr-col-12 fr-col-md-4">
							<Carte
								className="height--full"
								titre="Découvrez l’apprentissage, le bon choix pour votre entreprise"
								footer={
									<div className="flex justify-center">
										<Link href={LBA_RECRUTEUR_URL} className="fr-btn">
											Découvrir l’apprentissage
										</Link>
									</div>
								}>
								Les avantages, les coûts, des témoignages de jeunes ayant fait l’expérience de l’apprentissage, des
								conseils pratiques...
							</Carte>
						</div>
						<div className="fr-col-12 fr-col-md-4">
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
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
