import classNames from 'classnames';
import React from 'react';

import { Head } from '~/client/components/head/Head';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { Image } from '~/client/components/ui/Img';
import { Link } from '~/client/components/ui/Link/Link';
import SeeMoreMobileOnly from '~/client/components/ui/SeeMore/MobileOnly/SeeMoreMobileOnly';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/mentorat/index.analytics';
import styles from '~/pages/mentorat/index.module.scss';

export default function MentoratPage() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Mentorat | 1jeune1solution"
				description="Se rendre utile tout en préparant son avenir grâce aux missions de service civique"
				robots="index,follow" />
			<main id="contenu">
				<div className={styles.heading}>
					<div className={styles.headingContainer}>
						<h1 className={styles.headingContainer__Title}>
							1 jeune 1 mentor, être accompagné par un mentor pour réussir
						</h1>
						<p className={styles.headingContainer__TextContentOrange}>
							Faites la rencontre qui change tout !
						</p>
						<div className={styles.headingContainer__TextContentWrapper}>
							<div className={styles.headingContainer__TextContent}>
								<div>
									<p>
										Vous avez moins de 30 ans ?
									</p>
									<p>
										Rencontrez le mentor qui vous correspond et bénéficiez de son accompagnement régulier et de ses
										conseils pour atteindre vos objectifs : améliorer vos résultats scolaires, définir votre
										orientation, trouver vos premières expériences professionnelles…
									</p>
								</div>
								<div className={styles.linkAsButtonWrapper}>
									<Link href="https://www.1jeune1mentor.fr/formulaire?1jeune1solution" appearance="asPrimaryButton">
										Trouver mon mentor
										<Link.Icon />
									</Link>
								</div>
							</div>
							<div className={styles.headingContainer__TextContent}>
								<div>
									<p>Vous voulez devenir mentor ?</p>
									<p>
										Embarquez dans une aventure humaine hors du commun, pour partager votre expérience, favoriser
										l‘égalité des chances et continuer à apprendre en accompagnant un jeune
									</p>
								</div>
								<div className={styles.linkAsButtonWrapper}>
									<Link href="/je-deviens-mentor" appearance="asPrimaryButton">Devenir mentor<Link.Icon /></Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className={classNames(styles.contentContainerOnPrimary)}>
					<article className={styles.QuestCeQueMentoratWrapper}>
						<div className={styles.QuestCeQueMentoratContent}>
							<h1>Qu’est-ce que le mentorat ?</h1>
							<p>Le mentorat, c’est l’accompagnement individuel bénévole d’un jeune par un mentor, qui peut aussi bien
								être lycéen qu’étudiant, actif ou retraité. Le “binôme” que forment le mentor et le jeune se rencontre
								plusieurs fois par mois (pendant au moins 6 mois) pour répondre aux objectifs du mentoré selon son âge
								et ses besoins. Le binôme est encadré par une structure, le plus souvent une association, qui offre un
								cadre sécurisé pour chacun.</p>
						</div>
					</article>
				</div>

				<div className={classNames(styles.contentContainer)}>
					<article className={styles.RaisonParticipationMentoratWrapper}>
						<div className={styles.RaisonParticipationMentoratContent}>
							<div className={styles.RaisonParticipationMentoratContent__Title}>
								<h1>Pourquoi participer à l’aventure du mentorat ?</h1>
							</div>
							<SeeMoreMobileOnly
							  numberOfVisibleItems={0}
								itemList={[<RaisonParticipationsMentorat key={0} />]}
								seeLessAriaLabel={'Voir moins de raisons de participer au mentorat'}
								seeMoreAriaLabel={'Voir plus de raisons de participer au mentorat'}>
								<RaisonParticipationsMentorat />
							</SeeMoreMobileOnly>
						</div>
						<Image
							src="/illustrations/aventure-du-mentorat.svg"
							alt=""
							width={490}
							height={370} />
					</article>
				</div>
			</main>
		</>
	);
}

function RaisonParticipationsMentorat() {
	return (
		<section className={styles.RaisonParticipationMentoratContainer}>
			<ul aria-label="Raisons de participation au Mentorat">
				<li className={styles.RaisonParticipationMentoratElement}>
					<div className={styles.RaisonParticipationMentoratElement__Title}>
						<Icon name="arrow-right" />
						<p>J’ai des difficultés à l’école</p>
					</div>
					<p>Votre mentor pourra vous aider à organiser votre travail et à améliorer vos résultats scolaires</p>
				</li>
				<li className={styles.RaisonParticipationMentoratElement}>
					<div className={styles.RaisonParticipationMentoratElement__Title}>
						<Icon name="arrow-right" />
						<p>Je ne sais pas quelle orientation choisir</p>
					</div>
					<p>Votre mentor pourra vous conseiller et vous guider</p>
				</li>
				<li className={styles.RaisonParticipationMentoratElement}>
					<div className={styles.RaisonParticipationMentoratElement__Title}>
						<Icon name="arrow-right" />
						<p>Je cherche un stage, une alternance, un premier emploi</p>
					</div>
					<p>Votre mentor pourra vous aider et vous ouvrir son réseau professionnel</p>
				</li>
			</ul>
		</section>
	);
}
