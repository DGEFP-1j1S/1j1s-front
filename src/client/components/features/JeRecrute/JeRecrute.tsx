import { Head } from '~/client/components/head/Head';
import BanniereRejoindreLaMobilisation
	from '~/client/components/ui/Baniere/BanniereRejoindreLaMobilisation/BanniereRejoindreLaMobilisation';

import { DécouvrirDispositifs } from './DecouvrirDispositifs/DecouvrirDispositifs';
import DecouvrirMesuresEmployeursEtApprentissage
	from './DecouvrirMesuresEmployeursEtApprentissage/DecouvrirMesuresEmployeursEtApprentissage';

export function JeRecrute () {

	return (
		<>
			<Head
				title="Recruter et agir pour les jeunes | 1jeune1solution"
				description="Emploi, formation, accompagnement"
				robots="index,follow" />
			<main id="contenu">
				<DécouvrirDispositifs />
				<DecouvrirMesuresEmployeursEtApprentissage />
				<BanniereRejoindreLaMobilisation />
			</main>
		</>
	);
}
