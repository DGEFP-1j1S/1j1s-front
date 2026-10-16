import React from 'react';

import { Head } from '~/client/components/head/Head';
import { Container } from '~/client/components/layouts/Container/Container';
import { ArticleCard } from '~/client/components/ui/Card/Article/ArticleCard';
import { LightHero, LightHeroPrimaryText, LightHeroSecondaryText } from '~/client/components/ui/Hero/LightHero';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/logements/conseils/index.analytics';
import styles from '~/pages/logements/conseils/index.module.scss';

export default function ConseilsLogement() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Découvrir tous nos conseils logement | 1jeune1solution"
				robots="index,follow" />
			<main id="contenu">
				<Container>
					<BannièreConseilsLogement />
					<ul aria-label="Ce qu‘il faut savoir" className={styles.articleList}>
						<li>
							<ArticleCard
								imageSrc="/images/articles/documents.svg"
								imageFit="contain"
								link="/articles/comment-constituer-un-dossier-locatif"
								titleLabel="Comment constituer un dossier locatif ?"
								className={styles.articleCard}
								titleHeadingTag='h2'>
								<p>Constituer son dossier locatif peut sembler compliqué,
								surtout si c’est la première fois ! Vous vous demandez comment vous y prendre ?
								Quels documents rassembler ? Suivez le guide !</p>
							</ArticleCard>
						</li>
						<li>
							<ArticleCard
								imageSrc="/images/articles/consultative-sales.svg"
								imageFit="contain"
								link="/articles/les-garants-a-quoi-ca-sert-et-vers-qui-me-tourner"
								titleLabel="Les garants : à quoi ça sert et vers qui me tourner ?"
								className={styles.articleCard}
								titleHeadingTag='h2'>
								<p>Vous préparez votre dossier locatif et vous vous
								demandez quel est le rôle d’un garant et comment en trouver un ?
								On vous explique tout pour que vous trouviez une solution adaptée à votre situation.</p>
							</ArticleCard>
						</li>
						<li>
							<ArticleCard
								imageSrc="/images/articles/product-quality.svg"
								imageFit="contain"
								link="/articles/quelles-sont-les-aides-pour-financer-un-logement"
								titleLabel="Quelles sont les aides pour payer un logement ?"
								className={styles.articleCard}
								titleHeadingTag='h2'>
								<p>Il existe plusieurs dispositifs pour vous aider à
								financer votre loyer tous les mois et vous soutenir au moment de votre installation.
								Comment savoir à quelles aides vous pouvez accéder ? On vous dit tout !</p>
							</ArticleCard>
						</li>
					</ul>
				</Container>
			</main>
		</>
	);}

function BannièreConseilsLogement() {
	return (
		<LightHero>
			<h1>
				<LightHeroPrimaryText>Tout ce qu’il faut savoir et tous nos conseils</LightHeroPrimaryText>
				<LightHeroSecondaryText>concernant votre logement</LightHeroSecondaryText>
			</h1>
		</LightHero>
	);
}
