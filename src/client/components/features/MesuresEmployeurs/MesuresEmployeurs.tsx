import React from 'react';

import Bannière from '~/client/components/features/MesuresEmployeurs/Bannière/Bannière';
import styles from '~/client/components/features/MesuresEmployeurs/MesuresEmployeurs.module.scss';
import { Head } from '~/client/components/head/Head';
import { FlippingCard } from '~/client/components/ui/Card/Flipping/FlippingCard';
import useSanitize from '~/client/hooks/useSanitize';
import { MesureEmployeur } from '~/server/mesures-employeurs/domain/mesureEmployeur';

export interface MesuresEmployeursProps {
	mesureEmployeurList: Array<MesureEmployeur>;
}

export function MesuresEmployeursComponent({ mesureEmployeurList }: MesuresEmployeursProps) {
	return (
		<>
			<Head
				title="Mesures Employeurs | 1jeune1solution"
				description="Plus de 400 000 offres d‘emplois et d‘alternances sélectionnées pour vous"
				robots="index,follow" />
			<main id="contenu">
				<Bannière />
				<section className={styles.dispositifs}>
					<ul className={styles.cartes}>
						{mesureEmployeurList.map((carte) => (
							<li key={carte.titre}>
								<CarteMesureEmployeur carte={carte} />
							</li>
						))}
					</ul>
				</section>
			</main>
		</>
	);
}

interface CarteMesureEmployeurProps {
	carte: MesureEmployeur;
}

function CarteMesureEmployeur({ carte }: CarteMesureEmployeurProps) {
	const {
		titre: dirtyTitre,
		banniere,
		link,
		pourQui,
	} = carte;
	const titre = useSanitize(dirtyTitre);

	return (
		<FlippingCard
			imageUrl={banniere?.src}
			link={link}
			titleAs={'h2'}
			title={titre}
			flippingCardContent={pourQui}
			className={styles.carteMesureEmployeur} />
	);
}
