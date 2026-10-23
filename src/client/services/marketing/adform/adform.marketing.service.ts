import { CookiesService } from '~/client/services/cookies/cookies.service';

export class AdformMarketingService {
	private static ADFORM_SERVICE = 'adform';
	private static CLIENT_ID_1J1S = 2867419;
	static readonly PAGENAME = "2026-10-1jeune1solution.gouv.fr-PageArrivee-PageArrivee";
	private readonly cookiesService: CookiesService;

	constructor(cookiesService: CookiesService) {
		this.cookiesService = cookiesService;
		this.cookiesService.addUser('adformpm', AdformMarketingService.CLIENT_ID_1J1S);
		this.cookiesService.addUser('adformpagename', AdformMarketingService.PAGENAME);
		this.cookiesService.addService(AdformMarketingService.ADFORM_SERVICE);
	}
}
