import { NiveauRequisLibelle, RésultatRechercheFormation } from '~/server/formations/domain/formation';
import { aFormation } from '~/server/formations/domain/formation.fixture';
import {
	ApiLaBonneAlternanceFormationRechercheResponse,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation';
import {
	anApiLaBonneAlternanceFormationResponse,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.fixture';
import {
	mapFormation,
	mapRésultatRechercheFormation,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.mapper';

describe('mapRésultatRechercheFormation', () => {
	it('converti une response en liste de formation', () => {
		const input: ApiLaBonneAlternanceFormationRechercheResponse = {
			results: [{
				cfd: '123',
				company: {
					name: 'ECOLE DE TRAVAIL ORT',
				},
				diplomaLevel: '3 (CAP...)',
				idRco: '123',
				place: { fullAddress: '1 rue de la République', zipCode: '75001' },
				title: 'Monteur / Monteuse en chauffage (H/F)',
			},
			{
				company: { name: 'ECOLE DE TRAVAIL ORTY' },
				diplomaLevel: '7 (Master, titre ingénieur...)',
				idRco: '456',
				place: { city: 'PARIS 5' },
				title: 'Monteur / Monteuse en plomberie (H/F)',
			}],
		};

		const expected: RésultatRechercheFormation[] = [
			{
				adresse: '1 rue de la République',
				codeCertification: '123',
				codePostal: '75001',
				id: '123__',
				nomEntreprise: 'ECOLE DE TRAVAIL ORT',
				tags: [undefined, NiveauRequisLibelle['NIVEAU_3']],
				titre: 'Monteur / Monteuse en chauffage (H/F)',
			},
			{
				adresse: undefined,
				codePostal: undefined,
				id: '456__',
				nomEntreprise: 'ECOLE DE TRAVAIL ORTY',
				tags: ['PARIS 5', NiveauRequisLibelle['NIVEAU_7_8']],
				titre: 'Monteur / Monteuse en plomberie (H/F)',
			},
		];

		const result = mapRésultatRechercheFormation(input);

		expect(result).toEqual(expected);
	});
});

describe('mapFormation', () => {
	describe('quand il y a un résultat', () => {
		it('convertit une response en formation description', () => {
			const apiResponse = anApiLaBonneAlternanceFormationResponse([{
				cleMinistereEducatif: '085120P01213002197060001130021970600011-46314#L01',
				company: {
					name: 'La Bonne Alternance',
				},
				id: '085120P01213002197060001130021970600011-46314#L01',
				place: {
					city: 'Paris',
					fullAddress: '1 rue de la République 75001 Paris',
					zipCode: '75001',
				},
				title: 'Développeur web',
				training: {
					description: 'Description de la formation',
					objectif: 'Objectifs de la formation',
				},
			}],
			);

			const expectedFormation = aFormation({
				adresse: {
					adresseComplete: '1 rue de la République 75001 Paris',
					codePostal: '75001',
				},
				description: 'Description de la formation',
				dureeIndicative: undefined,
				nomEntreprise: 'La Bonne Alternance',
				objectif: 'Objectifs de la formation',
				tags: ['Paris'],
				titre: 'Développeur web',
			});

			const result = mapFormation(apiResponse);

			expect(result).toEqual(expectedFormation);
		});
	});

	describe('quand il n’y a pas de résultat dans la réponse de l’API', () => {
		it('retourne undefined', () => {
			// GIVEN
			const apiResponseWithEmptyResult = anApiLaBonneAlternanceFormationResponse([]);

			// WHEN
			const result = mapFormation(apiResponseWithEmptyResult);

			// THEN
			expect(result).toBe(undefined);
		});
	});
});
