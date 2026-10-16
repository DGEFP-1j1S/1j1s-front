import classNames from 'classnames';
import React from 'react';

import styles from '~/client/components/features/Entreprendre/Réseau/EntreprendreReseau.module.scss';
import {
	EntreprendreRéseauPhasesProjet,
} from '~/client/components/features/Entreprendre/Réseau/PhasesProjet/EntreprendreRéseauPhasesProjet';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { Image } from '~/client/components/ui/Img';
import { Link } from '~/client/components/ui/Link/Link';

interface Entreprise {
  logo: string
  lien: string
  nom: string
  description: string
  tagline?: string
}

export interface Phases {
  anteCréation: boolean
  test: boolean
  postCréation: boolean
}

export interface EntreprendreRéseauProps {
  entreprise: Entreprise
  phases: Phases
  publicConcerné?: string
}

function EntreprendreReseau(props: EntreprendreRéseauProps) {
	const { entreprise, phases, publicConcerné } = props;

	return (
		<Link href={entreprise.lien} className={classNames(styles.card, 'underline-none')} prefetch={false}>
			<div className={classNames(styles.logoWrapper, styles.cardHeader)}>
				<Image alt="" src={entreprise.logo} width={120} height={120}  />
			</div>
			<div className={classNames(styles.infoEntreprise, styles.cardHeader)}>
				<div className={styles.infoEntrepriseTitle}>{entreprise.nom}</div>
				{ entreprise.tagline && <div className={styles.infoEntrepriseSubTitle}>{entreprise.tagline}</div> }
			</div>
			<div className={styles.cardDescription}>
				<p className={styles.descriptionEntreprise}>{entreprise.description}</p>
				<EntreprendreRéseauPhasesProjet phases={phases} />
				{publicConcerné && <p className={styles.descriptionPublicConcerne}>{publicConcerné}</p>}
				<span className={styles.callToAction}>Découvrir<Icon name={'external-redirection'} /></span>
			</div>
		</Link>
	);
}

interface EntreprendreRéseauListProps extends React.HTMLAttributes<unknown> {
  réseauList: EntreprendreRéseauProps[]
}

function EntreprendreRéseauList({ réseauList, ...rest }: EntreprendreRéseauListProps ) {
	return (
		<ul className={styles.réseauList} {...rest}>
			{réseauList.map((réseau) => (
				<li key={réseau.entreprise.nom}>
					<EntreprendreReseau
						entreprise={réseau.entreprise}
						phases={réseau.phases}
						publicConcerné={réseau.publicConcerné} />
				</li>
			))}
		</ul>
	);
}

