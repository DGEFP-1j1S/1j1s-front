import React from 'react';

import {
	RéférencerEntreprises,
} from '~/client/components/features/Immersions/ReferencesEntreprises/RéférencerEntreprises';
import { Head } from '~/client/components/head/Head';
import BanniereRejoindreLaMobilisation
	from '~/client/components/ui/Baniere/BanniereRejoindreLaMobilisation/BanniereRejoindreLaMobilisation';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/immersions/index.analytics';

export default function Immersions() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Je propose des immersions | 1jeune1solution"
				robots="index,follow" />
			<main id="contenu">
				<RéférencerEntreprises />
				<BanniereRejoindreLaMobilisation />
			</main>
		</>
	);
}
