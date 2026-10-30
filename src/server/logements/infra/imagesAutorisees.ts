/**
 * next/image refuse (et fait échouer le rendu de la page) les images dont l‘hôte n‘est pas déclaré dans next.config.js.
 * Les annonces viennent de sources externes : on ne garde que les images des hôtes déclarés (LOGEMENT_IMAGE_URL_LIST,
 * la même liste que next.config.js), la carte affichant sinon une image par défaut.
 */
export function filtrerImagesAutorisees(imagesUrl: Array<string>, hotesAutorises: Array<string>): Array<string> {
	return imagesUrl.filter((imageUrl) => {
		const hote = hoteDe(imageUrl);
		return hote !== undefined && hotesAutorises.some((hoteAutorise) => correspond(hote, hoteAutorise));
	});
}

export function listeDesHotesAutorises(configuration: string): Array<string> {
	return configuration.split(',').map((hote) => hote.trim()).filter(Boolean);
}

function hoteDe(imageUrl: string): string | undefined {
	try {
		const url = new URL(imageUrl);
		return url.protocol === 'https:' ? url.hostname : undefined;
	} catch {
		return undefined;
	}
}

// NOTE : mêmes jokers que les remotePatterns de next/image : `*` pour un sous-domaine, `**` pour plusieurs
function correspond(hote: string, motif: string): boolean {
	if (motif.startsWith('**.')) return hote.endsWith(motif.slice(2));
	if (motif.startsWith('*.')) {
		const suffixe = motif.slice(1);
		return hote.endsWith(suffixe) && !hote.slice(0, -suffixe.length).includes('.');
	}
	return hote === motif;
}
