import { GetStaticPropsResult } from 'next';

import { ConsulterContenu, ConsulterContenuProps } from '~/client/components/features/Contenu/ConsulterContenu';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/cgu/index.analytics';
import { TypeDeMentionObligatoire } from '~/server/mentions-obligatoires/domain/typeDeMentionObligatoire';
import { dependencies } from '~/server/start';

export default function Cgu({ titre, contenu }: ConsulterContenuProps) {
	useAnalytics(analytics);

	return <ConsulterContenu titre={titre} contenu={contenu} />;
}

export async function getStaticProps(): Promise<GetStaticPropsResult<ConsulterContenuProps>> {
	const response = await dependencies.mentionObligatoireDependencies.consulterMentionObligatoireUseCase.handle(TypeDeMentionObligatoire.CONDITIONS_GENERALES_UTILISATIONS);

	if (response.instance === 'failure') {
		return { notFound: true, revalidate: 1 };
	}

	const { titre, contenu } = JSON.parse(JSON.stringify(response.result));

	return {
		props: {
			contenu,
			titre,
		},
		revalidate: dependencies.cmsDependencies.dureeDeValiditeEnSecondes(),
	};
}
