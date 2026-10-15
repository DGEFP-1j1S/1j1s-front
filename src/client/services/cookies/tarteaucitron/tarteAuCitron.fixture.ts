import { TarteAuCitron } from './tarteAuCitron.cookies.service';

export function aTarteAuCitron(override?: Partial<TarteAuCitron>): TarteAuCitron {
	return {
		addScript: vi.fn(),
		init: vi.fn(),
		job: undefined,
		lang: {},
		reloadThePage: false,
		services: {},
		state: {},
		triggerJobsAfterAjaxCall: vi.fn(),
		user: {},
		userInterface: {
			closePanel: vi.fn(),
			openPanel: vi.fn(),
			respond: vi.fn(),
			respondAll: vi.fn(),
		},
		...override,
	};
}
