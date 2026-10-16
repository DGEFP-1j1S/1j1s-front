import {
	aResultatsRechercheMissionEngagementResponse,
} from '~/server/engagement/infra/repositories/apiEngagement.fixture';
import {
	mapFullLocalisation,
	mapRésultatsRechercheMission,
} from '~/server/engagement/infra/repositories/apiEngagement.mapper';
import {
	RésultatsRechercheMissionEngagementResponse,
} from '~/server/engagement/infra/repositories/apiEngagement.response';

describe('mapEngagement', () => {
	describe('mapFullLocalisation', () => {
		it('retourner la ville, n° de département, département et région', () => {
			const city = 'Nantes';
			const région = 'Pays de la Loire';
			const départementName = 'Loire-Atlantique';
			const départementCode = '44';
			expect(mapFullLocalisation(city, départementName, départementCode, région)).toEqual('Nantes (44 - Loire-Atlantique - Pays de la Loire)');
		});
		it('retourner la ville, n° de département, département', () => {
			const city = 'Nantes';
			const région = '';
			const départementName = 'Loire-Atlantique';
			const départementCode = '44';
			expect(mapFullLocalisation(city, départementName, départementCode, région)).toEqual('Nantes (44 - Loire-Atlantique)');
		});
		it('retourner la ville, n° de département', () => {
			const city = 'Nantes';
			const région = '';
			const départementName = '';
			const départementCode = '44';
			expect(mapFullLocalisation(city, départementName, départementCode, région)).toEqual('Nantes (44)');
		});
		it('retourner la ville', () => {
			const city = 'Nantes';
			const région = '';
			const départementName = '';
			const départementCode = '';
			expect(mapFullLocalisation(city, départementName, départementCode, région)).toEqual('Nantes');
		});
		it('retourner la ville, n° de département, région si département et villes sont les mêmes', () => {
			const city = 'Paris';
			const région = 'Île de France';
			const départementName = 'Paris';
			const départementCode = '75';
			expect(mapFullLocalisation(city, départementName, départementCode, région)).toEqual('Paris (75 - Île de France)');
		});
		it('retourner la ville, n° de département, département si région et département sont les mêmes', () => {
			const city = 'Fort-de-France';
			const région = 'Martinique';
			const départementName = 'Martinique';
			const départementCode = '972';
			expect(mapFullLocalisation(city, départementName, départementCode, région)).toEqual('Fort-de-France (972 - Martinique)');
		});
	});

	describe('mapRésultatsRechercheMission', () => {
		it('map les résultats de recherche de mission', () => {
			// Given
			const resultatsRechercheApiEngagement: RésultatsRechercheMissionEngagementResponse = aResultatsRechercheMissionEngagementResponse({
				hits: [
					{
						_id: 'id',
						associationName: 'associationName',
						city: 'Nantes',
						description: 'description',
						openToMinors: 'yes',
						organizationLogo: 'http://organizationLogo.com/image.png',
						organizationName: 'organizationName',
						postalCode: '44000',
						publisherId: 'publisherId',
						publisherLogo: 'http://publisherLogo.com/image.png',
						startAt: '2021-12-01T00:00:00.000Z',
						title: 'title',
					},
					{
						_id: 'id2',
						associationName: undefined,
						city: undefined,
						description: 'description2',
						openToMinors: 'no',
						organizationLogo: undefined,
						organizationName: 'organizationName2',
						postalCode: undefined,
						publisherId: 'publisherId2',
						publisherLogo: 'http://publisherLogo.com/image2.png',
						startAt: undefined,
						title: 'title2',
					},
				],
				total: 2,
			});

			// When
			const result = mapRésultatsRechercheMission(resultatsRechercheApiEngagement);

			// Then
			expect(result).toEqual({
				nombreRésultats: 2,
				résultats: [
					{
						description: 'description',
						débutContrat: '01/12/2021',
						id: 'id',
						logoUrl: 'http://organizationLogo.com/image.png',
						nomEntreprise: 'associationName',
						titre: 'title',
						étiquetteList: ['Dès 16 ans', 'Nantes (44000)', '01/12/2021'],
					},
					{
						description: 'description2',
						débutContrat: undefined,
						id: 'id2',
						localisation: undefined,
						nomEntreprise: 'organizationName2',
						titre: 'title2',
						étiquetteList: [],
					},
				],
			});
		});
	});
});
