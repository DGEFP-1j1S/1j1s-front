import { useState } from 'react';

type Reinitialisation = {
	cle: number
	empreinteDesValeurs: string
}

export function useReinitialisationFormulaire<Valeurs extends object>(valeurs: Valeurs) {
	const [reinitialisation, setReinitialisation] = useState<Reinitialisation>({ cle: 0, empreinteDesValeurs: '' });
	const empreinteDesValeurs = JSON.stringify(valeurs);
	const estReinitialise = reinitialisation.cle > 0 && reinitialisation.empreinteDesValeurs === empreinteDesValeurs;

	function reinitialiser() {
		setReinitialisation((precedente) => ({ cle: precedente.cle + 1, empreinteDesValeurs }));
	}

	return {
		cle: reinitialisation.cle,
		estReinitialise,
		reinitialiser,
		valeursInitiales: estReinitialise ? {} as Partial<Valeurs> : valeurs,
	};
}
