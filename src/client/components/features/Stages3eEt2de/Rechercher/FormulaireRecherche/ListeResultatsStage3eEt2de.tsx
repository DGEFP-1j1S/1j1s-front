import {
	ListeRésultatsRechercherSolution,
} from '~/client/components/layouts/RechercherSolution/ListeRésultats/ListeRésultatsRechercherSolution';
import {
	ResultatRechercherSolution,
} from '~/client/components/layouts/RechercherSolution/Resultat/ResultatRechercherSolution';
import { ModeDeContact } from '~/server/stage-3e-et-2de/domain/candidatureStage3eEt2de';
import { ResultatRechercheStage3eEt2de, Stage3eEt2de } from '~/server/stage-3e-et-2de/domain/stage3eEt2de';

import styles from './ListeResultatsStage3eEt2de.module.scss';

interface ListeResultatsStage3eEt2deProps {
	resultatList: ResultatRechercheStage3eEt2de | undefined;
}

export function ListeResultatsStage3eEt2de({ resultatList }: ListeResultatsStage3eEt2deProps) {
	if (!resultatList || resultatList.resultats.length === 0) {
		return undefined;
	}

	return (
		<ListeRésultatsRechercherSolution
			aria-label={'Stages de 3e et 2de'}>
			{resultatList.resultats.map((stage, index) => <ResultatStage3eEt2de stage3eEt2de={stage} key={index} />)}
		</ListeRésultatsRechercherSolution>
	);
}

function ResultatStage3eEt2de({ stage3eEt2de }: { stage3eEt2de: Stage3eEt2de }) {
	const étiquetteOffreList: string[] = [];

	if (stage3eEt2de.nombreDeSalaries) {
		étiquetteOffreList.push(`${stage3eEt2de.nombreDeSalaries} salariés`);
	}

	if (stage3eEt2de.accessiblePersonnesEnSituationDeHandicap) {
		étiquetteOffreList.push('Handi-accessible');
	}

	const paramsLienOffre = {
		appellationCodes: stage3eEt2de.appellationCodes.toString(),
		modeDeContact: stage3eEt2de.modeDeContact ? stage3eEt2de.modeDeContact.toString() : '',
		nomEntreprise: stage3eEt2de.nomEntreprise,
		siret: stage3eEt2de.siret,
	};

	function getLinkLabel(modeDeContact: ModeDeContact): string {
		switch (modeDeContact){
			case ModeDeContact.EMAIL:
				return 'Candidater par email';
			case ModeDeContact.PHONE:
				return 'Candidater par téléphone';
			case ModeDeContact.IN_PERSON:
				return 'Candidater en personne';
		}
	}

	const lienOffre = stage3eEt2de.modeDeContact ? `/stages-3e-et-2de/candidater?${new URLSearchParams(paramsLienOffre).toString()}` : undefined;
	const intituleLienOffre = stage3eEt2de.modeDeContact ? getLinkLabel(stage3eEt2de.modeDeContact) : undefined;

	return (
		<li>
			<ResultatRechercherSolution
				intituléOffre={stage3eEt2de.nomEntreprise}
				sousTitreOffre={(
					<>
						<p>{stage3eEt2de.domaine}</p>
						<p>{stage3eEt2de.adresse.rueEtNumero}, {stage3eEt2de.adresse.codePostal} {stage3eEt2de.adresse.ville}</p>
						<ul className={styles.listeMetiers} aria-label="Métiers proposés">
							{stage3eEt2de.appellationLibelle.map((appellationLibelle) =>
								<li key={appellationLibelle}><p>{appellationLibelle}</p></li>,
							)}
						</ul>
					</>
				)}
				étiquetteOffreList={étiquetteOffreList}
				lienOffre={lienOffre}
				intituléLienOffre={intituleLienOffre}
				className={styles.carteResultat} />
		</li>
	);
}
