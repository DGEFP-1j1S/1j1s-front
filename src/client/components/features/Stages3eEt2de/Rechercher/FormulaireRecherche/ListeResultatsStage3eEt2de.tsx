import { Carte } from '~/client/dsfr';
import { ModeDeContact } from '~/server/stage-3e-et-2de/domain/candidatureStage3eEt2de';
import { ResultatRechercheStage3eEt2de, Stage3eEt2de } from '~/server/stage-3e-et-2de/domain/stage3eEt2de';

interface ListeResultatsStage3eEt2deProps {
	resultatList: ResultatRechercheStage3eEt2de | undefined;
}

export function ListeResultatsStage3eEt2de({ resultatList }: ListeResultatsStage3eEt2deProps) {
	if (!resultatList || resultatList.resultats.length === 0) return null;

	return (
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label="Stages de 3e et 2de">
			{resultatList.resultats.map((stage, index) => (
				<ResultatStage3eEt2de stage3eEt2de={stage} key={index} />
			))}
		</ul>
	);
}

function ResultatStage3eEt2de({ stage3eEt2de }: { stage3eEt2de: Stage3eEt2de }) {
	const tags: string[] = [];

	if (stage3eEt2de.nombreDeSalaries) {
		tags.push(`${stage3eEt2de.nombreDeSalaries} salariés`);
	}

	if (stage3eEt2de.accessiblePersonnesEnSituationDeHandicap) {
		tags.push('Handi-accessible');
	}

	if (stage3eEt2de.modeDeContact) {
		tags.push(getModeDeContactLabel(stage3eEt2de.modeDeContact));
	}

	function getLienOffre() {
		if (!stage3eEt2de.modeDeContact) return undefined;

		const paramsLienOffre = {
			appellationCodes: stage3eEt2de.appellationCodes.toString(),
			modeDeContact: stage3eEt2de.modeDeContact.toString(),
			nomEntreprise: stage3eEt2de.nomEntreprise,
			siret: stage3eEt2de.siret,
		};
		return `/stages-3e-et-2de/candidater?${new URLSearchParams(paramsLienOffre).toString()}`;
	}

	const lienOffre = getLienOffre();

	return (
		<li className="fr-col-lg-4 fr-col-md-6 fr-col-12">
			<Carte
				titre={stage3eEt2de.nomEntreprise}
				lien={lienOffre!}
				tags={tags}
				end={
					<ul aria-label="Métiers proposés">
						{stage3eEt2de.appellationLibelle.map((appellationLibelle) =>
							<li key={appellationLibelle}>{appellationLibelle}</li>,
						)}
					</ul>
				}>
				{stage3eEt2de.domaine}
				<br />
				{stage3eEt2de.adresse.rueEtNumero}, {stage3eEt2de.adresse.codePostal} {stage3eEt2de.adresse.ville}
			</Carte>
		</li>
	);
}

function getModeDeContactLabel(modeDeContact: ModeDeContact): string {
	switch (modeDeContact) {
		case ModeDeContact.EMAIL:
			return 'Contact par email';
		case ModeDeContact.PHONE:
			return 'Contact par téléphone';
		case ModeDeContact.IN_PERSON:
			return 'Contact en personne';
	}
}
