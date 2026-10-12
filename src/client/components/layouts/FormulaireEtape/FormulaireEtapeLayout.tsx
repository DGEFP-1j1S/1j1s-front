import React from 'react';

import { Link } from '~/client/components/ui/Link/Link';

interface FormulaireEtapeLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
	etapeCourante: number
	nombreEtapes: number
	titre: string
	titreEtapeSuivante?: string
	urlEtapePrecedente?: string
}

export function FormulaireEtapeLayout(props: FormulaireEtapeLayoutProps) {
	const { etapeCourante, nombreEtapes, titre, titreEtapeSuivante, urlEtapePrecedente, children } = props;
	return (
		<div className="fr-container fr-mb-5w">
			<div className="fr-stepper fr-col-lg-6 fr-col-12">
				{ urlEtapePrecedente && (
					<Link
						href={urlEtapePrecedente}
						className="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-arrow-go-back-line fr-mb-3w">
						Retour à l’étape précédente
					</Link>
				)}
				<h2 className="fr-stepper__title">
					{titre}{" "}
					<span className="fr-stepper__state">Étape {etapeCourante} sur {nombreEtapes}</span>
				</h2>
				<div className="fr-stepper__steps" data-fr-current-step={etapeCourante} data-fr-steps={nombreEtapes}></div>
				{titreEtapeSuivante && (
					<p className="fr-stepper__details">
						<span className="fr-text--bold">Étape suivante :</span> {titreEtapeSuivante}
					</p>
				)}
			</div>
			{ children }
		</div>
	);
}
