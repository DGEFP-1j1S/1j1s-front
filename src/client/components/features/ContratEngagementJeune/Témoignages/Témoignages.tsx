import portraitKévin from 'public/images/CEJ/vignette-kevin.jpg';
import portraitLatifa from 'public/images/CEJ/vignette-latifa.jpg';
import React from 'react';

import styles from '~/client/components/features/ContratEngagementJeune/Témoignages/Témoignages.module.scss';
import { Image } from '~/client/components/ui/Img';
import SeeMoreMobileOnly from '~/client/components/ui/SeeMore/MobileOnly/SeeMoreMobileOnly';

export function Témoignages() {
	return (
		<>
			<TémoignageKévin />
			<TémoignageLatifa />
		</>
	);
}

function TémoignageKévin() {
	return (
		<section className={styles.témoignage}>
			<article>
				<h2>Ce que le Contrat d‘Engagement Jeune proposera à Kévin</h2>
				<div className={styles.portrait}>
					<Image src={portraitKévin} alt="" />
				</div>
				<div className={styles.bio}>
					<p>Kévin, 18 ans</p>
					<p>Sans diplôme et sans aucune ressource financière, il pourra bénéficier du Contrat d‘Engagement Jeune.</p>
				</div>

				<Programme>
					<h3>Son programme :</h3>
					<ul aria-label="Programme de Kévin">
						<li>
							3 mois dans sa Mission Locale avec son conseiller qui lui proposera des ateliers collectifs pour
							travailler sur son projet professionnel et effectuer des stages en entreprise en bénéficiant d‘une
							allocation de 561,68 euros par mois.
						</li>
						<li>
							Intéressé par le sport, il pourra ensuite faire un service civique de 8 mois dans une association
							qui propose des activités sportives à des jeunes en difficulté.
						</li>
						<li>
							Pour finir, avant de se lancer sur le marché du travail, il retournera dans sa Mission Locale
							pendant 1 mois pour préparer des entretiens d‘embauche avec son conseiller et démarcher des entreprises.
						</li>
						<li>
							<b>Objectif :</b> à la fin de son programme, Kévin aura trouvé un emploi dans un domaine dans lequel il
							s‘épanouit.
						</li>
					</ul>
				</Programme>
			</article>
		</section>
	);
}

function TémoignageLatifa() {
	return (
		<section className={styles.témoignage}>
			<article>
				<h2>Ce que le Contrat d‘Engagement Jeune proposera à Latifa</h2>
				<div className={styles.portrait}>
					<Image src={portraitLatifa} alt="" />
				</div>
				<div className={styles.bio}>
					<p>Latifa, 22 ans</p>
					<p>Diplômée d‘un CAP gestion, sans emploi et sans aucune ressource financière, elle pourra bénéficier du
						Contrat d‘Engagement Jeune.</p>
				</div>
				<Programme>
					<h3>Son programme :</h3>
					<ul aria-label="Programme de Latifa">
						<li>
							Un parcours de 9 mois construit avec son conseiller France Travail, dont 6 mois d‘accompagnement intensif
							avec des séances individuelles, des ateliers collectifs et des immersions en entreprise pour découvrir des
							métiers.
						</li>
						<li>
							Elle bénéficiera d‘une allocation de 561,68 euros par mois, car elle n‘a pas de ressources financières.
						</li>
						<li>
							Après cette période et la découverte d‘un métier qui l‘intéresse, elle pourra se former encore pendant 3
							mois en prépa apprentissage.
						</li>
						<li>
							<b>Objectif :</b> elle pourra candidater à un contrat en apprentissage dans une entreprise.
						</li>
					</ul>
				</Programme>
			</article>
		</section>
	);
}

function Programme({ children }: React.PropsWithChildren) {
	const programme = React.createElement('div', { className: styles.programme }, children);

	return (
		<SeeMoreMobileOnly
			className={styles.programmeSeeMore}
			numberOfVisibleItems={0}
			itemList={[programme]}
			seeMoreLabel="Découvrez son programme et ce que le CEJ lui apporte"
			seeLessAriaLabel={'Voir moins de témoignages'}
			seeMoreAriaLabel={'Voir plus de témoignages'}>
			{programme}
		</SeeMoreMobileOnly>
	);
}
