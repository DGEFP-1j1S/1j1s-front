import { useEffect, useMemo, useState } from 'react';

import {
	FormulaireRechercheStages3eEt2de,
} from '~/client/components/features/Stages3eEt2de/Rechercher/FormulaireRecherche/FormulaireRechercheStages3eEt2de';
import {
	ListeResultatsStage3eEt2de,
} from '~/client/components/features/Stages3eEt2de/Rechercher/FormulaireRecherche/ListeResultatsStage3eEt2de';
import { Head } from '~/client/components/head/Head';
import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { LightHero, LightHeroPrimaryText, LightHeroSecondaryText } from '~/client/components/ui/Hero/LightHero';
import { TagList } from '~/client/components/ui/Tag/TagList';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { useStage3eEt2deQuery } from '~/client/hooks/useStage3eEt2deQuery';
import { Stage3eEt2deService } from '~/client/services/stage3eEt2de/stage3eEt2de.service';
import empty from '~/client/utils/empty';
import { formatRechercherSolutionDocumentTitle } from '~/client/utils/formatRechercherSolutionDocumentTitle.util';
import { isSuccess } from '~/server/errors/either';
import { Erreur } from '~/server/errors/erreur.types';
import { ResultatRechercheStage3eEt2de } from '~/server/stage-3e-et-2de/domain/stage3eEt2de';

const PREFIX_TITRE_PAGE = 'Rechercher un stage de 3e et 2de';

export default function RechercherStages3eEt2de() {
	const stage3eEt2deQuery = useStage3eEt2deQuery();
	const stage3eEt2deService = useDependency<Stage3eEt2deService>('stage3eEt2deService');

	const [title, setTitle] = useState<string>(`${PREFIX_TITRE_PAGE} | 1jeune1solution`);
	const [isLoading, setIsLoading] = useState(!empty(stage3eEt2deQuery));
	const [erreurRecherche, setErreurRecherche] = useState<Erreur | undefined>(undefined);
	const [stage3eEt2deList, setStage3eEt2deList] = useState<ResultatRechercheStage3eEt2de | undefined>(undefined);
	const [previousQuery, setPreviousQuery] = useState(stage3eEt2deQuery);

	if (stage3eEt2deQuery !== previousQuery) {
		setPreviousQuery(stage3eEt2deQuery);
		if (!empty(stage3eEt2deQuery)) {
			setIsLoading(true);
			setErreurRecherche(undefined);
		}
	}

	useEffect(() => {
		if (empty(stage3eEt2deQuery)) {
			return;
		}

		stage3eEt2deService.rechercherStage3eEt2de(stage3eEt2deQuery)
			.then((response) => {
				if (isSuccess(response)) {
					setTitle(formatRechercherSolutionDocumentTitle(`${PREFIX_TITRE_PAGE}${response.result.nombreDeResultats === 0 ? ' - Aucun résultat' : ''}`));
					setStage3eEt2deList(response.result);
				} else {
					setTitle(formatRechercherSolutionDocumentTitle(PREFIX_TITRE_PAGE, response.errorType));
					setErreurRecherche(response.errorType);
				}
				setIsLoading(false);
			});
	}, [stage3eEt2deService, stage3eEt2deQuery]);

	const messageResultatsRecherche: string = useMemo(() => {
		const messageResultatRechercheSplit: string[] = [`${stage3eEt2deList?.nombreDeResultats}`];
		if (stage3eEt2deList && stage3eEt2deList.nombreDeResultats > 1) {
			messageResultatRechercheSplit.push('entreprises accueillantes');
		} else if (stage3eEt2deList && stage3eEt2deList.nombreDeResultats === 1) {
			messageResultatRechercheSplit.push('entreprise accueillante');
		} else {
			return '';
		}
		if (stage3eEt2deQuery.libelleMetier) {
			messageResultatRechercheSplit.push(`pour ${stage3eEt2deQuery.libelleMetier}`);
		}
		return messageResultatRechercheSplit.join(' ');
	}, [stage3eEt2deList, stage3eEt2deQuery.libelleMetier]);

	const etiquettesRecherche = useMemo(() => {
		const filtreList: string[] = [];
		if (stage3eEt2deQuery.ville && stage3eEt2deQuery.codePostal) {
			filtreList.push(`${stage3eEt2deQuery.ville} (${stage3eEt2deQuery.codePostal})`);
		}
		if (filtreList.length === 0) return;
		return <TagList list={filtreList} aria-label="Filtres de la recherche" />;
	}, [stage3eEt2deQuery.codePostal, stage3eEt2deQuery.ville]);

	return (
		<>
			<Head
				title={title}
				description="Des milliers d’entreprises prêtes à vous accueillir pour votre stage de 3e et 2de"
				robots="index,follow" />
			<main id="contenu">
				<RechercherSolutionLayout
					banniere={<BaniereStages3eEt2de />}
					erreurRecherche={erreurRecherche}
					etiquettesRecherche={etiquettesRecherche}
					formulaireRecherche={<FormulaireRechercheStages3eEt2de />}
					isChargement={isLoading}
					isEtatInitial={empty(stage3eEt2deQuery)}
					listeSolutionElement={<ListeResultatsStage3eEt2de resultatList={stage3eEt2deList} />}
					messageResultatRecherche={messageResultatsRecherche}
					nombreTotalSolutions={stage3eEt2deList?.nombreDeResultats ?? 0} />
			</main>
		</>
	);
}

function BaniereStages3eEt2de() {
	return (
		<LightHero>
			<h1>
				<LightHeroPrimaryText>Des milliers d’entreprises prêtes à vous accueillir</LightHeroPrimaryText>
				<LightHeroSecondaryText>pour votre stage de 3e et 2de</LightHeroSecondaryText>
			</h1>
		</LightHero>
	);
}
