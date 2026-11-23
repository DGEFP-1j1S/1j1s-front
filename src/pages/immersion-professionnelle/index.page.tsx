import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/immersions/index.analytics';
import { Head } from '~/client/components/head/Head';
import { Image } from "~/client/components/ui/Img";
import { Link } from "~/client/components/ui/Link/Link";

export default function ImmersionProfessionnellePage() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Immersion professionelle | 1jeune1solution"
				robots="index,follow"/>
			<main id="contenu">
				<section className="fr-container fr-pb-6w">
					<div className="fr-grid-row fr-grid-row--gutters fr-mb-0">
						<div className="fr-col-lg-7 fr-col-12">
							<h1>Immersion professionnelle</h1>
							<p className="fr-text--lead fr-mb-4w">Avec Immersion Facilitée, trouvez un métier à tester et entrez en
								relation avec une entreprise accueillante.</p>
							<p>Assurez le succès de votre projet professionnel en découvrant un métier en conditions réelles. Passez
								quelques jours en entreprise pour vérifier que ce métier vous plaît et vous convient. Profitez-en pour
								découvrir éventuellement votre futur employeur !</p>
						</div>
						<div className="fr-col-lg-5 fr-hidden fr-unhidden-lg fr-pt-6w">
							<Image
								src="/images/immersion-facilitee.jpg"
								alt="Immersion facilitée - Plateforme de l'inclusion"
								width="400"
								height="220"
							/>
						</div>
					</div>
					<Link className="fr-btn fr-btn--lg" href="https://immersion-facile.beta.gouv.fr/accueil-beneficiaires">Trouver une
						immersion</Link>
				</section>
			</main>
		</>
	);
}
