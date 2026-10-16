import { RemunerationPeriode } from '~/server/stages/domain/remunerationPeriode';
import { OffreDeStage, OffreDeStageLocalisation } from '~/server/stages/domain/stages';
import { SourceDesDonnées } from '~/server/stages/repository/sourceDesDonnéesStage';

export function anOffreDeStage(overrides?: Partial<OffreDeStage>): OffreDeStage {
	return {
		dateDeDebutMax: '2024-09-01',
		dateDeDebutMin: '2024-09-01',
		description: 'Poste ouvert aux personnes en situation de handicap',
		domaines: [],
		dureeEnJour: 720,
		dureeEnJourMax: 800,
		employeur: {
			description: undefined,
			logoUrl: undefined,
			nom: 'La Relève',
			siteUrl: undefined,
		},
		id: 'anId',
		localisation: {
			codePostal: undefined,
			departement: undefined,
			pays: 'France',
			region: undefined,
			ville: undefined,
		},
		remunerationMax: 1000,
		remunerationMin: 1000,
		remunerationPeriode: RemunerationPeriode.MONTHLY,
		slug: 'alternance-audit-tours-h-f-036780b7-95ba-4711-bf26-471d1f95051c',
		source: SourceDesDonnées.JOBTEASER,
		teletravailPossible: true,
		titre: 'Alternance Audit - Tours ( H/F)',
		urlDeCandidature: 'https://www.jobteaser.com/en/job-offers/10067252',
		...overrides,
	};
}

export function anOffreDeStageLocalisation(override?: Partial<OffreDeStageLocalisation>): OffreDeStageLocalisation {
	return {
		codePostal: undefined,
		departement: undefined,
		pays: undefined,
		region: undefined,
		ville: undefined,
		...override,
	};
}

export function anOffreDeStageSlugsList(): Array<string> {
	return [
		'stage-assistant-consultant-en-gestion-de-patrimoine-1a154a14-e68c-45ba-913a-7487eb9089ba',
		'praktikant-unternehmensbewertung-m-w-d-f5d7f0f1-734b-4e56-8230-5397c8ffa434',
		'associate-consultant-intern-aci-aeb25e90-f124-4d14-a70e-e8eb1b513257',
	];
}