const RÉSEAU_ACCOMPAGNEMENT: EntreprendreRéseauProps[] = [{
	entreprise: {
		description: 'Créé en 1979, BGE est un réseau national d‘aide à la création- reprise d‘entreprises. Il conseille et forme les entrepreneurs depuis l‘émergence de l‘idée jusqu‘au développement de l‘entreprise. Le réseau compte 530 lieux d‘accueil sur tout le territoire français, y compris l‘outre-mer, animés par un réseau de 1200 salariés.',
		lien: 'https://www.bge.asso.fr/',
		logo: '/images/entreprendre/bge_appui_aux_entrepreneurs.png',
		nom: 'BGE Appui aux entrepreneurs',
	},
	phases: {
		anteCréation: true,
		postCréation: true,
		test: true,
	},
	publicConcerné: 'Public concerné : Tout porteur de projet de création – reprise d‘entreprise et / ou dirigeant d‘entreprise',
}, {
	entreprise: {
		description: 'Devenez entrepreneur et bénéficiez d‘un accompagnement personnalisé avec PÉPITE. Étudiant ou jeune diplômé de -de 28 ans, le statut spécial Étudiant-Entrepreneur vous apporte de nombreux avantages.',
		lien: 'https://www.pepite-france.fr/',
		logo: '/images/entreprendre/pepite_france.png',
		nom: 'Réseau PEPITE France',
	},
	phases: {
		anteCréation: true,
		postCréation: false,
		test: true,
	},
	publicConcerné: 'Public concerné : Étudiants et jeunes diplômés de -de 28 ans, bienvenue quel que soit votre parcours de formation !',
}, {
	entreprise: {
		description: 'Depuis 2008, h‘up entrepreneurs représente et accélère la réussite des entrepreneurs en situation de handicap, créateurs ou déjà en activité, grâce à la mobilisation de plus de 300 coachs et experts projet bénévoles au travers de 4 programmes d‘incubation (Déclics h‘up, Parrainage de compétences, h‘up Académie et Rebonds TIH).',
		lien: 'https://h-up.fr/entrepreneur-handicap-info-prevention-aide/',
		logo: '/images/entreprendre/hup_entrepreneurs.png',
		nom: 'h‘up entrepreneurs',
		tagline: 'L‘incubateur porteur de plaidoyer à impact, pour accélérer votre réussite quel que soit votre stade d‘avancement !',
	},
	phases: {
		anteCréation: true,
		postCréation: true,
		test: false,
	},
	publicConcerné: 'Public concerné : toute personne en situation de handicap reconnue administrativement ou fragilisée pour raisons de santé, portant une démarche entrepreneuriale quel qu‘en soit le stade d‘avancement (idéation, émergence, accélération, développement / rebonds)',
}, {
	entreprise: {
		description: 'Le Moovjee, Mouvement pour les Jeunes et les Étudiants Entrepreneurs, depuis 2009, est engagé pour soutenir l‘élan entrepreneurial des jeunes de 18 à 30 ans, les encourager à oser se lancer et les accompagner dans la construction et le développement de leur projet. Le mentorat, c‘est avoir à ses côtés sur la durée, un entrepreneur expérimenté (le mentor), qui aide à prendre du recul, permet de ne plus être seul face aux décisions et facilite l‘acquisition des bons réflexes de l‘entrepreneur. Son seul objectif est de vous voir réussir et vous épanouir en tant qu‘entrepreneur dans l‘ambition que vous vous êtes vous-même fixée, pour vous et pour votre entreprise.',
		lien: 'https://www.moovjee.fr/',
		logo: '/images/entreprendre/moovje.png',
		nom: 'Moovjee',
		tagline: 'Mouvement pour les jeunes et les étudiants entrepreneurs',
	},
	phases: {
		anteCréation: true,
		postCréation: true,
		test: false,
	},
	publicConcerné: 'Public concerné : Tous les jeunes de 18 à 30 ans, porteurs de projet ou ayant déjà lancé leur entreprise, quel que soit leur parcours de formation et le secteur d‘activité de la (future) entreprise.',
}, {
	entreprise: {
		description: 'Organisés un peu partout en France et à l‘initiative des Caisses régionales du Crédit Agricole, les Cafés de la Création sont des rencontres gratuites, conviviales et informelles, où les porteurs de projets peuvent venir poser toutes leurs questions à des experts en création d‘entreprise : avocats, conseillers professionnels, experts comptables, réseaux d‘accompagnement, Chambres professionnelles…',
		lien: 'https://propulsebyca.fr/evenements',
		logo: '/images/entreprendre/cafes_de_la_creation.png',
		nom: 'Les Cafés de la création by CA',
	},
	phases: {
		anteCréation: true,
		postCréation: false,
		test: false,
	},
	publicConcerné: 'Public concerné : Tout porteur de projet de création / reprise d‘entreprise.',
}, {
	entreprise: {
		description: 'Le réseau national des couveuses d‘entreprises et d‘activité présentes partout en France permet de tester votre projet sereinement. Bénéficiez de l‘hébergement juridique de votre activité, apprenez le métier d‘entrepreneur et développez votre entreprise en toute sécurité !',
		lien: 'https://jetestemonentreprise.com/',
		logo: '/images/entreprendre/couveuse.png',
		nom: 'Union des couveuses',
	},
	phases: {
		anteCréation: false,
		postCréation: false,
		test: true,
	},
	publicConcerné: 'Tous porteurs d‘un projet en passe d‘être finalisé, quel que soit leur âge, leur territoire ou le type de projet.',
}, {
	entreprise: {
		description: 'Programme proposé par un consortium de couveuses d‘entreprises et de coopératives d‘activité et d‘emploi (CAE). Réalisez avec la structure la plus proche de chez vous un diagnostic de votre situation, signez un contrat d‘appui pour votre projet d‘entreprise (CAPE) pour démarrer un test marché et bénéficiez d‘un accompagnement pour la mise en œuvre de votre projet.',
		lien: 'https://jetestemonentreprise.com/tester-pour-reussir/',
		logo: '/images/entreprendre/couveuse.png',
		nom: 'Tester pour réussir',
	},
	phases: {
		anteCréation: false,
		postCréation: true,
		test: true,
	},
	publicConcerné: 'Tous les jeunes à partir de 18 ans souhaitant créer leur entreprise.',
}, {
	entreprise: {
		description: 'Les Groupements de Créateurs proposent un accompagnement à l‘Émergence, pour passer de l‘idée au projet. Certains Groupements de Créateurs proposent également la Formation DUCA-Entrepreneur TPE, accessible sans le Bac, pour acquérir les compétences nécessaires à la gestion d‘une activité et élaborer son Business Plan. Le réseau regroupe une quarantaine de Groupements de Créateurs portés par des structures d‘accompagnement socio-professionnel (mission locale, maison de l‘emploi, PLIE, etc.) en partenariat avec des universités et des organismes d‘accompagnement à la création d‘activité.',
		lien: 'https://groupement-de-createurs.fr/',
		logo: '/images/entreprendre/groupement_createurs.png',
		nom: 'Les Groupements de créateurs',
	},
	phases: {
		anteCréation: true,
		postCréation: false,
		test: false,
	},
	publicConcerné: 'Personnes éloignées de l‘emploi, notamment les jeunes, ayant des envies d‘entreprendre.',
}, {
	entreprise: {
		description: 'La Ruche propose un accompagnement à la création d‘entreprise hybride mixant présentiel et distanciel : celui-ci est composé d‘une formation en ligne disponible 24h/24, d‘un suivi individuel par un professionnel de la création d‘entreprise ainsi que d‘un accompagnement collectif. Les jeunes de moins de 30 ans sont également éligibles à une prime de 3000 euros pour faciliter le lancement de leur projet.',
		lien: 'https://la-ruche.net/accompagnement/',
		logo: '/images/entreprendre/la_ruche.png',
		nom: 'La Ruche',
	},
	phases: {
		anteCréation: true,
		postCréation: false,
		test: false,
	},
	publicConcerné: 'Les jeunes de moins de 30 ans pourront être mis en relation avec un acteur du financement habilité à délivrer une prime de 3000 euros, en complément d‘un micro-crédit ou prêt facilité par ce dernier, pour une activité non immatriculée ou immatriculée depuis moins de 3 mois.',
}, {
	entreprise: {
		description: 'Rejoignez un programme gratuit d‘entraînement à l‘entrepreneuriat : entraînez-vous à créer une entreprise ou une startup en équipe multi-compétences de 3 à 5 jeunes.',
		lien: 'https://www.lesentrep.fr/',
		logo: '/images/entreprendre/les_entrep.png',
		nom: 'Les Entrep',
	},
	phases: {
		anteCréation: true,
		postCréation: false,
		test: true,
	},
	publicConcerné: 'Public concerné : Jeune post-bac, 30 ans et moins, étudiant, jeune diplômé au chômage ou issu des Quartiers Prioritaires de la Ville.',
}];

