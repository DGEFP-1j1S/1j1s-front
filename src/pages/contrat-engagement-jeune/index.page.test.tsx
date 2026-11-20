import '~/test-utils';

import { render, screen } from "@testing-library/react";
import React from 'react';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { ManualAnalyticsService } from '~/client/services/analytics/analytics.service';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import PageContratEngagementJeune from '~/pages/contrat-engagement-jeune/index.page';

describe("Page Contrat Engagement Jeune", () => {
	describe("<PageContratEngagementJeune />", () => {
		let analyticsService: ManualAnalyticsService;

		beforeEach(() => {
			mockSmallScreen();
			mockUseRouter({ asPath: '/' });
			analyticsService = aManualAnalyticsService();
		});

		it("doit rendre du HTML respectant la spécification", () => {
			const { container } = render(<DependenciesProvider analyticsService={analyticsService}>
				<PageContratEngagementJeune />
			</DependenciesProvider> );

			expect(container.outerHTML).toHTMLValidate();
		});

		it("doit être accessible", async () => {
			const { container } = render(
				<DependenciesProvider analyticsService={analyticsService}>
					<PageContratEngagementJeune />
				</DependenciesProvider>,
			);

			await expect(container).toBeAccessible();
		});

		it("affiche le titre de la page", () => {
			// GIVEN
			// WHEN
			render(
				<DependenciesProvider analyticsService={analyticsService}>
					<PageContratEngagementJeune />
				</DependenciesProvider>,
			);

			// THEN
			expect(screen.getByRole("heading", { level: 1, name: "Le Contrat d’Engagement Jeune, la solution pour vous" })).toBeVisible();
		});
	});
});
