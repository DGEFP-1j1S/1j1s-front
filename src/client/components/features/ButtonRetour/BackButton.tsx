import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Container } from '~/client/components/layouts/Container/Container';
import {
	ButtonComponent,
} from '~/client/components/ui/Button/ButtonComponent';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { IS_PREVIOUS_PAGE_LOCAL } from '~/client/hooks/usePageHistory';
import useSessionStorage from '~/client/hooks/useSessionStorage';

type BackButtonProps = Omit<React.ComponentPropsWithoutRef<typeof ButtonComponent>,'label'> & {
	label: string
	'aria-label': string
} | Omit<React.ComponentPropsWithoutRef<typeof ButtonComponent>,'label'> & {
	label?: never
}

export function BackButton({ className, label= 'Retour', ...rest }: BackButtonProps) {
	const router = useRouter();
	const isPreviousPageLocal = useSessionStorage<boolean>(IS_PREVIOUS_PAGE_LOCAL);
	// Le sessionStorage n’existe pas côté serveur : le lire pendant le rendu désapparie l’hydratation
	// (React #418). L’état part donc à false, comme le rendu serveur, et l’effet le corrige après.
	const [displayBackButton, setDisplayBackButton] = useState(false);

	useEffect(function lireHistoriqueApresHydratation() {
		setDisplayBackButton(!!isPreviousPageLocal.get());
		// useSessionStorage renvoie un objet littéral neuf à chaque rendu : le mettre en dépendance
		// relancerait l’effet à chaque rendu.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		displayBackButton && (
			<div className={className}>
				<Container>
					<ButtonComponent
						role="link"
						appearance="secondary"
						aria-label={'Retour vers la page précédente'}
						icon={<Icon name="angle-left" />}
						iconPosition="left"
						label={label}
						onClick={() => router.back()}
						{...rest} />
				</Container>
			</div>
		)
	);
}
