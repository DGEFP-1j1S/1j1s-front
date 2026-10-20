import { useCallback, useMemo, useSyncExternalStore } from 'react';

import { useDependency } from '~/client/context/dependenciesContainer.context';
import { CookiesService, EtatGestionnaireConsentement } from '~/client/services/cookies/cookies.service';

import { BanniereConsentement } from './BanniereConsentement';
import { PanneauConsentement } from './PanneauConsentement';

const ETAT_SERVEUR: EtatGestionnaireConsentement = { banniereOuverte: false, panneauOuvert: false };

export function GestionnaireConsentement() {
	const cookiesService = useDependency<CookiesService>('cookiesService');

	const subscribe = useCallback((listener: () => void) => cookiesService.subscribe(listener), [cookiesService]);
	const getEtat = useCallback(() => cookiesService.getEtat(), [cookiesService]);
	const etat = useSyncExternalStore(subscribe, getEtat, () => ETAT_SERVEUR);

	const finalites = useMemo(
		() => (etat.panneauOuvert ? cookiesService.getFinalites() : null),
		[cookiesService, etat.panneauOuvert],
	);

	const fermerPanneau = useCallback(() => {
		if (cookiesService.getEtat().panneauOuvert) {
			cookiesService.closePanel();
		}
	}, [cookiesService]);

	return (
		<>
			{etat.banniereOuverte && (
				<BanniereConsentement
					onAccepterTout={() => cookiesService.acceptAll()}
					onRefuserTout={() => cookiesService.denyAll()}
					onPersonnaliser={() => cookiesService.openPanel()} />
			)}
			<PanneauConsentement
				estOuvert={etat.panneauOuvert}
				finalites={finalites}
				onFermer={fermerPanneau}
				onConfirmer={(choix) => cookiesService.saveChoices(choix)} />
		</>
	);
}
