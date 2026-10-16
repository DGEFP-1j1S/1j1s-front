import '~/test-utils';

import { render } from '@testing-library/react';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import { aDateService } from '~/client/services/date/date.service.fixture';
import { aStorageService } from '~/client/services/storage/storage.service.fixture';
import ConsulterOffreStagePage from '~/pages/stages/[id].page';
import { anOffreDeStage } from '~/server/stages/domain/stages.fixture';

describe('<ConsulterOffreStagePage />', () => {
	const offreDeStage = anOffreDeStage();

	beforeEach(() => {
		mockUseRouter({});
	});

	it('doit rendre du HTML respectant la specification', () => {
		const { container } = render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}
				sessionStorageService={aStorageService()}
				dateService={aDateService()}>
				<ConsulterOffreStagePage offreDeStage={offreDeStage} />
			</DependenciesProvider>,
		);

		expect(container.outerHTML).toHTMLValidate();
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		const { container } = render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}
				sessionStorageService={aStorageService()}
				dateService={aDateService()}>
				<ConsulterOffreStagePage offreDeStage={offreDeStage} />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});
});
