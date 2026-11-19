import { GetStaticPropsResult } from 'next';
import React from 'react';

import { Head } from '~/client/components/head/Head';
import { Link } from '~/client/components/ui/Link/Link';
import { Tuile } from "~/client/dsfr";
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/faq/index.analytics';
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
				robots="index,follow"
			/>
			<main id="contenu">
				<div className="fr-container">
					<h1>FAQ - questions fréquemment posées</h1>
					<section className="fr-py-5w">
						<h2 className="fr-mb-4w">Que pouvons-nous faire pour vous ?</h2>
						{listeDeQuestionRéponse?.length > 0 && (
							<ul aria-label="Foire aux questions" className="fr-grid-row fr-grid-row--gutters">
								{listeDeQuestionRéponse?.map((question) => (
									<li key={question.slug} className="fr-col-12 fr-col-md-4">
										<Tuile lien={`/faq/${question.slug}`} titre={question.problématique} />
									</li>
								)) }
							</ul>
						)}
					</section>
					<section className="fr-py-5w">
						<div className="fr-py-4w fr-px-3w border--blue">
							<div className="fr-grid-row fr-grid-row--gutters align-items--center">
								<div className="fr-col">
									<h2 className="fr-mb-1w">Vous ne trouvez pas votre réponse ?</h2>
									<p className="fr-text--bold fr-mb-0">Notre équipe est à votre disposition pour vous aider</p>
								</div>
								<div className="fr-col-auto">
									<Link className="fr-btn" href={`mailto:${MAIL_TO}`}>
										Nous contacter
									</Link>
								</div>
							</div>
						</div>
					</section>
				</div>
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
