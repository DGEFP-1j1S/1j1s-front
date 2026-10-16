import { anHttpClientService } from '~/client/services/httpClientService.fixture';
import { BffLocalisationService } from '~/client/services/localisation/bff.localisation.service';
import { createSuccess } from '~/server/errors/either';
import { RésultatsRechercheCommune } from '~/server/localisations/domain/localisationAvecCoordonnées';
import { aRésultatsRechercheCommune } from '~/server/localisations/domain/localisationAvecCoordonnées.fixture';

describe('BffLocalisationService', () => {
	describe('isInvalidLocalisationQuery', () => {
		it('les espaces en début et fin de recherche ne sont pas pris en compte dans la vérification', () => {
			const value = ' t ';
			const httpClientService = anHttpClientService();
			const bffLocalisationService = new BffLocalisationService(httpClientService);

			const result = bffLocalisationService.isInvalidLocalisationQuery(value);

			expect(result).toEqual(true);
		});

		describe('renvoie true quand', () => {
			it('la recherche contient un seul chiffre', () => {
				const value = '1';
				const httpClientService = anHttpClientService();
				const bffLocalisationService = new BffLocalisationService(httpClientService);

				const result = bffLocalisationService.isInvalidLocalisationQuery(value);

				expect(result).toEqual(true);
			});
			it('la recherche contient un caractère spécial sauf accents et espaces', () => {
				const httpClientService = anHttpClientService();
				const bffLocalisationService = new BffLocalisationService(httpClientService);

				const result = bffLocalisationService.isInvalidLocalisationQuery('$$');

				expect(result).toEqual(true);
			});
			it('la recherche contient qu‘une seule lettre', () => {
				const httpClientService = anHttpClientService();
				const bffLocalisationService = new BffLocalisationService(httpClientService);

				const result = bffLocalisationService.isInvalidLocalisationQuery('a');

				expect(result).toEqual(true);
			});
			it('la recherche contient moins de 3 caractères dont au moins 1 lettre', async () => {
				const httpClientService = anHttpClientService();
				const bffLocalisationService = new BffLocalisationService(httpClientService);

				const result = bffLocalisationService.isInvalidLocalisationQuery('1A');

				expect(result).toEqual(true);
			});
			it('la recherche contient plus de 3 caractères avec moins de 3 caractères valides', async () => {
				const httpClientService = anHttpClientService();
				const bffLocalisationService = new BffLocalisationService(httpClientService);

				const result = bffLocalisationService.isInvalidLocalisationQuery('1((');

				expect(result).toEqual(true);
			});
		});

		describe('renvoie false quand', () => {
			it('la recherche est un nombre au format département métropolitain (sauf la corse)', async () => {
				// Given
				const httpClientService = anHttpClientService();
				const bffLocalisationService = new BffLocalisationService(httpClientService);

				// When
				const result = bffLocalisationService.isInvalidLocalisationQuery('34');

				// Then
				expect(result).toEqual(false);
			});
			it('la recherche est un nombre au format département d’outre-mer', () => {
				// Given
				const httpClientService = anHttpClientService();
				const bffLocalisationService = new BffLocalisationService(httpClientService);

				// When
				const result = bffLocalisationService.isInvalidLocalisationQuery('974');

				// Then
				expect(result).toEqual(false);
			});
			it('la recherche est le département de la Corse-du-Sud', async () => {
				// Given
				const httpClientService = anHttpClientService();
				const bffLocalisationService = new BffLocalisationService(httpClientService);

				// When
				const result = bffLocalisationService.isInvalidLocalisationQuery('2A');

				// Then
				expect(result).toEqual(false);
			});
			it('la recherche est le département de la Haute-Corse', async () => {
				// Given
				const httpClientService = anHttpClientService();
				const bffLocalisationService = new BffLocalisationService(httpClientService);

				// When
				const result = bffLocalisationService.isInvalidLocalisationQuery('2B');

				// Then
				expect(result).toEqual(false);
			});
			it('la recherche est un code postal', async () => {
				// Given
				const httpClientService = anHttpClientService();
				const bffLocalisationService = new BffLocalisationService(httpClientService);

				// When
				const result = bffLocalisationService.isInvalidLocalisationQuery('02141');

				// Then
				expect(result).toEqual(false);
			});
			it('la recherche contient plus de 3 lettres', async () => {
				const httpClientService = anHttpClientService();
				const bffLocalisationService = new BffLocalisationService(httpClientService);

				const result = bffLocalisationService.isInvalidLocalisationQuery('Haut');

				expect(result).toEqual(false);
			});
		});
	});

	describe('rechercherLocalisation', () => {
		it('appelle le bff en enlevant les espaces en début et fin de recherche', async () => {
			const value = ' test  ';
			const valueTrimmed = 'test';
			const httpClientService = anHttpClientService();
			const bffLocalisationService = new BffLocalisationService(httpClientService);

			await bffLocalisationService.rechercherLocalisation(value);

			expect(httpClientService.get).toHaveBeenCalledWith(`localisations?recherche=${valueTrimmed}`);
		});
	});

	describe('rechercherCommune', () => {
		it('appelle communes avec la recherche', async () => {
			const httpClientService = anHttpClientService();
			const bffLocalisationService = new BffLocalisationService(httpClientService);
			const query = 'pari';
			const expected: RésultatsRechercheCommune = {
				résultats: [
					{
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
					},
				],
			};

			vi.spyOn(httpClientService, 'get').mockResolvedValue(createSuccess(aRésultatsRechercheCommune()));

			const result = await bffLocalisationService.rechercherCommune(query);

			expect(result).toEqual(createSuccess(expected));
			expect(httpClientService.get).toHaveBeenCalledWith('communes?q=pari');
		});
	});
});
