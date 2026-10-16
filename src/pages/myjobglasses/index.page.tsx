import Script from 'next/script';
import { useState } from 'react';

import { Head } from '~/client/components/head/Head';
import { Container } from '~/client/components/layouts/Container/Container';
import { LightHero, LightHeroPrimaryText, LightHeroSecondaryText } from '~/client/components/ui/Hero/LightHero';

import styles from './index.module.scss';

export default function MyJobGlassesPage() {
	const [rerender] = useState(() => Date.now());

	return (
		<>
			<Head
				title="Échanger avec des professionnels | 1jeune1solution"
				description="Échanger avec des professionels du métier de votre choix"
				robots="index,follow" />
			<main id="contenu">
				<LightHero>
					<h1>
						<LightHeroPrimaryText>Échangez avec des professionnels</LightHeroPrimaryText>
						<LightHeroSecondaryText>avec <i>My Job Glasses</i></LightHeroSecondaryText>
					</h1>
				</LightHero>
				<Container>
					<p className={styles.description}>
						Un réseau professionnel à votre disposition&nbsp;: <b><i>1Jeune1Solution</i></b> s&apos;est associé à <b><i>My Job Glasses</i></b> pour
						vous permettre de découvrir les métiers grâce à un réseau de <strong>plus de 82&nbsp;000
						professionnels</strong> qui se rendent disponibles pour répondre à toutes vos questions sur leur métier. Ce service
						est <strong>gratuit</strong> et disponible pour tous, sans condition d&apos;âge. Rien de tel que d&apos;échanger avec une
						personne qui vous présentera son métier, son environnement professionnel et son parcours pour vous aider
						dans votre choix d&apos;orientation !
					</p>
				</Container>
				<div suppressHydrationWarning id="widget-my-job-glasses"></div>

				<Script async
					strategy="afterInteractive"
					crossOrigin="anonymous"
					src={`https://api.myjobglasses.com/widgets/professional_search/forms?widget_div_id=widget-my-job-glasses&widget_id=6877989596f4370015e24c85&rerender=${rerender}`} />
			</main>
		</>
	);

}

export function getServerSideProps() {
	if (process.env.NEXT_PUBLIC_MY_JOB_GLASSES_FEATURE != '1')
		return { notFound: true };
	return { props: {} };
}
