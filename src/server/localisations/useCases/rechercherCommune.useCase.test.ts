import { createSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import {
	aLocalisationAvecCoordonnéesRepository,
	aRésultatsRechercheCommune,
} from '~/server/localisations/domain/localisationAvecCoordonnées.fixture';
import { LocalisationAvecCoordonnéesRepository } from '~/server/localisations/domain/localisationAvecCoordonnées.repository';
import { RechercherCommuneUseCase } from '~/server/localisations/useCases/rechercherCommune.useCase';
import { ConfigurationService } from '~/server/services/configuration.service';
import { ConfigurationServiceFixture } from '~/server/services/configuration.service.fixture';

describe('RechercherCommuneUseCase', () => {
	let localisationAvecCoordonnéesRepository: LocalisationAvecCoordonnéesRepository;
	let configurationService: ConfigurationService;

	beforeEach(() => {
		localisationAvecCoordonnéesRepository = aLocalisationAvecCoordonnéesRepository();
		configurationService = new ConfigurationServiceFixture();
	});

	describe('getCommuneList', () => {
		it('renvoie la liste des communes en fonction de la recherche', async () => {
			const rechercherCommuneUseCase = new RechercherCommuneUseCase(localisationAvecCoordonnéesRepository, configurationService);
      type ExpectedType = Awaited<ReturnType<typeof rechercherCommuneUseCase.handle>>
      vi.spyOn(localisationAvecCoordonnéesRepository, 'getCommuneList').mockResolvedValue(createSuccess(aRésultatsRechercheCommune()));

      const expected: ExpectedType = { instance: 'success', result: {
      	résultats: [{
      		code: '75056',
      		codePostal: '75006',
      		coordonnées: {
      			latitude: 48.859,
      			longitude: 2.347,
      		},
      		ville: 'Paris',
      	},
      	{
      		code: '75115',
      		codePostal: '75015',
      		coordonnées: {
      			latitude: 48.863367,
      			longitude: 2.397152,
      		},
      		ville: 'Paris 15e Arrondissement',
      	}],
      } };

      const result = await rechercherCommuneUseCase.handle('paris');

      expect(result).toEqual(expected);
		});

		it('n’appelle pas le service si la query est trop courte', async () => {
			configurationService = new ConfigurationServiceFixture({ NEXT_PUBLIC_API_ADRESSE_MINIMUM_QUERY_LENGTH: 3 });
			const rechercherCommuneUseCase = new RechercherCommuneUseCase(localisationAvecCoordonnéesRepository, configurationService);
			type ExpectedType = Awaited<ReturnType<typeof rechercherCommuneUseCase.handle>>
			vi.spyOn(localisationAvecCoordonnéesRepository, 'getCommuneList');

			const expected: ExpectedType = { errorType: ErreurMetier.DEMANDE_INCORRECTE, instance: 'failure' };

			const result = await rechercherCommuneUseCase.handle('pa');

			expect(result).toEqual(expected);
			expect(localisationAvecCoordonnéesRepository.getCommuneList).not.toHaveBeenCalled();
		});
	});
});
