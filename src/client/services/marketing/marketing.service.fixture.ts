import { MarketingService } from './marketing.service';

export function aMarketingService(override?: Partial<MarketingService>): MarketingService {
	return {
		trackPage: vi.fn(),
		...override,
	};
}
