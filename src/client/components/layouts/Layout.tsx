import React, { useRef } from 'react';

import { FilDAriane } from "~/client/components/layouts/FilDAriane/FilDAriane";
import { FilDArianePageProps } from "~/client/components/layouts/FilDAriane/filDAriane.config";
import { Footer, Header, SkipLink } from '~/client/dsfr';

interface LayoutProps {
	pageProps?: FilDArianePageProps;
	afficherFilDAriane?: boolean;
}

export function Layout({ children, pageProps, afficherFilDAriane = true }: React.PropsWithChildren<LayoutProps>) {
	const surface = useRef<HTMLDivElement>(null);

	return (
		<div ref={ surface }>
			<SkipLink />
			<Header />
			{afficherFilDAriane && <FilDAriane pageProps={pageProps} />}
			{children}
			<Footer />
		</div>
	);
}
