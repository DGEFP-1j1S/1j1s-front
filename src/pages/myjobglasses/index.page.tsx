import Script from 'next/script';
import React, { useState } from 'react';

import { Head } from '~/client/components/head/Head';
import { Banner } from '~/client/components/ui/Hero/Hero';

export default function MyJobGlassesPage() {
	const [rerender] = useState(() => Date.now());

	return (
		<>
			<Head
				title="Échanger avec des professionnels | 1jeune1solution"
				description="Échanger avec des professionels du métier de votre choix"
				robots="index,follow" />
			<main id="contenu">
				<Banner>
					<h1 className="fr-h1 fr-mb-0">
						Échangez avec des professionnels avec <i>My Job Glasses</i>
					</h1>
				</Banner>
				<div className='fr-container fr-mb-5w'>
					<p>
						Un réseau professionnel à votre disposition&nbsp;: <b><i>1Jeune1Solution</i></b> s&apos;est associé à <b><i>My Job Glasses</i></b> pour
						vous permettre de découvrir les métiers grâce à un réseau de <strong>plus de 82&nbsp;000
						professionnels</strong> qui se rendent disponibles pour répondre à toutes vos questions sur leur métier. Ce service
						est <strong>gratuit</strong> et disponible pour tous, sans condition d&apos;âge. Rien de tel que d&apos;échanger avec une
						personne qui vous présentera son métier, son environnement professionnel et son parcours pour vous aider
						dans votre choix d&apos;orientation !
					</p>
				</div>
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
