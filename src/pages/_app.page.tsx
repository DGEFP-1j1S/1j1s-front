import '@gouvfr/dsfr/dist/dsfr.min.css';
import "@gouvfr/dsfr/dist/utility/icons/icons-arrows/icons-arrows.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-finance/icons-finance.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons-buildings/icons-buildings.min.css";
import '~/styles/main.scss';
import '../client/dsfr/styles.css';

import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactElement, ReactNode, useEffect, useMemo, useRef } from 'react';

import ErrorServer from '~/client/components/layouts/Error/ErrorServer';
import { Layout } from '~/client/components/layouts/Layout';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import dependenciesContainer from '~/client/dependencies.container';
import { GestionnaireConsentement } from '~/client/dsfr';
import usePageHistory from '~/client/hooks/usePageHistory';
import useSessionId from '~/client/hooks/useSessionId';
import { CookiesService } from '~/client/services/cookies/cookies.service';


export type NextPageWithLayout<P = object> = NextPage<P, P> & {
	getLayout?: (page: ReactElement) => ReactNode;
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
}

function useTriggerServicesOnNavigation(cookiesService: CookiesService) {
	const router = useRouter();

	const previousPath = useRef(router.asPath);
	useEffect(function triggerAnalyticsServices() {
		if (previousPath.current === router.asPath) {
			return;
		}
		cookiesService.triggerServices();
		previousPath.current = router.asPath;
	}, [cookiesService, router.asPath]);
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	const sessionId = useSessionId();

	const dependenciesContainerInstance = useMemo(() => dependenciesContainer(sessionId), [sessionId]);
	const router = useRouter();

	usePageHistory();
	useTriggerServicesOnNavigation(dependenciesContainerInstance.cookiesService);

	useEffect(function initDsfr() {
		import('@gouvfr/dsfr/dist/dsfr.module').then(() => {
			window.dsfr?.start();
		});
	}, []);

	useEffect(function focusAnchor() {
		const [/* full path */, targetId] = router.asPath.match(/^[^#]*#(.+)$/) ?? [];
		if (targetId) {
			document.getElementById(targetId)?.focus();
		}
	}, [router.asPath]);

	const getLayout = Component.getLayout ?? ((page: ReactElement) => defaultLayout(page, pageProps));
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, height=device-height, initial-scale=1, viewport-fit=cover, minimum-scale=1.0" />
				<meta name="description" content="Toutes les solutions pour l‘avenir des jeunes" />
			</Head>
			<DependenciesProvider {...dependenciesContainerInstance}>
				<GestionnaireConsentement />
				{getLayout(
					pageProps.error
						? <ErrorServer error={pageProps.error} />
						: <Component {...pageProps} />,
				)}
			</DependenciesProvider>
		</>
	);
}

function defaultLayout(page: ReactElement, pageProps: AppProps["pageProps"]) {
	return (
		<Layout pageProps={pageProps} afficherFilDAriane={!pageProps.error}>{page}</Layout>
	);
}
