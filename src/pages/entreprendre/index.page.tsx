import React from 'react';

import {
	EntreprendreOutilADisposition,
} from '~/client/components/features/Entreprendre/OutilADisposition/EntreprendreOutilADisposition';
import {
	RéseauAccompagnementList,
	RéseauÉconomieSocialeEtSolidaireList,
	RéseauFinancementList,
} from '~/client/components/features/Entreprendre/Reseau/EntreprendreReseau';
import { Accordion, Carte } from "~/client/dsfr";
import { Head } from '~/client/components/head/Head';
import { BannerWithIllustration } from "~/client/components/ui/Hero/Hero";
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/entreprendre/index.analytics';

export default function Entreprendre() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Les solutions pour créer une entreprise | 1jeune1solution"
				robots="index,follow" />
			<main id="contenu">
				<BannerWithIllustration image="/images/entrepreneurs.webp" isCover>
					<h1 className="fr-h1">
						Je découvre les solutions qui s’offrent à moi, pour créer mon entreprise… 
						quel que soit le stade de mon projet de création !
					</h1>
				</BannerWithIllustration>
				<section className="fr-container fr-py-5w">
					<div className="fr-grid-row" role="list" aria-label="stades projet de création">
						{phasesProjet.map(({ titre, description }, index) => (
							<React.Fragment key={titre}>
								{index > 0 && (
									<>
										<span className="fr-col-12 fr-hidden-md flex justify-center fr-py-1w fr-icon-arrow-down-line fr-icon--lg" aria-hidden="true" />
										<span className="fr-hidden fr-unhidden-md align-items--center fr-px-2w fr-icon-arrow-right-line fr-icon--lg" aria-hidden="true" />
									</>
								)}
								<div role="listitem" className="fr-col-12 fr-col-md">
									<div className="background--blue-light fr-p-3w height--full">
										<p className="fr-text--lg fr-text--bold fr-mb-1w">{titre}</p>
										<p className="fr-text--sm fr-mb-0">{description}</p>
									</div>
								</div>
							</React.Fragment>
						))}
					</div>
				</section>
				<section className="background--blue-light fr-py-5w">
					<div className="fr-container">
						<h2 className="fr-h3">
							Découvrez les différents réseaux d’accompagnement suivant votre besoin et le stade d’avancement de votre
							projet
						</h2>

						<div className="fr-accordions-group">
							<Accordion titre="Je cherche à être accompagné">
								<RéseauAccompagnementList />
							</Accordion>
							<Accordion titre="Je cherche à financer mon projet">
								<RéseauFinancementList />
							</Accordion>
							<Accordion titre="Je lance un projet dans l’Economie sociale et solidaire">
								<RéseauÉconomieSocialeEtSolidaireList />
							</Accordion>
						</div>
					</div>
				</section>

				<section className="fr-container fr-py-5w">
					<h2 className="fr-h3" id="outilsADispositionTitle">
						Des outils à votre disposition
					</h2>
					<ul className="fr-grid-row fr-grid-row--gutters list-style-none fr-pl-0" aria-labelledby="outilsADispositionTitle">
						<li className="fr-col-12 fr-col-md-6 fr-col-lg-3">
							<EntreprendreOutilADisposition
								link="https://bpifrance-creation.fr/encyclopedie/previsions-financieres-business-plan/business-plan/faire-son-business-plan"
								linkLabel="Construire mon Business Plan"
								description="Construisez votre Business Plan, gratuitement en ligne" />
						</li>
						<li className="fr-col-12 fr-col-md-6 fr-col-lg-3">
							<EntreprendreOutilADisposition
								link="https://jesuisentrepreneur.fr/mon-etude-de-marche"
								linkLabel="Faire mon étude de marché"
								description="Découvrez les tendances et les chiffres de votre marché" />
						</li>
						<li className="fr-col-12 fr-col-md-6 fr-col-lg-3">
							<EntreprendreOutilADisposition
								link="https://bpifrance-creation.fr/boiteaoutils/infographie-entrepreneurs-trouvez-bon-reseau-daccompagnement-vos-besoins"
								linkLabel="Me faire accompagner"
								description="Trouvez le réseau d’accompagnement qui correspond à vos besoins" />
						</li>
						<li className="fr-col-12 fr-col-md-6 fr-col-lg-3">
							<EntreprendreOutilADisposition
								link="https://www.initiative-france.fr/espace-info/vie-du-reseau/426-mon-kit-entrepreneur-notre-nouvelle-application-mobile.html"
								linkLabel="Découvrir Mon kit entrepreneur"
								description="Découvrez Mon kit entrepreneur, l’application mobile pour créer son entreprise" />
						</li>
					</ul>
				</section>

				<section className="background--blue-light fr-py-5w">
					<div className="fr-container">
						<h2 className="fr-h3">Découvrez l’ensemble des opportunités offertes par l’éco-système
							marseillais</h2>

						<Carte
							horizontal
							lien="https://entreprendreamarseille.fr/prendre-un-rendez-vous/"
							imageSrc="/images/entreprendre/région-sud.png"
							imageAlt="Région Sud, Provence Alpes Côte d'Azur. Gourvenement, Liberté, Égalité, Fraternité"
							titre="Vous avez moins de 30 ans, habitez Marseille et souhaitez créer votre entreprise ?">
							Dans le cadre de l’initiative “Marseille en grand” lancée par le
							Président de la République le 2 septembre 2021, l’Etat et la
							région Sud se mobilisent pour soutenir la création d’entreprises à
							Marseille notamment avec l’ouverture des Carrefours de
							l’entreprenariat.
						</Carte>
					</div>
				</section>
			</main>
		</>
	);
}

const phasesProjet = [
	{ description: "Etudier le marché et construire le business plan", titre: "Ante-création" },
	{ description: "Tester son idée au contact du marché", titre: "Test" },
	{ description: "Accompagnement dans les premières années suivant la création", titre: "Post-création" },
];
