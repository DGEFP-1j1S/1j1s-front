import { OffreCheckboxFiltre, OffreTypeDeContrat, RéférentielDomaine } from '~/server/offres/domain/offre';

export function mapTypeDeContratToOffreEmploiCheckboxFiltre(typeDeContratList: OffreTypeDeContrat[]): OffreCheckboxFiltre[] {
	return typeDeContratList.map((typeDeContrat) => {
		return {
			libellé: typeDeContrat.libelléCourt,
			valeur: typeDeContrat.valeur.toString(),
		};
	});
}

export function mapRéférentielDomaineToOffreCheckboxFiltre(domaineList: RéférentielDomaine[]): OffreCheckboxFiltre[] {
	return domaineList.map((domaine) => {
		return {
			libellé: domaine.libelle,
			valeur: domaine.code,
		};
	});
}
