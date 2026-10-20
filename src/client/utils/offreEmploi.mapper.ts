import { OffreCheckboxFiltre, OffreTypeDeContrat, ReferentielDomaine } from '~/server/offres/domain/offre';

export function mapTypeDeContratToOffreEmploiCheckboxFiltre(typeDeContratList: OffreTypeDeContrat[]): OffreCheckboxFiltre[] {
	return typeDeContratList.map((typeDeContrat) => {
		return {
			libellé: typeDeContrat.libelléCourt,
			valeur: typeDeContrat.valeur.toString(),
		};
	});
}

export function mapReferentielDomaineToOffreCheckboxFiltre(domaineList: ReferentielDomaine[]): OffreCheckboxFiltre[] {
	return domaineList.map((domaine) => {
		return {
			libellé: domaine.libelle,
			valeur: domaine.code,
		};
	});
}
