import { GetStaticPropsResult } from 'next';
import communitySvg from 'public/images/dsfr/community.svg';
import documentSvg from 'public/images/dsfr/document.svg';
import ecosystemSvg from 'public/images/dsfr/ecosystem.svg';
import houseSvg from 'public/images/dsfr/house.svg';
import schoolSvg from 'public/images/dsfr/school.svg';
import mentalDisabilitiesSvg from 'public/images/dsfr/mental-disabilities.svg';
import React from 'react';

import { Image } from '~/client/components/ui/Img';

import { Head } from '~/client/components/head/Head';
import { Container } from '~/client/components/layouts/Container/Container';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { Link } from '~/client/components/ui/Link/Link';
import SeeMoreItemList from '~/client/components/ui/SeeMore/SeeMoreItemList';
import { Carte } from '~/client/dsfr';
import useAnalytics from '~/client/hooks/useAnalytics';
import { useDependency } from "~/client/context/dependenciesContainer.context";
import { EvenementAnalyticsService } from "~/client/services/analytics/analytics.service";
import { Actualite } from '~/server/actualites/domain/actualite';
import { isFailure } from '~/server/errors/either';
import { dependencies } from '~/server/start';
import { LBA_CANDIDAT_URL } from '~/shared/lbaLandingUrls';
import BannieresCampagnes from '~/client/components/features/BannieresCampagnes'

import analytics from './index.analytics';
import styles from './index.module.scss';


interface CardContent {
	children: React.JSX.Element
	imageUrl: string
	link: string
	title: string
}

interface AccueilPageProps {
	actualites: Array<Actualite>
}

