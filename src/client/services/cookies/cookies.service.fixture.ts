import { CookiesService } from './cookies.service';

export function aCookiesService(override?: Partial<CookiesService>): CookiesService {
	return {
		addService: vi.fn(),
		addUser: vi.fn(),
		allowService: vi.fn(),
		isServiceAllowed: vi.fn(() => true),
		openPanel: vi.fn(),
		triggerServices: vi.fn(),
		...override,
	};
}
