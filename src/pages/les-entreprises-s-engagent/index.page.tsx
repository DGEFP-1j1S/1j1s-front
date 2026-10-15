import React from 'react';

import { Head } from '~/client/components/head/Head';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/les-entreprises-s-engagent/index.analytics';
import { HeroWithButtonLink } from "~/client/components/ui/Hero/HeroWithButtonLink";

export default function LesEntreprisesSEngagent() {
	useAnalytics(analytics);
	const urlRejoindreLaMobilisation = process.env.NEXT_PUBLIC_LES_ENTREPRISES_S_ENGAGENT_URL ?? '';

	return (
		<>
			<Head
				title="Les entreprises s'engagent | 1jeune1solution"
				description="Votre entreprise recrute ou porte une initiative pour les jeunes ?"
				robots="index,follow" />
			<main id="contenu">
				<HeroWithButtonLink
					title="Votre entreprise recrute ou porte une initiative pour les jeunes ? Rejoignez la mobilisation !"
					content={heroLesEntreprisesSengagentContent()}
					buttonLabel='Rejoindre la mobilisation'
					buttonHref={urlRejoindreLaMobilisation}
					buttonLabelSecondary='Découvrir les entreprises engagées'
					buttonHrefSecondary='https://lesentreprises-sengagent.gouv.fr/les-entreprises-engagees'
					imgSrc='/icons/les-entreprises-s-engagent.svg'
					imgAlt="Les Entreprises s'engagent"
					imgContain={true} />
				<section className='fr-container fr-pb-4w'>
					<h2>
						Quels avantages à rejoindre la mobilisation pour les jeunes ?
					</h2>
					<ul>
						<li>Mettez en avant tous vos engagements pour les jeunes en créant votre page dédiée</li>
						<li>Publiez vos offres d’emploi sur la plateforme</li>
						<li>Bénéficiez d’un accompagnement par un Conseiller France Travail (rappel sous 72h)</li>
						<li>Relayez vos engagements par intermédiaire d’un kit de communication #1jeune1solution</li>
					</ul>
				</section>
			</main>
		</>
	);
}

function heroLesEntreprisesSengagentContent() {
	return(
		<>
			<b>La jeunesse est notre priorité.</b> Partout en France, des entreprises, chacune à leur échelle et selon leurs
			possibilités, cherchent ou apportent toutes sortes de solutions pour les jeunes. Rejoignez-les, et <b>bénéficiez
			de services inédits</b> : un accompagnement personnalisé si vous le souhaitez, des aides pour communiquer, etc.
		</>
	);
}
