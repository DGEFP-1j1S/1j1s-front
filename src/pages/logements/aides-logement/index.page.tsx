import classNames from 'classnames';

import { ServiceCard } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { Head } from '~/client/components/head/Head';
import { Container } from '~/client/components/layouts/Container/Container';
import { HeroWithButtonLink } from '~/client/components/ui/Hero/HeroWithButtonLink';
import { Icon } from '~/client/components/ui/Icon/Icon';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/logements/aides-logement/index.analytics';
import styles from '~/pages/logements/aides-logement/index.module.scss';

export default function AidesLogement() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Les aides au logement | 1jeune1solution"
				robots="index,follow" />
			<main id="contenu">
				<HeroWithButtonLink
					titlePrimaryText="Je découvre les aides pour payer mon logement "
					titleSecondaryText="et bien d’autres encore !"
					content="Grâce à notre simulateur, découvrez les aides auxquelles vous avez droit
            pour votre logement mais aussi votre mobilité, vos vacances, votre santé... et bien plus encore !
            Tout cela à portée de clic et en moins de 5 minutes."
					buttonLabel="Découvrir mes aides"
					buttonHref="/mes-aides"
					imgSrc="/images/aides-au-logement.webp"
					additionalInformation={additionalInformation()} />
				<div className={classNames(styles.contentWrapper, 'background-white-lilac')}>
					<Container>
						<section className={styles.section}>
							<h2 className={styles.sectionHeading}>Découvrez vos aides :</h2>
							<ul aria-label="Vos aides">
								<li className={styles.serviceCard}>
									<ServiceCard
										logo="/images/logos/caisse-allocations-familiales.svg"
										link="https://wwwd.caf.fr/wps/portal/caffr/aidesetdemarches/mesdemarches/faireunesimulation/lelogement#/preparation"
										linkLabel="Tester mon éligibilité pour les aides au logement de la CAF"
										title="Vous dépendez du régime général ? Demandez vos aides à la CAF !"
										titleAs={'h3'}>
										La CAF signifie Caisse d’Allocation Familiales. Il y en a
										dans chaque département. Son rôle est de verser les aides
										qui concernent la famille, le logement mais aussi une partie
										des aides destinées à lutter contre la pauvreté, comme le
										RSA ou la Prime d’activité.
									</ServiceCard>
								</li>
								<li className={styles.serviceCard}>
									<ServiceCard
										logo="/images/logos/mutualite-sociale-agricole.svg"
										link="https://www.msa.fr/lfp/web/msa/logement/offre-msa"
										linkLabel="Découvrir les aides au logement de la MSA"
										title="Vous dépendez du régime agricole ? Demandez vos aides à la MSA !"
										titleAs={'h3'}>
										La MSA signifie Mutualité Sociale Agricole, c’est le régime
										de protection sociale obligatoire pour toute personne du
										secteur agricole. Son rôle est donc de verser à tous ses
										adhérents les aides dont ils pourraient avoir besoin :
										maladie, maternité, retraite...mais aussi logement !
									</ServiceCard>
								</li>
							</ul>
						</section>
					</Container>
				</div>
			</main>
		</>
	);
}

function additionalInformation() {
	return (
		<div className={styles.additionalInfo}>
			<Icon name="information" />
			<span>Avant de démarrer la simulation de vos aides, pensez à vous munir de vos ressources et de celles de vos
        parents si vous êtes encore à leur charge.</span>
		</div>
	);
}
