import React from 'react';

import { ServiceCard, ServiceCardList } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { Container } from '~/client/components/layouts/Container/Container';
import { EnTete } from '~/client/components/ui/EnTete/EnTete';
import { Statistique } from '~/server/formations/domain/statistique';

import styles from './StatistiquesFormationAlternance.module.scss';

export function StatistiquesFormationAlternance({ statistiques }: { statistiques?: Statistique }) {
	if (!statistiques) return null;
	return (
		<div className={styles.section}>
			<EnTete
				heading="Et après la formation ?"
				headingLevel={'h2'}
				className={styles.entête}
				description={`Découvrez les chiffres-clés liés à cette formation pour la région ${statistiques.region}`} />
			<Container>
				<article className={styles.layout}>
					<h3 className={styles.texteQuestion}>Que deviennent les apprenants après cette formation ?</h3>
					<ul>
						{ statistiques.tauxEnEmploi6Mois &&
            <li><span className={styles.textePourcentage}>{statistiques.tauxEnEmploi6Mois}%</span> sont en emploi au bout de 6 mois (quel que soit le type d’emploi et son secteur)</li>
						}
						{ statistiques.tauxEnFormation &&
            <li><span className={styles.textePourcentage}>{statistiques.tauxEnFormation}%</span> sont inscrits en formation (formation supérieure, redoublants, changement de filière)</li>
						}
						{ statistiques.tauxAutres6Mois &&
            <li><span className={styles.textePourcentage}>{statistiques.tauxAutres6Mois}%</span> sont dans d’autres cas (recherche d’emploi, service civique, à l’étranger, indépendant, etc)</li>
						}
					</ul>
					{ statistiques.millesime &&
						<p className={styles.millesime}>Données issues du dispositif InserJeunes, promotion {statistiques.millesime}</p>
					}
				</article>
				<ServiceCardList>
					<ServiceCard
						linkLabel="Lire l'article"
						link="/articles/inserjeunes"
						logo="/images/logos/inserjeunes.svg"
						title="Découvrez le dispositif InserJeunes"
						titleAs={'h3'}>
						Inserjeunes est un service d’aide à l’orientation des jeunes qui présente différents indicateurs pour toutes les formations professionnelles.
					</ServiceCard>
				</ServiceCardList>
			</Container>
		</div>
	);
}
