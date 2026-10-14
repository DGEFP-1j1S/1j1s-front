import { Banner } from "~/client/components/ui/Hero/Hero";
import { Link } from '~/client/components/ui/Link/Link';

export function ExperiencesEnEurope() {
	return (
		<section>
			<Banner>
				<h1 className="fr-h1">
					Je cherche une expérience en Europe
				</h1>
				<p className="fr-text--lead">
					Trouvez des offres d’emploi, de stage et des volontariats internationaux au sein de pays Européens ainsi que
					des aides financières afin de partir à la découverte de nouvelles opportunités et de nouveaux pays !
				</p>
				<p className="fr-text--sm">
					<span className="fr-icon-information-line fr-mr-1w" aria-hidden="true" />
						Si vous êtes accompagné·e en mission locale, rapprochez-vous de votre conseiller pour en savoir plus sur les mobilités courtes
				</p>
				<Link
					href="https://europa.eu/eures/portal/jv-se/home?lang=fr"
					className="fr-btn"
					title="Trouver une offre d'emploi en Europe - nouvelle fenêtre">
					Trouver une offre d’emploi en Europe
				</Link>
			</Banner>
		</section>
	);
}
