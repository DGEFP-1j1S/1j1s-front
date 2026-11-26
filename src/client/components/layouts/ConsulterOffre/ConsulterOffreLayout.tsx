import React from 'react';

interface ConsulterOffreLayoutProps {
  children: React.ReactNode;
}

export function ConsulterOffreLayout(props: React.PropsWithChildren<ConsulterOffreLayoutProps>) {
	const { children } = props;

	return (
		<div className="fr-container">
			<article>
				{children}
			</article>
		</div>
	);
}
