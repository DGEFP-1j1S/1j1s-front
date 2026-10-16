import { NiveauRequisLibelle } from '~/server/formations/domain/formation';

export function mapNiveauFormation(niveauRequis: string | undefined): NiveauRequisLibelle | 'Autre' {
	switch (niveauRequis) {
		case '3 (CAP...)':
			return NiveauRequisLibelle['NIVEAU_3'];
		case '4 (BAC...)':
			return NiveauRequisLibelle['NIVEAU_4'];
		case '5 (BTS, DEUST...)':
			return NiveauRequisLibelle['NIVEAU_5'];
		case '6 (Licence, BUT...)':
			return NiveauRequisLibelle['NIVEAU_6'];
		case '7 (Master, titre ingénieur...)':
			return NiveauRequisLibelle['NIVEAU_7_8'];
		default:
			return 'Autre';
	}
}
