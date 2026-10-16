import React from 'react';

import {
	EntreprendreOutilADisposition,
} from '~/client/components/features/Entreprendre/OutilADisposition/EntreprendreOutilADisposition';
import {
	RéseauAccompagnementList,
	RéseauÉconomieSocialeEtSolidaireList,
	RéseauFinancementList,
} from '~/client/components/features/Entreprendre/Réseau/EntreprendreReseau';
import { ServiceCard } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { Head } from '~/client/components/head/Head';
import { Container } from '~/client/components/layouts/Container/Container';
import { Accordion } from '~/client/components/ui/Accordion/Accordion';
import { HeroComponent } from '~/client/components/ui/Hero/HeroComponent';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/entreprendre/index.analytics';
import styles from '~/pages/entreprendre/index.module.scss';

export default function Entreprendre() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Les solutions pour créer une entreprise | 1jeune1solution"
				robots="index,follow" />
			<main id="contenu">
				<HeroComponent
					titlePrimaryText={(
						<span>
							<b>Je découvre les solutions qui s’offrent à moi</b>, pour créer mon entreprise…
						</span>
					)}
					titleSecondaryText={<>…quel que soit le stade de mon projet de création !</>}
					imgSrc="/images/entrepreneurs.webp">
					<ol className={styles.phases} aria-label="stades projet de création">
						<li className={styles.phasesCard}>
							<b>Ante-création</b>
							<span>Etudier le marché et construire le business plan</span>
						</li>
						<li className={styles.phasesCard}>
							<b>Test</b>
							<span>Tester son idée au contact du marché</span>
						</li>
						<li className={styles.phasesCard}>
							<b>Post-création</b>
							<span>Accompagnement dans les premières années suivant la création</span>
						</li>
					</ol>
				</HeroComponent>
				<div className={styles.réseaux}>
					<Container>
						<h2 className={styles.réseauxHeader}>
							Découvrez les différents réseaux d’accompagnement suivant votre besoin et le stade d’avancement de votre
							projet
						</h2>

						<div className={styles.réseauxContent}>
							<Accordion summary="Je cherche à être accompagné" summaryAs="h3">
								<RéseauAccompagnementList />
							</Accordion>
							<Accordion summary="Je cherche à financer mon projet" summaryAs="h3">
								<RéseauFinancementList />
							</Accordion>
							<Accordion summary="Je lance un projet dans l’Economie sociale et solidaire" summaryAs="h3">
								<RéseauÉconomieSocialeEtSolidaireList />
							</Accordion>
						</div>
					</Container>
				</div>

				<div className={styles.outilsADisposition}>
					<Container>
						<h2 className={styles.outilsADispositionHeader} id="outilsADispositionTitle">
							Des outils à votre disposition
						</h2>
						<ul className={styles.outilsADispositionList} aria-labelledby="outilsADispositionTitle">
							<li>
								<EntreprendreOutilADisposition
									link="https://bpifrance-creation.fr/encyclopedie/previsions-financieres-business-plan/business-plan/faire-son-business-plan"
									linkLabel="Construire mon Business Plan"
									description="Construisez votre Business Plan, gratuitement en ligne" />
							</li>
							<li>
								<EntreprendreOutilADisposition
									link="https://jesuisentrepreneur.fr/mon-etude-de-marche"
									linkLabel="Faire mon étude de marché"
									description="Découvrez les tendances et les chiffres de votre marché" />
							</li>
							<li>
								<EntreprendreOutilADisposition
									link="https://bpifrance-creation.fr/boiteaoutils/infographie-entrepreneurs-trouvez-bon-reseau-daccompagnement-vos-besoins"
									linkLabel="Me faire accompagner"
									description="Trouvez le réseau d’accompagnement qui correspond à vos besoins" />
							</li>
							<li>
								<EntreprendreOutilADisposition
									link="https://www.initiative-france.fr/espace-info/vie-du-reseau/426-mon-kit-entrepreneur-notre-nouvelle-application-mobile.html"
									linkLabel="Découvrir Mon kit entrepreneur"
									description="Découvrez Mon kit entrepreneur, l’application mobile pour créer son entreprise" />
							</li>
						</ul>
					</Container>
				</div>

				<div className={styles.marseille}>
					<Container>
						<h2 className={styles.marseilleHeader}>Découvrez l’ensemble des opportunités offertes par l’éco-système
							marseillais</h2>

						<ServiceCard
							link="https://entreprendreamarseille.fr/prendre-un-rendez-vous/"
							linkLabel="Prendre rendez-vous pour exposer son projet"
							logo="/images/entreprendre/région-sud.png"
							logoAlt="Région Sud, Provence Alpes Côte d'Azur. Gourvenement, Liberté, Égalité, Fraternité"
							title="Vous avez moins de 30 ans, habitez Marseille et souhaitez créer votre entreprise ?"
							titleAs={'h3'}>
							Dans le cadre de l’initiative “Marseille en grand” lancée par le
							Président de la République le 2 septembre 2021, l’Etat et la
							région Sud se mobilisent pour soutenir la création d’entreprises à
							Marseille notamment avec l’ouverture des Carrefours de
							l’entreprenariat.
						</ServiceCard>
					</Container>
				</div>
			</main>
		</>
	);
}
