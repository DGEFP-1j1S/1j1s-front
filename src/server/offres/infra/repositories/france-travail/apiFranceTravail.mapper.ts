
import {
	CONTRAT_CDD,
	CONTRAT_CDI,
	CONTRAT_INTÉRIMAIRE,
	CONTRAT_SAISONNIER,
	Offre,
	OffreDuréeTravail,
	OffreExpérience,
	OffreFormation,
	OffreTypeDeContrat,
	RésultatsRechercheOffre,
} from '~/server/offres/domain/offre';
import {
	OffreResponse,
	OffreResponseCompétence,
	OffreResponseDuréeTravail,
	OffreResponseExpérience,
	OffreResponseFormation,
	OffreResponseLieuTravail,
	OffreResponseQualitéeProfessionnelle,
	OffreResponseTypeContrat,
	RésultatsRechercheOffreResponse,
	RésultatsRechercheOffreResponseAgregation,
	RésultatsRechercheOffreResponseFiltresPossibles,
} from '~/server/offres/infra/repositories/france-travail/franceTravailOffre.response';
import {
	RésultatsRéférentielCommunesResponse,
} from '~/server/offres/infra/repositories/france-travail/apiFranceTravailReferentiel.repository';

export function mapRésultatsRechercheOffre(response: RésultatsRechercheOffreResponse): RésultatsRechercheOffre {
	return {
		nombreRésultats: getNombreRésultats(response.filtresPossibles),
		résultats: response.resultats.map(mapOffre),
	};
}

export function mapOffre(offreResponse: OffreResponse): Offre {
	const lieuTravail = mapLieuTravail(offreResponse.lieuTravail);
	const expérience = mapExpérience(offreResponse.experienceExige);
	const typeContrat = mapTypeContrat(offreResponse.typeContrat);
	const duréeTravail = mapDuréeTravail(offreResponse.dureeTravailLibelleConverti);
	const étiquetteList = [lieuTravail, expérience, typeContrat && typeContrat.libelléCourt, duréeTravail].filter((tag) => tag !== undefined);
	return {
		compétenceList: mapCompétenceList(offreResponse.competences),
		description: offreResponse.description,
		duréeTravail,
		entreprise: {
			logo: offreResponse.entreprise?.logo,
			nom: offreResponse.entreprise?.nom,
		},
		expérience,
		formationList: mapFormationList(offreResponse.formations),
		id: offreResponse.id,
		intitulé: offreResponse.intitule,
		lieuTravail,
		qualitéeProfessionnelleList: mapQualitéeProfessionnelleList(offreResponse.qualitesProfessionnelles),
		salaire: offreResponse.salaire?.libelle || offreResponse.salaire?.commentaire,
		typeContrat,
		urlOffreOrigine: offreResponse.origineOffre.urlOrigine,
		étiquetteList,
	};
}

function mapDuréeTravail(duréeTravailResponse?: OffreResponseDuréeTravail): OffreDuréeTravail | undefined {
	switch (duréeTravailResponse) {
		case 'Temps partiel':
			return OffreDuréeTravail.TEMPS_PARTIEL;
		case 'Temps plein':
			return OffreDuréeTravail.TEMPS_PLEIN;
		default:
			return undefined;
	}
}

function mapTypeContrat(typeContrat: OffreResponseTypeContrat): OffreTypeDeContrat | undefined {
	switch (typeContrat) {
		case 'CDD':
			return CONTRAT_CDD;
		case 'CDI':
			return CONTRAT_CDI;
		case 'MIS':
			return CONTRAT_INTÉRIMAIRE;
		case 'SAI':
			return CONTRAT_SAISONNIER;
		default:
			return undefined;
	}
}

export function mapFormationList(formationResponse?: OffreResponseFormation[]): OffreFormation[] {
	if (!formationResponse) {
		return [];
	}
	const formationResponseSanitized = formationResponse.filter((formation) => formation.niveauLibelle !== undefined && formation.commentaire !== undefined);
	return formationResponseSanitized.map((formation) => ({
		...formation.commentaire && { commentaire : formation.commentaire },
		...formation.niveauLibelle && { libellé : formation.niveauLibelle },
	}));
}

