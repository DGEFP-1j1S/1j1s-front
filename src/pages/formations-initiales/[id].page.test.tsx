import '~/test-utils';

import { render, screen } from '@testing-library/react';
import React from 'react';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockLargeScreen, mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import { aDateService } from '~/client/services/date/date.service.fixture';
import { aStorageService } from '~/client/services/storage/storage.service.fixture';
import ConsulterFormationInitialePage from '~/pages/formations-initiales/[id].page';
import { getServerSideProps } from '~/pages/formations-initiales/index.page';
import {
	aFormationInitiale,
	aFormationInitialeDetailComplete,
} from '~/server/formations-initiales/domain/formationInitiale.fixture';

describe('quand le feature flip est actif', () => {
	beforeEach(() => {
		process.env.NEXT_PUBLIC_FORMATIONS_INITIALES_FEATURE = '1';
		mockUseRouter({});
		mockLargeScreen();
	});

	it('envoie les analytics de la page', () => {
		const analyticsService = aManualAnalyticsService();
		render(
			<DependenciesProvider
				analyticsService={analyticsService}
				dateService={aDateService()}
				sessionStorageService={aStorageService()}>
				<ConsulterFormationInitialePage formationInitialeDetail={aFormationInitialeDetailComplete()} />
			</DependenciesProvider>,
		);

		expect(analyticsService.envoyerAnalyticsPageVue).toHaveBeenCalledWith({
			page_template: 'contenu_detail_niv_2',
			pagegroup: 'formation_initiale_detail',
			pagelabel: 'contenu_detail_niv_2',
			'segment-site': 'contenu_detail',
		});
	});

	it('doit rendre du HTML respectant la specification', () => {
		const { container } = render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}
				dateService={aDateService()}
				sessionStorageService={aStorageService()}>
				<ConsulterFormationInitialePage formationInitialeDetail={aFormationInitialeDetailComplete()} />
			</DependenciesProvider>,
		);

		expect(container.outerHTML).toHTMLValidate();
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		const { container } = render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}
				dateService={aDateService()}
				sessionStorageService={aStorageService()}>
				<ConsulterFormationInitialePage formationInitialeDetail={aFormationInitialeDetailComplete()} />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});

	describe('affiche des informations sur l‘origine de la donnée', () => {
		it('le partnenaire est ONISEP', () => {
			// GIVEN
			// WHEN
			render(
				<DependenciesProvider
					analyticsService={aManualAnalyticsService()}
					dateService={aDateService()}
					sessionStorageService={aStorageService()}>
					<ConsulterFormationInitialePage formationInitialeDetail={aFormationInitialeDetailComplete()} />
				</DependenciesProvider>,
			);

			// THEN
			const onisepCardTitle = screen.getByRole('heading', { level: 2, name: /Onisep : l’information pour l’orientation/ });
			expect(onisepCardTitle).toBeVisible();
		});

		it('la date de mise à jour de la donnée est celle de la mise à jour des fiches détails quand le détail provient des idéo-fiches formations', () => {
			// GIVEN
			const detailsUpdateDate = '15 mai 2023';
			const dateService = aDateService({
				formatToHumanReadableDate: () => detailsUpdateDate,
			});
			const updateDateFromFormationInitiale = new Date('2023-05-15T09:37:44.283Z');

			// WHEN
			render(
				<DependenciesProvider
					analyticsService={aManualAnalyticsService()}
					dateService={dateService}
					sessionStorageService={aStorageService()}>
					<ConsulterFormationInitialePage formationInitialeDetail={aFormationInitialeDetailComplete({ dateDeMiseAJour: updateDateFromFormationInitiale })} />
				</DependenciesProvider>,
			);

			// THEN
			const onisepCardTitle = screen.getByText(`Idéo-fiches formations, Onisep, ${detailsUpdateDate}, sous licence ODBL`);
			expect(onisepCardTitle).toBeVisible();
		});

		it('la date de mise à jour de la donnée est la date du jour quand il n‘il y a pas de détail provenant d’idéo-fiches formations', () => {
			// GIVEN
			const todayDate = new Date('2023-08-01T14:45:25.000Z');
			const todayFormattedDate = '01 août 2023';
			const dateService = aDateService({
				formatToHumanReadableDate: () => todayFormattedDate,
				today: () => todayDate,
			});

			// WHEN
			render(
				<DependenciesProvider
					analyticsService={aManualAnalyticsService()}
					dateService={dateService}
					sessionStorageService={aStorageService()}>
					<ConsulterFormationInitialePage formationInitialeDetail={aFormationInitiale()} />
				</DependenciesProvider>,
			);

			// THEN
			const onisepCardTitle = screen.getByText(`Idéo-fiches formations, Onisep, ${todayFormattedDate}, sous licence ODBL`);
			expect(onisepCardTitle).toBeVisible();
		});
	});
});
describe('quand le feature flip n‘est pas actif', () => {
	beforeEach(() => {
		mockSmallScreen();
		mockUseRouter({});
	});

	it('la page n‘est pas disponible', async () => {
		process.env.NEXT_PUBLIC_FORMATIONS_INITIALES_FEATURE = '0';
		render(
			<DependenciesProvider
				analyticsService={aManualAnalyticsService()}
				dateService={aDateService()}
				sessionStorageService={aStorageService()}>
				<ConsulterFormationInitialePage formationInitialeDetail={aFormationInitialeDetailComplete()} />
			</DependenciesProvider>,
		);

		const result = await getServerSideProps();
		expect(result).toMatchObject({ notFound: true });
	});
});
