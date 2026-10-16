import { aCommuneQuery } from '~/client/hooks/useCommuneQuery';
import {
	BffEtablissementAccompagnementService,
} from '~/client/services/établissementAccompagnement/bff.etablissementAccompagnement.service';
import { anHttpClientService } from '~/client/services/httpClientService.fixture';
import { aDemandeDeContactAccompagnement } from '~/server/demande-de-contact/domain/demandeDeContact.fixture';
import { createSuccess } from '~/server/errors/either';
import {
	anEtablissementAccompagnementList,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement.fixture';

describe('établissementAccompagnementService', () => {
	describe('rechercher', () => {
		it('retourne la liste des établissement d‘accompagnement', async () => {
			const httpClient = anHttpClientService();
			vi.spyOn(httpClient, 'get').mockResolvedValue(createSuccess(anEtablissementAccompagnementList()));
			const établissementAccompagnementService = new BffEtablissementAccompagnementService(httpClient);
			const accompagnementQueryParams = {
				typeAccompagnement: 'cij',
				...aCommuneQuery({
					codeCommune: '41600',
					codePostal: '41600',
					ville: 'Lamotte-Beuvron',
				}),
			};

			const actual = await établissementAccompagnementService.rechercher(accompagnementQueryParams);

			expect(httpClient.get).toHaveBeenCalledWith(expect.stringContaining('etablissements-accompagnement?'));
			expect(httpClient.get).toHaveBeenCalledWith(expect.stringContaining('codeCommune=41600'));
			expect(httpClient.get).toHaveBeenCalledWith(expect.stringContaining('codePostal=41600'));
			expect(httpClient.get).toHaveBeenCalledWith(expect.stringContaining('ville=Lamotte-Beuvron'));
			expect(httpClient.get).toHaveBeenCalledWith(expect.stringContaining('typeAccompagnement=cij'));
			expect(actual).toEqual(createSuccess(anEtablissementAccompagnementList()));
		});
	});

	describe('envoyerDemandeContact', () => {
		it('envoie la demande de contact', async () => {
			const httpClient = anHttpClientService();
			vi.spyOn(httpClient, 'post').mockResolvedValue(createSuccess(undefined));
			const établissementAccompagnementService = new BffEtablissementAccompagnementService(httpClient);
			const demandeDeContact = aDemandeDeContactAccompagnement();

			const actual = await établissementAccompagnementService.envoyerDemandeContact(demandeDeContact);

			expect(httpClient.post).toHaveBeenCalledWith('etablissements-accompagnement/contact', demandeDeContact);
			expect(actual).toEqual(createSuccess(undefined));
		});
	});
});
