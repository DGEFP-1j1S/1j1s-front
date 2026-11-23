import React from 'react';

import { Statistique } from '~/server/formations/domain/statistique';
import { Callout } from "~/client/dsfr/Callout";

export function StatistiquesFormationAlternance({ statistiques }: { statistiques?: Statistique }) {
	if (!statistiques) return null;
	return (
		<section>
			<Callout
				title="Et après la formation ?"
				titleAs="h2"
				text={`Découvrez les chiffres-clés liés à cette formation pour la région ${statistiques.region}`}
			>
				<h3 className="fr-h6">Que deviennent les apprenants après cette formation ?</h3>
				<ul>
					{ statistiques.tauxEnEmploi6Mois &&
						<li><span className="fr-text--bold">{statistiques.tauxEnEmploi6Mois}%</span> sont en emploi au bout de 6 mois (quel que soit le type d’emploi et son secteur)</li>
					}
					{ statistiques.tauxEnFormation &&
						<li><span className="fr-text--bold">{statistiques.tauxEnFormation}%</span> sont inscrits en formation (formation supérieure, redoublants, changement de filière)</li>
					}
					{ statistiques.tauxAutres6Mois &&
						<li><span className="fr-text--bold">{statistiques.tauxAutres6Mois}%</span> sont dans d’autres cas (recherche d’emploi, service civique, à l’étranger, indépendant, etc)</li>
					}
				</ul>
				{ statistiques.millesime &&
					<p className="fr-text--sm">Données issues du dispositif InserJeunes, promotion {statistiques.millesime}</p>
				}
			</Callout>
		</section>
	);
}
