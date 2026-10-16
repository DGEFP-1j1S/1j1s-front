import { Formation, NiveauRequisLibelle, RésultatRechercheFormation } from '~/server/formations/domain/formation';

export const aRésultatRechercheFormationList = (): Array<RésultatRechercheFormation> => [
	aResultatRechercheFormation(),
	{
		codeCertification: '888',
		id: '456__',
		nomEntreprise: 'La Bonne Alternance',
		tags: ['Paris', 'Autre'],
		titre: 'Développeur web',
	},
];

export const aResultatRechercheFormation = (override?: Partial<RésultatRechercheFormation>):  RésultatRechercheFormation => ({
	adresse: '1 rue de la République',
	codeCertification: '999',
	codePostal: '75001',
	id: '123__cleMinistereEducatif-123456',
	latitude: 1,
	longitude: 2,
	nomEntreprise: 'La Bonne Alternance',
	tags: ['Paris', NiveauRequisLibelle['NIVEAU_4']],
	titre: 'Développeur web',
	...override,
});

export const aFormation = (overrides?: Partial<Formation>): Formation => ({
	adresse: {
		adresseComplete: '1 rue de la République 75001 Paris',
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
