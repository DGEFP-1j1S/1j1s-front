import React, { useMemo } from 'react';

import { TimeRange } from '~/client/components/ui/TimeRange/TimeRange';
import { EtablissementAccompagnementHoraire } from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

import styles from './HorairesRésultatRechercherAccompagnement.module.scss';

interface HorairesResultatRechercherAccompagnementProps {
  horaire: EtablissementAccompagnementHoraire
}

export function HorairesResultatRechercherAccompagnement(props: HorairesResultatRechercherAccompagnementProps) {
	const { horaire } = props;
	const { heures, jour } = horaire;

	const heuresOuverture = useMemo(() => {
		if (!heures || heures.length === 0) {
			return (
				<>Fermé</>
			);
		}
		if (heures.length > 1) {
			return (
				<>
					<TimeRange start={heures[0].début} end={heures[0].fin} />
					{' et '}
					<TimeRange start={heures[1].début} end={heures[1].fin} />
				</>
			);
		} else {
			return (
				<TimeRange start={heures[0].début} end={heures[0].fin} />
			);
		}
	}, [heures]);

	return (
		<>
			<span className={styles.horaireJour}>{jour}</span>&nbsp;:
      &nbsp;<span className={styles.horaireHeure}>{heuresOuverture}</span>
		</>
	);
}
