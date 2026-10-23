import React from 'react';

import { Head } from '~/client/components/head/Head';
import BanniereRejoindreLaMobilisation
	from '~/client/components/ui/Baniere/BanniereRejoindreLaMobilisation/BanniereRejoindreLaMobilisation';

import { PourQui } from './PourQui';
import { Pourquoi } from './Pourquoi';
import { QuEstCeQueLeMentorat } from './QuEstCeQueLeMentorat';

export default function JeDeviensMentor() {
	return (
		<>
			<Head
				title="Je deviens mentor | 1jeune1solution"
				description="1 jeune 1 mentor, accompagner un jeune pour l’aider à réussir"
				robots="index,follow" />
			<main id="contenu">
				<PourQui />
				<QuEstCeQueLeMentorat />
				<Pourquoi />
				<BanniereRejoindreLaMobilisation />
			</main>
		</>
	);
}

