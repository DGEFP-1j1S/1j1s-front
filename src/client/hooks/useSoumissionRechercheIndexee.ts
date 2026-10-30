import { useRouter } from 'next/router';
import { FormEvent } from 'react';

import { getFormAsQueryAvecValeursRepetees, Whitelist } from '~/client/utils/form.util';

export function useSoumissionRechercheIndexee(parametresAcceptes: Whitelist) {
	const router = useRouter();

	return function rechercher(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQueryAvecValeursRepetees(event.currentTarget, parametresAcceptes);
		router.push({ query }, undefined, { scroll: false });
	};
}
