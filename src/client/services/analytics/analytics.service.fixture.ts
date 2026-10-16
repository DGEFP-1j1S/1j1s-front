import { PageTags } from '~/client/services/analytics/analytics';

import { ManualAnalyticsService } from './analytics.service';

export function aManualAnalyticsService(overrides?: Partial<ManualAnalyticsService>): ManualAnalyticsService {
	return {
		envoyerAnalyticsPageVue: vi.fn(),
		isAllowed: vi.fn(() => true),
		...overrides,
	};
}

export function aPageTags(overrides?: Partial<PageTags>): PageTags {
	return {
		page_template: 'accueil',
		pagegroup: 'accueil',
		pagelabel: 'accueil',
		'segment-site': 'accueil',
		...overrides,
	};
}
