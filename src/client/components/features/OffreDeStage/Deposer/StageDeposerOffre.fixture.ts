import { DomainesStage } from '~/server/stages/repository/domainesStage';

export const aFormulaireEtapeEntreprise = () => {
	return {
		descriptionEmployeur: 'test description',
		emailEmployeur: 'oui@non.com',
		logoEmployeur: '',
		nomEmployeur: 'Octo',
		siteEmployeur: '',
	};
};

export const aFormulaireEtapeStage = () => {
	return {
		dateDeDebutMax: '2123-02-20',
		dateDeDebutMin: '2123-01-20',
		descriptionOffre: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor eu augue ut lectus arcu bibendum. Curabitur gravida arcu ac tortor dignissim convallis aenean. Adipiscing commodo elit at imperdiet. Ipsum a arcu cursus vitae congue. Sed euismod nisi porta lorem. Facilisis gravida neque convallis a cras semper auctor neque vitae. Ante in nibh mauris cursus. In iaculis nunc sed augue lacus. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum.',
		domaineStage: DomainesStage.ACHAT,
		dureeStage: '30',
		isDateDeDebutPrecise: 'true' as const,
		lienCandidature: 'oui@non.com',
		nomOffre: 'Nom Offre',
		remunerationStage: '1',
		teletravail: 'true' as const,
	};
};

export const aFormulaireEtapeLocalisation = () => {
	return {
		adresse: '34 avenue de l’Opéra',
		codePostal: '75000',
		departement: 'Paris',
		pays: 'FR',
		region: 'Ile-de-France',
		ville: 'Paris',
	};
};

export const aFormulaireEnvoyePostedValue = () => {
	return {
		dateDeDebutMax: '2123-02-20',
		dateDeDebutMin: '2123-01-20',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor eu augue ut lectus arcu bibendum. Curabitur gravida arcu ac tortor dignissim convallis aenean. Adipiscing commodo elit at imperdiet. Ipsum a arcu cursus vitae congue. Sed euismod nisi porta lorem. Facilisis gravida neque convallis a cras semper auctor neque vitae. Ante in nibh mauris cursus. In iaculis nunc sed augue lacus. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum.',
		domaine: DomainesStage.ACHAT,
		duree: '30',
		employeur: {
			description: 'test description',
			email: 'oui@non.com',
			nom: 'Octo',
		},
		localisation: {
			adresse: '34 avenue de l’Opéra',
			codePostal: '75000',
			departement: 'Paris',
			pays: 'FR',
			region: 'Ile-de-France',
			ville: 'Paris',
		},
		remuneration: 1,
		teletravailPossible: true,
		titre: 'Nom Offre',
		urlDeCandidature: 'mailto:oui@non.com',
	};
}
;
