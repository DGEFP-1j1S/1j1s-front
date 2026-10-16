import { MarketingService } from '../marketing.service';

export class NullMarketingService implements MarketingService {
	trackPage(): void {}
}