export const RÉSEAU_FINANCEMENT: EntreprendreRéseauProps[] = [{
	entreprise: {
		description: 'France Active vous conseille dans votre stratégie de financement, vous finance et vous donne accès au crédit bancaire. Si vous rencontrez des difficultés pour obtenir un financement ou si vous souhaitez vous engager dans l‘Economie sociale et solidaire, ses 35 associations territoriales (135 points d‘accueil partout en France) vous accompagnent dans votre parcours. France Active vous permettra de consolider votre projet et d‘identifier les acteurs à même de vous aider.',
		lien: 'https://www.franceactive.org/accelerer-votre-reussite/vous-etes-pret-e-s-a-creer-votre-entreprise',
		logo: '/images/entreprendre/france_active.png',
		nom: 'Le réseau France Active',
		tagline: 'Un accompagnement individualisé pour financer votre projet d‘entreprise',
	},
	phases: {
		anteCréation: true,
		postCréation: true,
		test: false,
	},
}, {
	entreprise: {
		description: 'Le réseau Initiative France vous guide pas à pas, et vous apporte gratuitement les atouts fondamentaux pour réussir votre projet d‘entreprise : des ateliers individuels et collectifs, un financement adapté par le prêt d‘honneur à taux 0, un réseau de professionnels sur votre territoire et des conseils avisés. Les entreprises soutenues par le réseau Initiative France ont neuf chances sur dix d‘être encore en activité après trois ans !',
		lien: 'https://www.initiative-france.fr/',
		logo: '/images/entreprendre/initiative_france.png',
		nom: 'Initiative France',
		tagline: 'Un réseau de 210 associations partout en France pour accompagner et financer tous les projets d‘entreprise',
	},
	phases: {
		anteCréation: true,
		postCréation: true,
		test: false,
	},
	publicConcerné: 'Public concerné : Tous les jeunes, quels que soient leur statut, leur âge, leur territoire et leur projet de création ou de reprise d‘entreprise.',
}, {
	entreprise: {
		description: 'Entreprendre, c‘est possible ! À l‘Adie, nous défendons l‘idée que chacun, même sans capital, même sans diplôme ou même jeune, peut devenir entrepreneur. Présente sur tout le territoire, l‘Adie est une association qui finance tout type d‘activité professionnelle jusqu‘à 10 000 euros, et accompagne gratuitement les créateurs d‘entreprise.',
		lien: 'https://www.adie.org/',
		logo: '/images/entreprendre/adie.png',
		nom: 'Adie',
		tagline: 'Entreprendre c‘est possible',
	},
	phases: {
		anteCréation: true,
		postCréation: true,
		test: false,
	},
	publicConcerné: 'Public concerné : Les créateurs d‘entreprise qui n‘ont pas accès au crédit bancaire et plus particulièrement les plus éloignés de l‘emploi.',
}, {
	entreprise: {
		description: 'Réseau Entreprendre propose un accompagnement d‘une durée minimum de deux ans avec des chefs d‘entreprise expérimentés pour réussir le lancement ou la reprise de son projet d‘entreprise. Le réseau propose également un accompagnement financier par le biais d‘un Prêt d‘honneur sans intérêt ni garantie. Réseau Entreprendre fédère près de 15 000 chefs d‘entreprises présents dans 10 pays dans le monde avec ses 130 implantations et 64 associations.',
		lien: 'https://www.reseau-entreprendre.org/fr/accueil/',
		logo: '/images/entreprendre/reseau_entreprendre.png',
		nom: 'Réseau Entreprendre',
		tagline: 'Une communauté de chefs d‘entreprise pour l‘accompagnement des entrepreneurs à fort potentiel.',
	},
	phases: {
		anteCréation: true,
		postCréation: true,
		test: false,
	},
	publicConcerné: 'Public concerné : Tout entrepreneur, créateur ou repreneur à fort potentiel de création d‘emploi (min. 5 emplois en 3 ans ; 5 à 10 emplois à 5 ans).',
}, {
	entreprise: {
		description: 'Le Village by CA est un réseau d‘accélérateurs de start-up qui s‘appuie sur des écosystèmes d‘innovation pour accompagner la transformation des entreprises en région. Porté par le Crédit Agricole et un panel de partenaires depuis 2014, le Village by CA, implanté au cœur des territoires, offre dans un cadre d‘open innovation, des lieux d‘échanges, rencontres business et parcours de développement répondant aux besoins des entrepreneurs. Egalement présent au Luxembourg et en Italie avec de nombreux relais à l‘international, le Village by CA est aujourd‘hui le premier accélérateur d‘innovation.',
		lien: 'https://levillagebyca.com/?utm_source=1jeune1solution.gouv&utm_medium=site&utm_campaign=accompagnement%20jeunes',
		logo: '/images/entreprendre/le_village.png',
		nom: 'Le Village by CA',
	},
	phases: {
		anteCréation: false,
		postCréation: false,
		test: true,
	},
	publicConcerné: 'Public concerné : Start-up en phase de croissance (scale-up).',
}];

