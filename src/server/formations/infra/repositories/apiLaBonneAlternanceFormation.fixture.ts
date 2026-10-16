import { FormationFiltre, FormationFiltreAvecCodeCertification } from '~/server/formations/domain/formation';
import {
	ApiLaBonneAlternanceFormation,
	ApiLaBonneAlternanceFormationRechercheResponse,
	ApiLaBonneAlternanceFormationResponse,
} from '~/server/formations/infra/repositories/apiLaBonneAlternanceFormation';

export function aFormationQuery(): FormationFiltre {
	return {
		codeCommune: '13180',
		codeRomes: ['F1603', 'I1308'],
		distanceCommune: '30',
		latitudeCommune: '48.2',
		longitudeCommune: '29.10',
	};
}

export const aFormationAvecCodeCertificationQuery = (override?: Partial<FormationFiltreAvecCodeCertification>): FormationFiltreAvecCodeCertification => {
	return {
		...aFormationQuery(),
		codeCertification: '4567',
		...override,
	};
};

export function aFormationQueryWithNiveauEtudes(): FormationFiltre {
	return {
		codeCommune: '13180',
		codeRomes: ['F1603', 'I1308'],
		distanceCommune: '30',
		latitudeCommune: '48.2',
		longitudeCommune: '29.10',
		niveauEtudes: '6',
	};
}

export const aLaBonneAlternanceApiRésultatRechercheFormationResponse = (): ApiLaBonneAlternanceFormationRechercheResponse => ({
	results: [
		{
			cfd: '999',
			cleMinistereEducatif: 'cleMinistereEducatif-123456',
			company: {
				name: 'La Bonne Alternance',
			},
			diplomaLevel: '4 (BAC...)',
			idRco: '123',
			place: {
				city: 'Paris',
				fullAddress: '1 rue de la République',
				latitude: 1,
				longitude: 2,
				zipCode: '75001',
			},
			title: 'Développeur web',
		},
		{
			cfd: '888',
			company: {
				name: 'La Bonne Alternance',
			},
			diplomaLevel: 'Un autre type de diplôme',
			idRco: '456',
			place: {
				city: 'Paris',
			},
			title: 'Développeur web',
		},
	],
});

export const anApiLaBonneAlternanceFormation = (overrides? : Partial<ApiLaBonneAlternanceFormation>): ApiLaBonneAlternanceFormation => {
	return {
		cleMinistereEducatif: '085120P01213002197060001130021970600011-46314#L01',
		company: {
			name: 'La Bonne Alternance',
		},
		id: '085120P01213002197060001130021970600011-46314#L01',
		place: {
			city: 'Paris',
			fullAddress: '1 rue de la République 75001 Paris',
			latitude: 1,
			longitude: 2,
			zipCode: '75001',
		},
		title: 'Développeur web',
		training: {
			description: 'Description de la formation',
			objectif: 'Objectifs de la formation',
		},
		...overrides,
	};
};

export const anApiLaBonneAlternanceFormationResponse = (formationResults: ApiLaBonneAlternanceFormation[] = [anApiLaBonneAlternanceFormation()]): ApiLaBonneAlternanceFormationResponse => {
	return {
		results: formationResults,
	};
};
