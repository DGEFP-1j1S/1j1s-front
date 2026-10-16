import React, { useRef } from 'react';

import Footer from '~/client/components/layouts/Footer/Footer';
import { Header } from '~/client/components/layouts/Header/Header';
import Bouée from '~/client/components/ui/Bouée/Bouée';
import SkipLink from '~/client/components/ui/SkipLink/SkipLink';

export function Layout({ children }: React.PropsWithChildren) {
	const surface = useRef<HTMLDivElement>(null);

	return (
		<div ref={ surface }>
			<SkipLink />
			<Header />
			{children}
			<Footer />
			<Bouée surface={ surface } />
		</div>
	);
}