export default function Accueil(accueilProps: AccueilPageProps) {
	useAnalytics(analytics);
	const evenementAnalyticsService = useDependency<EvenementAnalyticsService>("evenementAnalyticsService");

	const isJobEteCardVisible = process.env.NEXT_PUBLIC_JOB_ETE_FEATURE === '1';
	const isFormationsInitalesVisible = process.env.NEXT_PUBLIC_FORMATIONS_INITIALES_FEATURE === '1';
	const isStages3eEt2deVisible = process.env.NEXT_PUBLIC_STAGES_3EME_FEATURE === '1';
	const is1Jeune1PermisVisible = process.env.NEXT_PUBLIC_1JEUNE1PERMIS_FEATURE === '1';
	const isMyJobGlassesVisible = process.env.NEXT_PUBLIC_MY_JOB_GLASSES_FEATURE === '1';

	const isOldEspaceJeuneActif = process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE === '1';

	const actualitesCardListContent: CardContent[] = accueilProps.actualites.map((carte: Actualite): CardContent => {
		return {
			children: <>{carte.extraitContenu}</>,
			imageUrl: carte.bannière?.src || "",
			link: carte.link,
			title: carte.titre,
		};
	});

	const offreCardListContent: CardContent[] = [
			{
			children: <>Plus de 300 000 offres d’emplois sélectionnées spécialement pour vous</>,
			imageUrl: '/images/emploi.webp',
			link: '/emplois',
			title: 'Emplois',
		},
		{
			children: <>Plus de 20 000 offres de stages sélectionnées spécialement pour vous</>,
			imageUrl: '/images/stage.webp',
			link: '/stages',
			title: 'Stages d’études',
		},
		isStages3eEt2deVisible ? {
			children: <>Des milliers d’entreprises prêtes à vous accueillir pour votre stage de 3e et 2de</>,
			imageUrl: "/images/stages-3eme/stages-3eme.webp",
			link: "/stages-3e-et-2de",
			title: "Stages de 3e et 2de",
		} : undefined,
		{
			children: <>Trouvez votre entreprise pour concrétiser vos projets d’alternance</>,
			imageUrl: "/images/alternance.webp",
			link: LBA_CANDIDAT_URL,
			title: "Contrats d’alternance",
		},
		isJobEteCardVisible ?
			{
				children: <>Des milliers d‘offres de jobs d‘été sélectionnées pour vous (durée maximale de 2 mois)</>,
				imageUrl: "/images/jobs-ete.webp",
				link: "/jobs-ete",
				title: "Jobs d’été",
			} : undefined,
		{
			children: <>Plus de 10 000 offres d’emploi compatibles avec vos études (moins de 15h par semaine)</>,
			imageUrl: "/images/jobs-étudiant.webp",
			link: "/jobs-etudiants",
			title: "Jobs étudiants",
		},
		{
			children: <>Retrouvez des offres d’emploi, des stages, des VIE | VIA et des aides financières pour une expérience en Europe</>,
			imageUrl: "/images/europe.webp",
			link: "/europe",
			title: "Expérience en Europe",
		},
	].filter<CardContent>((cardContent?: CardContent): cardContent is CardContent => cardContent !== undefined);

	const formationEtOrientationCardListContent: CardContent[] = [
		isFormationsInitalesVisible ? {
			children: <>Plus de 6 000 formations accessibles pour réaliser votre projet et trouver un emploi</>,
			imageUrl: "/images/formations-initiales.webp",
			link: "/formations-initiales",
			title: "Formations initiales",
		} : undefined,
		{
			children: <>Plus de 40 000 formations accessibles pour réaliser votre projet et trouver un emploi</>,
			imageUrl: "/images/formations-apprentissage.webp",
			link: "/formations/apprentissage",
			title: "Formations en apprentissage",
		},
		{
			children: <>Parcourez plus de 700 fiches métiers et trouvez celui qui vous correspond</>,
			imageUrl: "/images/métiers.webp",
			link: "/decouvrir-les-metiers",
			title: "Découvrir les métiers",
		},
		{
			children: <>Des centaines d’événements de recrutement pour tous les jeunes, partout en France</>,
			imageUrl: "/images/évènements.webp",
			link: "/evenements",
			title: "Participer à des évènements",
		},
	].filter<CardContent>((cardContent?: CardContent): cardContent is CardContent => cardContent !== undefined);

	const engagementEtBenevolatCardListContent: CardContent[] = [
		{
			children: <>Réalisez une mission d’engagement civique courte auprès d’organisations publiques ou associatives</>,
			imageUrl: "/images/bénévolat.webp",
			link: "/benevolat",
			title: "Bénévolat",
		},
		{
			children: <>Réalisez une mission citoyenne de 6 à 12 mois donnant le droit à une indemnisation</>,
			imageUrl: "/images/service-civique.webp",
			link: "/service-civique",
			title: "Service civique",
		},
	];

	const logementCardListContent: CardContent[] = [
		{
			children: <>Trouvez votre logement étudiant ou votre location jeune actif partout en France</>,
			imageUrl: "/images/logement-annonces.webp",
			link: "/logements/annonces",
			title: "Annonces",
		},
		{
			children: <>Découvrez les aides auxquelles vous avez droit pour votre logement</>,
			imageUrl: "/images/logement-aides-financieres.webp",
			link: "/logements/aides-logement",
			title: "Aides financières au logement",
		},
		{
			children: <>Découvrez tous nos conseils sur les logements : dossier locatif, garants...</>,
			imageUrl: "/images/logement-conseils.webp",
			link: "/logements/conseils",
			title: "Découvrir tous nos conseils",
		},
	];

	const accompagnementCardListContent: CardContent[] = [
		isMyJobGlassesVisible ? {
			children: <>82 000 professionnels se rendent disponibles pour répondre à vos questions sur leur métier</>,
			imageUrl: "/images/myjobglasses.webp",
			link: "/myjobglasses",
			title: "J’échange avec un professionnel",
		} : undefined,
		{
			children: <>Un parcours personnalisé pour vous aider à définir votre projet et trouver un emploi</>,
			imageUrl: "/images/cej.webp",
			link: "/contrat-engagement-jeune",
			title: "Contrat d’Engagement Jeune (CEJ)",
		},
		{
			children: <>Une association vous recontacte pour vous proposer le programme de mentorat adapté à vos besoins</>,
			imageUrl: "/images/mentorat.webp",
			link: "/mentorat",
			title: "Echanger avec un mentor",
		},
		{
			children: <>Retrouvez les structures proches de chez vous pouvant vous aider dans vos démarches ou votre parcours</>,
			imageUrl: "/images/accompagnement-structure.webp",
			link: "/accompagnement",
			title: "Trouver une structure d’accompagnement",
		},
		{
			children: <>Retrouvez les conseils, outils et structures d’accompagnement pour vous aider à entreprendre</>,
			imageUrl: "/images/entrepreneurs.webp",
			link: "/entreprendre",
			title: "Entreprendre : financements, aides et accompagnement",
		},
	].filter<CardContent>((cardContent?: CardContent): cardContent is CardContent => cardContent !== undefined);

	const aideEtOutilCardListContent: CardContent[] = [
		{
			children: <>Avec Aides Jeunes, trouvez les aides auxquelles vous avez droit : logement, santé, mobilité, emploi, culture, etc.</>,
			imageUrl: "/images/aides-financières.webp",
			link: "/mes-aides",
			title: "Simulateur d’aides financières",
		},
		is1Jeune1PermisVisible ? {
			children: <>Découvrez les aides auxquelles vous avez droit pour passer votre permis de conduire</>,
			imageUrl: "/images/1jeune1permis.webp",
			link: "/1jeune1permis",
			title: "Aides au permis de conduire",
		} : undefined,
		{
			children: <>Mettez en avant vos compétences dans un CV, même si vous pensez ne pas avoir d’expérience</>,
			imageUrl: "/images/créer-son-cv.webp",
			link: "/creer-mon-cv",
			title: "Je crée mon CV personnalisé",
		},
	].filter<CardContent>((cardContent?: CardContent): cardContent is CardContent => cardContent !== undefined);


	const getCardList = (cardListContent: CardContent[]) => {
		return cardListContent.map((card, index) => (
			<Carte
				key={index}
				className={styles.card}
				titre={card.title}
				lien={card.link}
				imageSrc={card.imageUrl}
			>
				{card.children}
			</Carte>
		));
	};


	return (
		<>
			<Head
				title="Toutes les solutions pour l'avenir des jeunes | 1jeune1solution"
				robots="index,follow" />
			<main id="contenu" className={styles.accueil}>
				<div className="fr-container">
					<div className={`${styles.homeBanner} fr-grid-row fr-grid-row--gutters align-items--center`}>
						<div className="fr-col-lg-6 fr-col-12 fr-py-4w">
							<h1>À chacun<br/> sa solution</h1>
							<p>Vous avez entre 15 et 30 ans ? Découvrez toutes les solutions pour votre avenir !</p>
							{ isOldEspaceJeuneActif && 
								<Link href='/espace-jeune' className='fr-btn'>
									Voir toutes les actualités
								</Link>
							}
						</div>
						<div className="fr-col-lg-6 fr-col-12 fr-hidden fr-unhidden-lg fr-pl-0">
							<Image src="/images/accueil-banner.png" alt="" width={662} height={382} className='img-cover' />
						</div>
					</div>
				</div>
				<section className="background--employeur border-top--employeur fr-mb-3v">
					<div className="fr-container">
						<div className="fr-grid-row fr-grid-row--no-gutters align-items--center">
							<div className="fr-col-12 fr-col-lg-6 fr-hidden fr-unhidden-lg">
								<Image src="/images/banner-alternance-handshake.png" alt="" width={660} height={330} className="img-cover"/>
							</div>
							<div className="fr-col-12 fr-col-lg-6 fr-p-4w">
								<h2 className="text--blue">Employeurs : Trouvez vos futurs apprentis sur 1jeune1solution</h2>
								<p>Déposez gratuitement vos offres en apprentissage et gagnez en visibilité auprès des jeunes en recherche d’une opportunité</p>
								<div className="fr-grid-row fr-grid-row--center">
									<Link className="fr-btn " onClick={() => evenementAnalyticsService.envoyerEvenement({ action: "clic", categorie: "accueil", nom: "deposer_une_offre_lba" })} href="https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution?utm_source=1j1s&utm_medium=website&utm_campaign=landinglba1j1s">Déposer une offre</Link>
								</div>
							</div>
						</div>
					</div>
				</section>
				
				<BannieresCampagnes />
				{!isOldEspaceJeuneActif && actualitesCardListContent.length > 0
					&& (
						<section className={styles.section}>
							<h2 id="actualites" className={styles.sectionHeader}>
								<Icon name="newspaper" className={styles.headerIcon} />
							Actualités
							</h2>
							<Container className={styles.sectionListeActualites}>
								<ul>
									{getCardList(actualitesCardListContent).map((carte, index) => {
										return ( <li key={index}>{carte}</li> );},
									)}
								</ul>
								<Link href={'/actualites'} appearance={'asSecondaryButton'}>
								Voir toutes les actualités
									<Link.Icon />
								</Link>
							</Container>
						</section>
					)
				}
				<div className="fr-container">
					<section className='fr-py-5v'>
						<h2 id="offres" className="fr-h2 text--blue flex align-items--center fr-mb-2w">
							<Image src={documentSvg} alt="" width={64} height={64} className='fr-mr-2w' />
							Offres
						</h2>
							<SeeMoreItemList
								itemList={getCardList(offreCardListContent)}
								numberOfVisibleItems={3}
								seeMoreAriaLabel={'Voir plus de résultats sur les offres d‘emplois'}
								seeLessAriaLabel={'Voir moins de résultats sur les offres d‘emplois'} 
								colClass='fr-col-12 fr-col-md-6 fr-col-lg-4'
							/>
					</section>
					
					<section className="background--blue-light fr-my-5v">
						<div className="fr-grid-row fr-grid-row--no-gutters align-items--center">
							<div className="fr-col-12 fr-col-lg-6 fr-p-4w">
								<h2 className="text--blue">Trouvez votre alternance</h2>
								<p>Avec la bonne alternance, accédez à 38 000 offres d’apprentissage et trouvez celle qui vous correspond. Déjà 6 000 offres déposées et 4 000 candidatures pour vous aider à passer à l’action.</p>
								<div className="fr-grid-row fr-grid-row--center">
									<Link className="fr-btn" onClick={() => evenementAnalyticsService.envoyerEvenement({ action: "clic", categorie: "accueil", nom: "consulter_les_offres_lba" })} href="https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution?utm_source=1j1s&utm_medium=website&utm_campaign=landinglba1j1s">Consulter les offres</Link>
								</div>
							</div>
							<div className={`${styles.bgConsultation} fr-col-12 fr-col-lg-6 fr-hidden fr-unhidden-lg`}>
							</div>
						</div>
					</section>

					<section className='fr-py-5v'>
						<h2 id="formation" className="fr-h2 text--blue flex align-items--center fr-mb-2w">
							<Image src={schoolSvg} alt="" width={64} height={64}  className='fr-mr-2w' />
							Formations et orientation
						</h2>
							<SeeMoreItemList
								itemList={getCardList(formationEtOrientationCardListContent)}
								numberOfVisibleItems={3}
								seeMoreAriaLabel={'Voir plus de résultats sur les formations et orientation'}
								seeLessAriaLabel={'Voir moins de résultats sur les formations et orientation'}
								colClass='fr-col-12 fr-col-md-6 fr-col-lg-4'
							/>
					</section>
					<section className='fr-py-5v'>
						<h2 id="engagement-benevolat" className="fr-h2 text--blue flex align-items--center fr-mb-2w">
							<Image src={communitySvg} alt="" width={64} height={64}  className='fr-mr-2w' />
							Engagement
						</h2>
							<SeeMoreItemList
								itemList={getCardList(engagementEtBenevolatCardListContent)}
								numberOfVisibleItems={3}
								seeMoreAriaLabel={'Voir plus de résultats sur les engagements et bénévolats'}
								seeLessAriaLabel={'Voir moins de résultats sur les engagements et bénévolats'}
								colClass='fr-col-12 fr-col-md-6 fr-col-lg-4'
							/>
					</section>
					<section className='fr-py-5v'>
						<h2 id="logement" className="fr-h2 text--blue flex align-items--center fr-mb-2w">
							<Image src={houseSvg} alt="" width={64} height={64}  className='fr-mr-2w' />
							Logement
						</h2>
						<SeeMoreItemList
							itemList={getCardList(logementCardListContent)}
							numberOfVisibleItems={3}
							seeMoreAriaLabel={'Voir plus de résultats sur les logements'}
							seeLessAriaLabel={'Voir moins de résultats sur les logements'}
							colClass='fr-col-12 fr-col-md-6 fr-col-lg-4'
						/>
					</section>
					<section className='fr-py-5v'>
						<h2 id="aides-orientation-accompagnement" className="fr-h2 text--blue flex align-items--center fr-mb-2w">
							<Image src={mentalDisabilitiesSvg} alt="" width={64} height={64}  className='fr-mr-2w' />
							Accompagnement
						</h2>
						<SeeMoreItemList
							itemList={getCardList(accompagnementCardListContent)}
							numberOfVisibleItems={3}
							seeMoreAriaLabel={'Voir plus de résultats sur les aides et accompagnements'}
							seeLessAriaLabel={'Voir moins de résultats sur les aides et accompagnements'}
							colClass='fr-col-12 fr-col-md-6 fr-col-lg-4'
						/>
					</section>				
					<section className='fr-py-5v'>
						<h2 id="aides-et-outils" className="fr-h2 text--blue flex align-items--center fr-mb-2w">
							<Image src={ecosystemSvg} alt="" width={64} height={64}  className='fr-mr-2w' />
							Aides et outils
						</h2>
						<SeeMoreItemList
							itemList={getCardList(aideEtOutilCardListContent)}
							numberOfVisibleItems={3}
							seeMoreAriaLabel={'Voir plus de résultats sur les aides et outils'}
							seeLessAriaLabel={'Voir moins de résultats sur les aides et outils'}
							colClass='fr-col-12 fr-col-md-6 fr-col-lg-4'
						/>
					</section>
				</div>
			</main>
		</>
	);
};

export async function getStaticProps(): Promise<GetStaticPropsResult<AccueilPageProps>> {
	const doitAfficherActualitesSurAccueil = process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE === '0';
	if (!doitAfficherActualitesSurAccueil) {
		return {
			props: { actualites: [] },
			revalidate: dependencies.cmsDependencies.duréeDeValiditéEnSecondes(),
		};
	}

	const cartesActualitesResponse = await dependencies.actualitesDependencies.consulterActualitesEchantillonUseCase.handle();

	if (isFailure(cartesActualitesResponse)) {
		return { notFound: true, revalidate: 1 };
	}

	return {
		props: { actualites: JSON.parse(JSON.stringify(cartesActualitesResponse.result)) },
		revalidate: dependencies.cmsDependencies.duréeDeValiditéEnSecondes(),
	};
}
