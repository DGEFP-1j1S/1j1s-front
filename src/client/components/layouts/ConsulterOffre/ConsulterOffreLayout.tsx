import React from 'react';

import { BackButton } from '~/client/components/features/ButtonRetour/BackButton';

interface ConsulterOffreLayoutProps {
  children: React.ReactNode;
}

export function ConsulterOffreLayout(props: React.PropsWithChildren<ConsulterOffreLayoutProps>) {
	const { children } = props;

	return (
		<main id="contenu">
			<div className="fr-container">
				<BackButton />
				<article>
					{children}
				</article>
			</div>
		</main>
	);
}
