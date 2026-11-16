import { formatNumberWithSpace } from '~/client/utils/formatNumberWithSpace';
import { Erreur } from '~/server/errors/erreur.types';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';


const NOM_DU_SITE = ' | 1jeune1solution';
const SERVICE_INDISPONIBLE_TITLE = ' - Service indisponible';

export type IntitulesResultats = {
	singulier: string
	pluriel: string
	aucun: string
};

type Pagination = {
	pageCourante?: number | string
	nombreResultatsParPage: number
	nombrePagesMax?: number
};

type RechercheDocumentTitle = {
	titreParDefaut: string
	intitules: IntitulesResultats
	nombreResultats?: number
	criteres?: Array<string | undefined>
	pagination?: Pagination
	erreur?: Erreur
};

function formatPagination(nombreResultats: number, pagination?: Pagination): string {
	if (!pagination) {
		return '';
	}
	const nombreDePages = Math.min(
		Math.ceil(nombreResultats / pagination.nombreResultatsParPage),
		pagination.nombrePagesMax ?? Infinity,
	);
	if (nombreDePages <= 1) {
		return '';
	}
	const pageCourante = Number(pagination.pageCourante) || 1;
	return ` (page ${pageCourante}/${nombreDePages})`;
}

export function formatRechercherSolutionDocumentTitle({
	titreParDefaut,
	intitules,
	nombreResultats,
	criteres = [],
	pagination,
	erreur,
}: RechercheDocumentTitle): string {
	if (erreur === ErreurMetier.DEMANDE_INCORRECTE) {
		return `Erreur : ${titreParDefaut}${NOM_DU_SITE}`;
	}
	if (erreur === ErreurMetier.SERVICE_INDISPONIBLE) {
		return `${titreParDefaut}${SERVICE_INDISPONIBLE_TITLE}${NOM_DU_SITE}`;
	}
	if (erreur || nombreResultats === undefined) {
		return `${titreParDefaut}${NOM_DU_SITE}`;
	}

	const resultats = nombreResultats === 0
		? intitules.aucun
		: `${formatNumberWithSpace(nombreResultats)} ${nombreResultats > 1 ? intitules.pluriel : intitules.singulier}`;
	const criteresRenseignes = criteres.filter((critere) => critere);
	const pourCriteres = criteresRenseignes.length > 0 ? ` pour ${criteresRenseignes.join(', ')}` : '';

	return `${resultats}${pourCriteres}${formatPagination(nombreResultats, pagination)}${NOM_DU_SITE}`;
}
