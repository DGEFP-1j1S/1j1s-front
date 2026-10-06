import { NiveauRequisLibelle } from '~/server/formations/domain/formation';

export function mapNiveauFormation(niveauDiplomeEuropeen: string | undefined): NiveauRequisLibelle | 'Autre' {
	switch (niveauDiplomeEuropeen) {
		case '3':
			return NiveauRequisLibelle['NIVEAU_3'];
		case '4':
			return NiveauRequisLibelle['NIVEAU_4'];
		case '5':
			return NiveauRequisLibelle['NIVEAU_5'];
		case '6':
			return NiveauRequisLibelle['NIVEAU_6'];
		case '7':
		case '8':
			return NiveauRequisLibelle['NIVEAU_7_8'];
		default:
			return 'Autre';
	}
}
