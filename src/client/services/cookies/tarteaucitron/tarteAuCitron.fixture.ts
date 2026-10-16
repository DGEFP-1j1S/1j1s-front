import { TarteAuCitron } from './tarteAuCitron.cookies.service';

export function aTarteAuCitron(override?: Partial<TarteAuCitron>): TarteAuCitron {
	return {
		init: vi.fn(),
		job: undefined,
		services: {},
		state: {},
		triggerJobsAfterAjaxCall: vi.fn(),
		user: {},
		userInterface: {
			openPanel: vi.fn(),
			respond: vi.fn(),
		},
		...override,
	};
}