export function mapCompétenceList(compétenceResponse?: OffreResponseCompétence[]): string[] {
	if (!compétenceResponse) return [];

	const compétenceMappée = compétenceResponse.map((compétence) => (compétence.libelle));
	return compétenceMappée.filter((compétence) => compétence !== undefined);
}

export function mapQualitéeProfessionnelleList(qualitéeProfessionnelleResponse?: OffreResponseQualitéeProfessionnelle[]): string[] {
	if (!qualitéeProfessionnelleResponse) {
		return [];
	}
	const qualitéeProfessionnelleMappée = qualitéeProfessionnelleResponse.map((qualitéeProfessionnelle) => (qualitéeProfessionnelle.libelle));
	return qualitéeProfessionnelleMappée.filter((qualitéeProfessionnelle) => qualitéeProfessionnelle !== undefined);
}

function mapLieuTravail(lieuTravailResponse?: OffreResponseLieuTravail): string | undefined {
	if (!lieuTravailResponse) {
		return undefined;
	}
	const lieuTravail = lieuTravailResponse.libelle.split(' - ');
	const ville = lieuTravail[1];
	const département = lieuTravail[0];
	return ville ? `${ville} (${département})` : `${département}`;
}

function mapExpérience(expérienceExigéeResponse?: OffreResponseExpérience): OffreExpérience | undefined {
	switch (expérienceExigéeResponse) {
		case 'D':
			return OffreExpérience.DEBUTANT_ACCEPTE;
		case 'S':
			return OffreExpérience.EXPERIENCE_SOUHAITEE;
		case 'E':
			return OffreExpérience.EXPERIENCE_EXIGEE;
		default:
			return undefined;
	}
}

function sumRésultatsAgrégation(agrégationResponseList: RésultatsRechercheOffreResponseAgregation[]): number {
	return agrégationResponseList.reduce((nbRésultats, agrégationResponse) => nbRésultats + agrégationResponse.nbResultats, 0);
}

function getNombreRésultats(filtrePossibleResponseList: RésultatsRechercheOffreResponseFiltresPossibles[] | undefined): number {
	if (!filtrePossibleResponseList?.length) return 0;

	const maxNombreRésultatList = filtrePossibleResponseList.flatMap((filtrePossibleResponse) => sumRésultatsAgrégation(filtrePossibleResponse.agregation));
	return Math.max(...maxNombreRésultatList);
}

const enum CodeInseeCommuneAvecArrondissement  {
  CODE_INSEE_PARIS = '75056',
  CODE_INSEE_LYON = '69123',
  CODE_INSEE_MARSEILLE = '13055',
}

const enum CodeInseeCommunePremierArrondissement  {
  CODE_INSEE_PARIS_01 = '75101',
  CODE_INSEE_LYON_01 = '69381',
  CODE_INSEE_MARSEILLE_01 = '13201',
}

function checkCodeCommuneAvecArrondissment(codeToFindInRéférentiel: string): string {
	switch (codeToFindInRéférentiel) {
		case CodeInseeCommuneAvecArrondissement.CODE_INSEE_PARIS:
			return CodeInseeCommunePremierArrondissement.CODE_INSEE_PARIS_01;
		case CodeInseeCommuneAvecArrondissement.CODE_INSEE_MARSEILLE:
			return CodeInseeCommunePremierArrondissement.CODE_INSEE_MARSEILLE_01;
		case CodeInseeCommuneAvecArrondissement.CODE_INSEE_LYON:
			return CodeInseeCommunePremierArrondissement.CODE_INSEE_LYON_01;
		default:
			return codeToFindInRéférentiel;
	}
}

export function mapCodeInsee(response: RésultatsRéférentielCommunesResponse[], codeToFindInRéférentiel: string): string {
	const found = response.find((response) => response.code === codeToFindInRéférentiel);
	return found ? found.code : checkCodeCommuneAvecArrondissment(codeToFindInRéférentiel);
}
