import { CookiesService } from '~/client/services/cookies/cookies.service';

import { MarketingService } from '../marketing.service';

export class AdformMarketingService implements MarketingService {
	private static ADFORM_SERVICE = 'adform';
	private static CLIENT_ID_1J1S = 2867419;
	private readonly cookiesService: CookiesService;

	constructor(cookiesService: CookiesService) {
		this.cookiesService = cookiesService;
		this.cookiesService.addUser('adformpm', AdformMarketingService.CLIENT_ID_1J1S);
		this.cookiesService.addUser('adformpagename', undefined);
		this.cookiesService.addService(AdformMarketingService.ADFORM_SERVICE);
	}

	trackPage(pagename: string): void {
		this.cookiesService.addUser('adformpagename', pagename);
	}
}
