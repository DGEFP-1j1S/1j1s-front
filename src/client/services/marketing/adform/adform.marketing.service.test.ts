import { aCookiesService } from '~/client/services/cookies/cookies.service.fixture';

import { AdformMarketingService } from './adform.marketing.service';

describe('AdformMarketingService', () => {
	it('initialise le service adform', () => {
		const cookiesService = aCookiesService();
		const ID_1J1S = 2867419;

		new AdformMarketingService(cookiesService);

		expect(cookiesService.addService).toHaveBeenCalledWith('adform');
		expect(cookiesService.addUser).toHaveBeenCalledWith('adformpm', ID_1J1S);
		expect(cookiesService.addUser).toHaveBeenCalledWith("adformpagename", "2026-10-1jeune1solution.gouv.fr-PageArrivee-PageArrivee");
	});

});
