import { getTagsFromAnnonce } from '~/client/components/features/EmploisEurope/tags.utils';
import {
	ListeRésultatsRechercherSolution,
} from '~/client/components/layouts/RechercherSolution/ListeRésultats/ListeRésultatsRechercherSolution';
import {
	ResultatRechercherSolution,
} from '~/client/components/layouts/RechercherSolution/Resultat/ResultatRechercherSolution';
import { EmploiEurope } from '~/server/emplois-europe/domain/emploiEurope';

interface ListeResultatsEmploiEuropeProps {
	resultatList: EmploiEurope[];
}

export function ListeResultatsEmploiEurope({ resultatList }: ListeResultatsEmploiEuropeProps) {
	if (!resultatList.length) {
		return null;
	}

	return (
		<ListeRésultatsRechercherSolution
			aria-label={'Offres d’emplois en Europe'}>
			{resultatList.map((emploiEurope) => ResultatEmploiEurope(emploiEurope))}
		</ListeRésultatsRechercherSolution>
	);
}

function ResultatEmploiEurope(emploiEurope: EmploiEurope) {
	const codeLangueDeLOffre = emploiEurope.codeLangueDeLOffre ?? '';

	return (
		<li key={emploiEurope.id}>
			<ResultatRechercherSolution
				intituléOffre={emploiEurope.titre ? <span lang={codeLangueDeLOffre}>{emploiEurope.titre}</span> : 'Offre d’emploi sans titre'}
				lienOffre={`/emplois-europe/${emploiEurope.id}`}
				sousTitreOffre={emploiEurope.nomEntreprise}
				étiquetteOffreList={getTagsFromAnnonce(emploiEurope)} />
		</li>
	);
}
