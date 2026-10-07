import { FormationFiltre } from '~/server/formations/domain/formation';

export function mapFiltreToQueryParams(filtre: FormationFiltre): string {
	return 'romes='.concat(mapFiltreCodeRomes(filtre.codeRomes))
		.concat(`&longitude=${filtre.longitudeCommune}`)
		.concat(`&latitude=${filtre.latitudeCommune}`)
		.concat(`&radius=${filtre.distanceCommune}`)
		.concat(filtre.niveauEtudes ? `&target_diploma_level=${filtre.niveauEtudes}` : '');
}

function mapFiltreCodeRomes(codeRomes: Array<string>): string {
	return codeRomes.map((codeRome) => codeRome.toUpperCase()).join(',');
}
