import { randomUUID } from 'crypto';

import { RemunerationPeriode } from '~/server/stages/domain/remunerationPeriode';
import { OffreDeStage, OffreDeStageDepot } from '~/server/stages/domain/stages';
import { SourceDesDonnées } from '~/server/stages/repository/sourceDesDonnéesStage';
import { OffreStageDepotStrapi, OffreStageResponseStrapi } from '~/server/stages/repository/strapiStages';

export function mapOffreStage(response: OffreStageResponseStrapi): OffreDeStage {
	return {
		dateDeDebutMax: response.dateDeDebutMax,
		dateDeDebutMin: response.dateDeDebutMin,
		description: response.description,
		domaines: response.domaines?.map((domaine) => domaine.nom) || [],
		dureeEnJour: response.dureeEnJour ?? undefined,
		dureeEnJourMax: response.dureeEnJourMax ?? undefined,
		employeur: response.employeur ? {
			description: response.employeur.description || undefined,
			logoUrl: response.employeur.logoUrl || undefined,
			nom: response.employeur.nom,
			siteUrl: response.employeur.siteUrl || undefined,
		} : undefined,
		id: response.id,
		localisation: response.localisation ? {
			codePostal: response.localisation.codePostal || undefined,
			departement: response.localisation.departement || undefined,
			pays: response.localisation.pays || undefined,
			region: response.localisation.region || undefined,
			ville: response.localisation.ville || undefined,
		} : undefined,
		remunerationMax: response.remunerationMax ?? undefined,
		remunerationMin: response.remunerationMin ?? undefined,
		remunerationPeriode: response.remunerationPeriode ?? undefined,
		slug: response.slug,
		source: response.source || undefined,
		teletravailPossible: response.teletravailPossible ?? undefined,
		titre: response.titre,
		urlDeCandidature: response.urlDeCandidature || undefined,
	};
}

export function mapToStrapiDepotOffreDeStage(body: OffreDeStageDepot): OffreStageDepotStrapi {
	const valeurPublishedAtPourAjouterOffreEnDraftStrapi = null;
	return {
		dateDeDebutMax: body.dateDeDebutMax,
		dateDeDebutMin: body.dateDeDebutMin,
		description: body.description,
		domaines: body.domaine ? [{
			nom: body.domaine,
		}] : [],
		dureeEnJour: Number(body.duree),
		employeur: {
			description: body.employeur.description,
			email: body.employeur.email,
			logoUrl: body.employeur.logoUrl || null,
			nom: body.employeur.nom,
			siteUrl: body.employeur.siteUrl || null,
		},
		identifiantSource: randomUUID(),
		localisation: {
			adresse: body.localisation.adresse,
			codePostal: body.localisation.codePostal,
			departement: body.localisation.departement || null,
			pays: body.localisation.pays,
			region: body.localisation.region || null,
			ville: body.localisation.ville,
		},
		publishedAt: valeurPublishedAtPourAjouterOffreEnDraftStrapi,

		remunerationMax: body.remuneration,
		remunerationMin: body.remuneration,
		remunerationPeriode: body.remuneration ? RemunerationPeriode.MONTHLY : undefined,
		source: SourceDesDonnées.INTERNE,
		teletravailPossible: body.teletravailPossible,
		titre: body.titre,
		urlDeCandidature: body.urlDeCandidature,
	};
}
