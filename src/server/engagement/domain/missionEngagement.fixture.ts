import {
	Mission,
	MissionEngagementDomaine,
	MissionEngagementRechercheServiceCivique,
	RésultatsRechercheMission,
} from './engagement';

export function aRechercheServiceCivique(override?: Partial<MissionEngagementRechercheServiceCivique>): MissionEngagementRechercheServiceCivique {
	return {
		domaine: 'sante',
		localisation: {
			distance: 10,
			latitude: 2.3522,
			longitude: 48.8566,
		},
		ouvertAuxMineurs: true,
		page: 1,
		...override,
	};
}

export function aMissionEngagementDomainList(): MissionEngagementDomaine[] {
	return [
		{
			libellé: 'Culture et loisirs',
			valeur: 'culture-loisirs',
		},
		{
			libellé: 'Éducation',
			valeur: 'education',
		},
		{
			libellé: 'Environnement',
			valeur: 'environnement',
		},
		{
			libellé: 'Mémoire et citoyenneté',
			valeur: 'mémoire et citoyenneté',
		},
		{
			libellé: 'Prévention et protection',
			valeur: 'prevention-protection',
		},
		{
			libellé: 'Santé',
			valeur: 'sante',
		},
		{
			libellé: 'Solidarité et insertion',
			valeur: 'solidarite-insertion',
		},
		{
			libellé: 'Sport',
			valeur: 'sport',
		},
		{
			libellé: 'Vivre ensemble',
			valeur: 'vivre-ensemble',
		},
		{
			libellé: 'Autre',
			valeur: 'autre',
		},
	];
}

export function aRésultatRechercheMission(override?: Partial<RésultatsRechercheMission>): RésultatsRechercheMission {
	return {
		nombreRésultats: 2,
		résultats: [
			{
				description: 'Je me rends sur le site de l’association de fourniture de biens de première\nnécessité et participe notamment à :\n\n • la récupération des produits (notamment en voiture) ;\n • la préparation des paniers contenant les produits ;\n • la disposition des paniers afin d’en assurer leur distribution ;\n • la préparation des espaces pour les repas en appliquant les règles de\n   sécurisation sanitaire ;\n • le déconditionnement et la cuisine des produits : préparation, cuisson … ;\n • la distribution/livraison des repas ;\n • le cas échéant et en lien avec les personnels de la structure, l’accueil et\n   l’accompagnement des personnes vulnérables ou assignées dans un lieu pour\n   raisons sanitaires.\n\nCette mission n’est accessible qu’aux personnes majeures, de moins de 70 ans et\nen bonne santé.\n\nPour me rendre sur site, j’évite d’emprunter les transports en commun lorsque\ncela est possible, notamment aux heures de pointe. Si j’emprunte les transports\nen commun en Ile-de-France, je me munis de l’autorisation de déplacement que\nj’aurai renseigné et du justificatif fourni par la structure au profit de\nlaquelle je réalise la mission. Sur place, je respecte les règles de sécurité et\nles gestes barrières afin de me protéger et de protéger les autres. Au moindre\ndoute d’infection, je ne me mobilise pas et je reste chez moi.\n\n\\n\\nObjectifs: \\n\n\nEn cette période de crise sanitaire, les personnes les plus démunies doivent\naccéder aux biens qui leur sont vitaux au quotidien. Les associations d’aide\nalimentaire et non alimentaire ainsi que les associations de lutte contre\nl’exclusion et la pauvreté ont besoin de la mobilisation citoyenne pour assurer\nla continuité de toutes ces activités essentielles. Ce besoin s’étend aux\nétablissement hôteliers qui accueillent des personnes en isolement.',
				débutContrat: '31/10/2022',
				id: '5f9bfffb959e010008e97bab',
				nomEntreprise: 'Coopaz',
				titre: 'Je distribue des produits de première nécessité et des repas aux plus démunis, dans la rue ou au sein d’établissements dédiés',
				étiquetteList: [
					'Azur (40140)',
					'31/10/2022',
				],
			},
			{
				description: 'Je suis mis en contact avec une personne isolée par le biais d’une association\nou d’un organisme public :\n\n • j’échange avec la personne, prends de ses nouvelles ;\n • je fais remonter des alertes aux structures, si je le juge nécessaire, sur\n   l’état de santé – mentale ou physique – et les besoins exprimés de la\n   personne contactée.\n\nLorsque je m’engage à prendre contact avec des personnes âgées, en situation de\nhandicap, en situation de pauvreté, de précarité, ou d’isolement, je m’engage à\nsuivre les recommandations précisées dans les kits de formation.\n\nCette mission est accessible à tous les citoyens qui le souhaitent.\n\n\\n\\nObjectifs: \\n\n\nEn cette période de crise sanitaire et de confinement, il est essentiel que les\npersonnes les plus en risque d’isolement relationnel puissent bénéficier de\ncontacts réguliers et bienveillants. Cet isolement peut, en effet, être rompu en\norganisant un lien par téléphone, visio ou par d’autres moyens de communication.',
				débutContrat: '30/10/2020',
				id: '5f9bffff959e010008e97bec',
				nomEntreprise: 'COLLECTIF DES MAMANS',
				titre: 'Je maintiens un lien avec des personnes fragiles isolées (âgées, malades, situation de handicap, de pauvreté, de précarité, etc.)',
				étiquetteList: [
					'Bourges (18000)',
					'30/10/2020',
				],
			},
		],
		...override,
	};
}

export function anAmbassadeurDuDonDeVêtementMission(): Mission {
	return {
		description: ' • Faire connaître les activités du Relais et inciter au don de textiles dans\n   votre quartier \n • Prévenir en cas de débordement ou de dégradation constatés d’une borne\n • Sensibiliser vos voisins \n • Participer à des évènements de collecte de collecte à proximité de son\n   domicile\n\n\\n\\nObjectifs: \\n\n\nNous désirons innover en développant un réseau d’ambassadeurs bénévoles autour\ndu geste du don dans la ville de Poissy, chaque ambassadeur se voyant assigné un\npoint de collecte - « une borne » - à proximité de son domicile et pouvant par\nla suite organiser des animations autour de la réduction des déchets et du tri\ndes textiles. ',
		duréeContrat: 5,
		débutContrat: '9 mai 2022',
		id: '6278e8ced7dda60703c3ca40',
		localisation: 'Poissy (78 - Yvelines - Île-de-France)',
		nomEntreprise: 'Ebs le relais val de seine',
		titre: 'Je deviens Ambassadeur du don des vêtements',
		url: 'https://api.api-engagement.beta.gouv.fr/r/6278e8ced7dda60703c3ca40/5fa438777a2fa04fc30aeaa6',
		étiquetteList: [
			'Poissy (78300)',
			'Dès le 9 mai 2022',
		],
	};
}
