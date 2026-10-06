import { Formation, ResultatRechercheFormation } from '~/server/formations/domain/formation';
import { mapNiveauFormation } from '~/server/formations/domain/formation.mapper';

import {
	ApiAlternanceFormationRechercheResponse,
	ApiAlternanceFormationResponse, ApiAlternanceLieuFormation,
} from './apiLaBonneAlternanceFormation';

export const mapResultatRechercheFormation = (response: ApiAlternanceFormationRechercheResponse): Array<ResultatRechercheFormation> => {
	return response.data.map((formation) => {
		const [longitude, latitude] = formation.lieu.geolocalisation.coordinates;
		return {
			adresse: mapAdresseFormation(formation.lieu),
			codeCertification: formation.certification.valeur.identifiant.cfd ?? undefined,
			codePostal: formation.lieu.adresse.code_postal ?? undefined,
			id: formation.identifiant.cle_ministere_educatif,
			latitude,
			longitude,
			nomEntreprise: mapNomOrganismeFormateur(formation),
			tags: [formation.lieu.adresse.commune.nom, mapNiveauFormation(mapNiveauDiplomeEuropeen(formation))],
			titre: mapTitre(formation),
		};
	});
};

export const mapFormation = (formation: ApiAlternanceFormationResponse): Formation => {
	const [longitude, latitude] = formation.lieu.geolocalisation.coordinates;
	return {
		adresse: {
			adresseComplete: mapAdresseFormation(formation.lieu),
			codePostal: formation.lieu.adresse.code_postal ?? undefined,
			latitude,
			longitude,
		},
		description: formation.contenu_educatif.contenu,
		dureeIndicative: mapDureeIndicative(formation.modalite.duree_indicative),
		nomEntreprise: mapNomOrganismeFormateur(formation),
		objectif: formation.contenu_educatif.objectif,
		tags: [formation.lieu.adresse.commune.nom],
		titre: mapTitre(formation),
	};
};

export const mapResultatRechercheFormationToFormation = (resultatRechercheFormation: ResultatRechercheFormation): Formation => ({
	adresse: {
		adresseComplete: resultatRechercheFormation.adresse,
		codePostal: resultatRechercheFormation.codePostal,
		latitude: resultatRechercheFormation.latitude,
		longitude: resultatRechercheFormation.longitude,
	},
	nomEntreprise: resultatRechercheFormation.nomEntreprise,
	tags: [resultatRechercheFormation.tags[0] || ''],
	titre: resultatRechercheFormation.titre,
});

// NOTE (JUFE 05-10-2026): les intitulés RNCP des diplômes nationaux sont suffixés « (fiche nationale) », qui n’a pas de sens pour l’usager.
const SUFFIXE_FICHE_NATIONALE = / \(fiche nationale\)$/;

function mapTitre(formation: ApiAlternanceFormationResponse): string {
	const intitule = formation.certification.valeur.intitule;
	if (intitule.rncp) return intitule.rncp.replace(SUFFIXE_FICHE_NATIONALE, '');
	return intitule.cfd?.long ?? '';
}

function mapNomOrganismeFormateur(formation: ApiAlternanceFormationResponse): string | undefined {
	const organisme = formation.formateur.organisme;
	if (!organisme) return undefined;
	return organisme.etablissement.enseigne ?? organisme.unite_legale.raison_sociale;
}

function mapNiveauDiplomeEuropeen(formation: ApiAlternanceFormationResponse): string | undefined {
	const niveau = formation.certification.valeur.intitule.niveau;
	return niveau.cfd?.europeen ?? niveau.rncp?.europeen ?? undefined;
}

function mapDureeIndicative(dureeEnAnnees: number): string {
	return dureeEnAnnees > 1 ? `${dureeEnAnnees} ans` : `${dureeEnAnnees} an`;
}

function mapAdresseFormation(lieuFormation: ApiAlternanceLieuFormation): string | undefined{
	if (!lieuFormation.adresse.label) return undefined
	return `${lieuFormation.adresse.label ?? ''} - ${lieuFormation.adresse.code_postal ?? ''} ${lieuFormation.adresse.commune.nom ?? ''}`
}
