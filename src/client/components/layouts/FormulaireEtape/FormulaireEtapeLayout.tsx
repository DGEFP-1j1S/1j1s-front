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
			<div className="fr-stepper">
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
			{ urlEtapePrecedente && (
				<Link
					href={urlEtapePrecedente}
					className="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-arrow-left-line fr-mb-3w">
        Retour à l’étape précédente
				</Link>
			)}
			{ children }
		</div>
	);
}
