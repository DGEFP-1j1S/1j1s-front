import React from 'react';

import { MonEspaceEntreprise } from '~/client/components/features/MonEspaceEmployeur/MonEspaceEntreprise';
import { Head } from '~/client/components/head/Head';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/mon-espace/index.analytics';
import {
	MonEspaceDecouvrirLesDispositifs
} from "../../client/components/features/MonEspaceEmployeur/DecouvrirLesDispositifs/MonEspaceDecouvrirLesDispositifs";

export default function MonEspace() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Mon espace employeur | 1jeune1solution"
				description="Accéder à mon espace employeur"
				robots="index,follow" />
			<main id="contenu">
				<MonEspaceEntreprise />
				<MonEspaceDecouvrirLesDispositifs />
			</main>
		</>
	);
}
