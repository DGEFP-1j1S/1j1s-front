import { NiveauRequisLibelle, ResultatRechercheFormation } from '~/server/formations/domain/formation';
import { aFormation } from '~/server/formations/domain/formation.fixture';
import {
	anApiAlternanceFormation,
	anApiAlternanceFormationDetailResponse,
	anApiAlternanceResultatRechercheFormationResponse,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.fixture';
import {
	mapFormation,
	mapResultatRechercheFormation,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation.mapper';

describe('mapRésultatRechercheFormation', () => {
	it('converti une response en liste de formation', () => {
		const input = anApiAlternanceResultatRechercheFormationResponse([
			anApiAlternanceFormation({
				certification: {
					valeur: {
						identifiant: { cfd: '123' },
						intitule: {
							cfd: { long: 'Monteur / Monteuse en chauffage (H/F)' },
							niveau: { cfd: { europeen: '3' }, rncp: null },
							rncp: null,
						},
					},
				},
				identifiant: { cle_ministere_educatif: '085120P01213002197060001130021970600011-46314#L01' },
				lieu: {
					adresse: {
						code_postal: '75001',
						commune: { nom: 'PARIS 1' },
						label: '1 rue de la République',
					},
					geolocalisation: { coordinates: [2.35, 48.85] },
				},
			}),
			anApiAlternanceFormation({
				certification: {
					valeur: {
						identifiant: { cfd: null },
						intitule: {
							cfd: null,
							niveau: { cfd: null, rncp: { europeen: '7' } },
							rncp: 'Monteur / Monteuse en plomberie (H/F)',
						},
					},
				},
				formateur: {
					organisme: {
						etablissement: { enseigne: null },
						unite_legale: { raison_sociale: 'ECOLE DE TRAVAIL ORTY' },
					},
				},
				identifiant: { cle_ministere_educatif: '085120P01213002197060001130021970600011-46315#L01' },
				lieu: {
					adresse: {
						code_postal: null,
						commune: { nom: 'PARIS 5' },
						label: null,
					},
					geolocalisation: { coordinates: [2.35, 48.85] },
				},
			}),
		]);

		const expected: ResultatRechercheFormation[] = [
			{
				adresse: '1 rue de la République - 75001 PARIS 1',
				codeCertification: '123',
				codePostal: '75001',
				id: '085120P01213002197060001130021970600011-46314#L01',
				latitude: 48.85,
				longitude: 2.35,
				nomEntreprise: 'La Bonne Alternance',
				tags: ['PARIS 1', NiveauRequisLibelle['NIVEAU_3']],
				titre: 'Monteur / Monteuse en chauffage (H/F)',
			},
			{
				adresse: undefined,
				codeCertification: undefined,
				codePostal: undefined,
				id: '085120P01213002197060001130021970600011-46315#L01',
				latitude: 48.85,
				longitude: 2.35,
				nomEntreprise: 'ECOLE DE TRAVAIL ORTY',
				tags: ['PARIS 5', NiveauRequisLibelle['NIVEAU_7_8']],
				titre: 'Monteur / Monteuse en plomberie (H/F)',
			},
		];

		const result = mapResultatRechercheFormation(input);

		expect(result).toEqual(expected);
	});
});

describe('titre de la formation', () => {
	function unIntituleDeCertification(intitule: { cfd: { long: string } | null, rncp: string | null }) {
		return anApiAlternanceFormationDetailResponse({
			certification: {
				valeur: {
					identifiant: { cfd: '999' },
					intitule: { ...intitule, niveau: { cfd: { europeen: '6' }, rncp: null } },
				},
			},
		});
	}

	it('préfère l’intitulé RNCP à celui du CFD, en capitales et sans accents', () => {
		const formation = unIntituleDeCertification({
			cfd: { long: 'ECONOMIE APPLIQUEE (MASTER)' },
			rncp: 'Économie appliquée',
		});

		expect(mapFormation(formation).titre).toEqual('Économie appliquée');
	});

	it('retire le suffixe « (fiche nationale) » de l’intitulé RNCP', () => {
		const formation = unIntituleDeCertification({
			cfd: { long: 'ECONOMIE APPLIQUEE (MASTER)' },
			rncp: 'Économie appliquée (fiche nationale)',
		});

		expect(mapFormation(formation).titre).toEqual('Économie appliquée');
	});

	it('conserve les autres parenthèses, qui sont signifiantes', () => {
		const formation = unIntituleDeCertification({
			cfd: null,
			rncp: 'Technicien de maintenance (CTM)',
		});

		expect(mapFormation(formation).titre).toEqual('Technicien de maintenance (CTM)');
	});

	it('se replie sur l’intitulé CFD quand le RNCP est absent', () => {
		const formation = unIntituleDeCertification({
			cfd: { long: 'ECONOMIE APPLIQUEE (MASTER)' },
			rncp: null,
		});

		expect(mapFormation(formation).titre).toEqual('ECONOMIE APPLIQUEE (MASTER)');
	});
});

describe('mapFormation', () => {
	it('convertit une response en formation description', () => {
		const apiResponse = anApiAlternanceFormationDetailResponse();

		const result = mapFormation(apiResponse);

		expect(result).toEqual(aFormation({ dureeIndicative: '1 an' }));
	});

	describe('quand la durée indicative est supérieure à un an', () => {
		it('l’exprime au pluriel', () => {
			const apiResponse = anApiAlternanceFormationDetailResponse({ modalite: { duree_indicative: 3 } });

			const result = mapFormation(apiResponse);

			expect(result.dureeIndicative).toEqual('3 ans');
		});
	});
});
