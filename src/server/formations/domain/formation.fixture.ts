import { Formation, NiveauRequisLibelle, ResultatRechercheFormation } from '~/server/formations/domain/formation';

export const aResultatRechercheFormationList = (): Array<ResultatRechercheFormation> => [
	aResultatRechercheFormation(),
	{
		codeCertification: '888',
		id: 'cleMinistereEducatif-456789',
		latitude: 1,
		longitude: 2,
		nomEntreprise: 'La Bonne Alternance',
		tags: ['Paris', 'Autre'],
		titre: 'Développeur web',
	},
];

export const aResultatRechercheFormation = (override?: Partial<ResultatRechercheFormation>):  ResultatRechercheFormation => ({
	adresse: '1 rue de la République - 75001 Paris',
	codeCertification: '999',
	codePostal: '75001',
	id: 'cleMinistereEducatif-123456',
	latitude: 1,
	longitude: 2,
	nomEntreprise: 'La Bonne Alternance',
	tags: ['Paris', NiveauRequisLibelle['NIVEAU_4']],
	titre: 'Développeur web',
	...override,
});

export const aFormation = (overrides?: Partial<Formation>): Formation => ({
	adresse: {
		adresseComplete: '1 rue de la République - 75001 Paris',
		codePostal: '75001',
		latitude: 1,
		longitude: 2,
	},
	description: 'Description de la formation',
	dureeIndicative: undefined,
	nomEntreprise: 'La Bonne Alternance',
	objectif: 'Objectifs de la formation',
	tags: ['Paris'],
	titre: 'Développeur web',
	...overrides,
});