export const RÉSEAU_ÉCONOMIE_SOCIALE_ET_SOLIDAIRE: EntreprendreRéseauProps[] = [{
	entreprise: {
		description: 'Pour les jeunes de moins de 30 ans, Live for Good propose un parcours de formations collectif et un coaching individualisé pour structurer et faire décoller son projet entrepreneurial.',
		lien: 'https://www.live-for-good.org/',
		logo: '/images/entreprendre/live_for_good.png',
		nom: 'Live for Good',
		tagline: '6 mois pour accélérer votre projet à impact positif.',
	},
	phases: {
		anteCréation: true,
		postCréation: false,
		test: false,
	},
	publicConcerné: 'Public concerné : Jeunes de moins de 30 ans, porteurs de projets à impact social ou environnemental.',
}, {
	entreprise: {
		description: 'Pour les étudiants, en licence, master ou doctorat, Enactus France propose des parcours d‘accompagnement et de formations pour expérimenter l‘entrepreneuriat social et le management d‘équipe, et pour développer leurs compétences et les mettre au service de la société et de la planète.',
		lien: 'https://www.enactus-etudiants.fr/inscriptions',
		logo: '/images/entreprendre/enactus.png',
		nom: 'Enactus France',
		tagline: 'Un accompagnement de 10 mois pour monter son projet à impact social ou environnemental.',
	},
	phases: {
		anteCréation: true,
		postCréation: false,
		test: false,
	},
	publicConcerné: 'Public concerné : Les jeunes ayant le statut étudiant ou étudiant-entrepreneur, qui souhaitent développer leurs compétences et rendre le monde plus juste, plus inclusif et plus durable, qu‘ils aient une envie, une idée ou un projet.',
}];

export function RéseauAccompagnementList() {
	return (
		<EntreprendreRéseauList
			réseauList={RÉSEAU_ACCOMPAGNEMENT}
			aria-label="Réseaux d‘accompagnement" />
	);
}

export function RéseauFinancementList() {
	return (
		<EntreprendreRéseauList
			réseauList={RÉSEAU_FINANCEMENT}
			aria-label="Réseaux de financement" />
	);
}

export function RéseauÉconomieSocialeEtSolidaireList() {
	return (
		<EntreprendreRéseauList
			réseauList={RÉSEAU_ÉCONOMIE_SOCIALE_ET_SOLIDAIRE}
			aria-label="Réseaux de projets dans l‘économie sociale et solidaire" />
	);
}
