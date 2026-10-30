
import {
	LocalisationStageIndexee,
	OffreDeStageIndexee,
} from '~/server/stages/domain/offreDeStageIndexee';
import { SourceDesDonnees } from '~/server/stages/repository/sourceDesDonneesStage';

export function anOffreDeStageIndexee(override?: Partial<OffreDeStageIndexee>): OffreDeStageIndexee {
	return {
		dateDeDebutMax: '2024-09-01',
		dateDeDebutMin: '2024-09-01',
		description: 'Poste ouvert aux personnes en situation de handicap',
		domaines: [],
		duree: undefined,
		dureeCategorisee: '2 mois',
		dureeEnJour: 720,
		dureeEnJourMax: 800,
		id: 'offre-stage-id',
		localisation: {
			pays: 'France',
		},
		logoUrlEmployeur: 'www.vienstravailler.example.com',
		nomEmployeur: 'Viens travailler',
		slug: 'stage-audit-tours-h-f-036780b7-95ba-4711-bf26-471d1f95051c',
		source: SourceDesDonnees.JOBTEASER,
		teletravailPossible: true,
		titre: 'un stage d’audit',
		...override,
	};
}

export function aLocalisationStageIndexee(override?: Partial<LocalisationStageIndexee>): LocalisationStageIndexee {
	return {
		codePostal: undefined,
		departement: undefined,
		pays: 'France',
		region: undefined,
		ville: 'Paris',
		...override,
	};
}
