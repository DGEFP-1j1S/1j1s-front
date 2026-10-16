export function mapFiltreNiveauEtudeVise(niveau: string): string | undefined {
	switch (niveau) {
		case '3':
			return '3 (CAP...)';
		case '4':
			return '4 (BAC...)';
		case '5':
			return '5 (BTS, DEUST...)';
		case '6':
			return '6 (Licence, BUT...)';
		case '7':
			return '7 (Master, titre ingénieur...)';
		default:
			return undefined;
	}
}
