import { GetStaticPropsResult } from 'next';
import React from 'react';

import { Head } from '~/client/components/head/Head';
import { Container } from '~/client/components/layouts/Container/Container';
import { Link } from '~/client/components/ui/Link/Link';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/faq/index.analytics';
import styles from '~/pages/faq/index.module.scss';
import { FAQQuestion } from '~/server/faq/domain/FAQ';
import { dependencies } from '~/server/start';

type FaqPageProps = {
	listeDeQuestionRéponse: Array<FAQQuestion>
} 

const MAIL_TO = 'contact-1j1s@sg.social.gouv.fr';

export default function FaqPage({ listeDeQuestionRéponse }: FaqPageProps) {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="FAQ | 1jeune1solution"
				robots="index,follow" />
			<main id="contenu">
				<Container className={styles.container}>
					<h1 className={styles.titre}>FAQ - QUESTIONS FRÉQUEMMENT POSÉES</h1>
					<h2 className={styles.sousTitre}>Que pouvons-nous faire pour vous ?</h2>
					{listeDeQuestionRéponse?.length > 0 && (
						<ul aria-label="Foire aux questions" className={styles.liste}>
							{listeDeQuestionRéponse?.map((question) => (
								<li key={question.slug}>
									<Link href={`/faq/${question.slug}`}>
										<h3>{question.problématique}</h3>
										<Link.Icon name='angle-right' />
									</Link>
								</li>
							)) }
						</ul>
					)
					}
					<div className={styles.contact}>
						<h3>Vous ne trouvez pas de réponse à votre question ?</h3>
						<Link appearance={'asSecondaryButton'} href={`mailto:${MAIL_TO}`} prefetch={false}>
							Nous contacter
							<Link.Icon name="mail" />
						</Link>
					</div>
				</Container>
			</main>
		</>
	);
}

export async function getStaticProps(): Promise<GetStaticPropsResult<FaqPageProps>> {
	const listeDeQuestionRéponse = await dependencies.faqDependencies.listerQuestionsFAQ.handle();
	if (listeDeQuestionRéponse.instance === 'failure') {
		return { notFound: true };
	}

	return {
		props: {
			listeDeQuestionRéponse: listeDeQuestionRéponse.result,
		},
		revalidate: dependencies.cmsDependencies.dureeDeValiditeEnSecondes(),
	};
}
