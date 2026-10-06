import { FormationFiltre, FormationFiltreAvecCodeCertification } from '~/server/formations/domain/formation';
import {
	ApiAlternanceFormationRechercheResponse,
	ApiAlternanceFormationResponse,
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
		...aFormationQuery(),
		niveauEtudes: '6',
	};
}

export const anApiAlternanceFormation = (overrides?: Partial<ApiAlternanceFormationResponse>): ApiAlternanceFormationResponse => ({
	certification: {
		valeur: {
			identifiant: { cfd: '999' },
			intitule: {
				cfd: { long: 'Développeur web' },
				niveau: {
					cfd: { europeen: '4' },
					rncp: { europeen: '4' },
				},
				rncp: 'Développeur web',
			},
		},
	},
	contenu_educatif: {
		contenu: 'Description de la formation',
		objectif: 'Objectifs de la formation',
	},
	formateur: {
		organisme: {
			etablissement: { enseigne: 'La Bonne Alternance' },
			unite_legale: { raison_sociale: 'LA BONNE ALTERNANCE SAS' },
		},
	},
	identifiant: { cle_ministere_educatif: 'cleMinistereEducatif-123456' },
	lieu: {
		adresse: {
			code_postal: '75001',
			commune: { nom: 'Paris' },
			label: '1 rue de la République',
		},
		geolocalisation: { coordinates: [2, 1] },
	},
	modalite: { duree_indicative: 1 },
	...overrides,
});

export const anApiAlternanceFormationDetailResponse = (overrides?: Partial<ApiAlternanceFormationResponse>): ApiAlternanceFormationResponse => anApiAlternanceFormation(overrides);

export const anApiAlternanceResultatRechercheFormationResponse = (
	data: Array<ApiAlternanceFormationResponse> = [
		anApiAlternanceFormation(),
		anApiAlternanceFormation({
			certification: {
				valeur: {
					identifiant: { cfd: '888' },
					intitule: {
						cfd: { long: 'Développeur web' },
						niveau: { cfd: { europeen: null }, rncp: null },
						rncp: null,
					},
				},
			},
			identifiant: { cle_ministere_educatif: 'cleMinistereEducatif-456789' },
			lieu: {
				adresse: {
					code_postal: null,
					commune: { nom: 'Paris' },
					label: null,
				},
				geolocalisation: { coordinates: [2, 1] },
			},
		}),
	],
): ApiAlternanceFormationRechercheResponse => ({ data });
