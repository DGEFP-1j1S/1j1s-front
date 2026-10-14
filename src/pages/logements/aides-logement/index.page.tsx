import { Carte } from '~/client/dsfr';
import { Head } from '~/client/components/head/Head';
import { HeroWithButtonLink } from '~/client/components/ui/Hero/HeroWithButtonLink';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/logements/aides-logement/index.analytics';
import {ServiceCardList} from "~/client/components/features/ServiceCard/Card/ServiceCard";

export default function AidesLogement() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Les aides au logement | 1jeune1solution"
				robots="index,follow" />
			<main id="contenu">
				<HeroWithButtonLink
					title="Je découvre les aides pour payer mon logement et bien d’autres encore !"
					content="Grâce à notre simulateur, découvrez les aides auxquelles vous avez droit
            pour votre logement mais aussi votre mobilité, vos vacances, votre santé... et bien plus encore !
            Tout cela à portée de clic et en moins de 5 minutes."
					buttonLabel="Découvrir mes aides"
					buttonHref="/mes-aides"
					imgSrc="/images/aides-au-logement.webp"
					additionalInformation={additionalInformation()} />
				<ServiceCardList heading="Découvrez vos aides" aria-label="Découvrez vos aides">
					<Carte
						horizontal
						imageSrc="/images/logos/caisse-allocations-familiales.svg"
						lien="https://wwwd.caf.fr/wps/portal/caffr/aidesetdemarches/mesdemarches/faireunesimulation/lelogement#/preparation"
						titre="Vous dépendez du régime général ? Demandez vos aides à la CAF !">
						La CAF signifie Caisse d’Allocation Familiales. Il y en a
						dans chaque département. Son rôle est de verser les aides
						qui concernent la famille, le logement mais aussi une partie
						des aides destinées à lutter contre la pauvreté, comme le
						RSA ou la Prime d’activité.
					</Carte>
					<Carte
						horizontal
						imageSrc="/images/logos/mutualite-sociale-agricole.svg"
						lien="https://www.msa.fr/lfp/web/msa/logement/offre-msa"
						titre="Vous dépendez du régime agricole ? Demandez vos aides à la MSA !">
						La MSA signifie Mutualité Sociale Agricole, c’est le régime
						de protection sociale obligatoire pour toute personne du
						secteur agricole. Son rôle est donc de verser à tous ses
						adhérents les aides dont ils pourraient avoir besoin :
						maladie, maternité, retraite...mais aussi logement !
					</Carte>
				</ServiceCardList>
			</main>
		</>
	);
}

function additionalInformation() {
	return (
		<p className="fr-text--sm fr-mt-2w">
			<span className="fr-icon-information-line fr-mr-1w" aria-hidden="true" />
			Avant de démarrer la simulation de vos aides, pensez à vous munir de vos ressources et de celles de vos parents si vous êtes encore à leur charge.
		</p>
	);
}
