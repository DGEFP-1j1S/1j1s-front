import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import React from 'react';

import { ID_TOP_ELEMENT } from '../client/components/ui/Bouée/Bouée';

export default function Document() {
	return (
		<Html lang="fr">
			<Head>
				<meta name="author" content="1jeune1solution" />
				<link rel="apple-touch-icon-precomposed" sizes="57x57" href="/favicons/apple-touch-icon-57x57.png" />
				<link rel="apple-touch-icon-precomposed" sizes="114x114" href="/favicons/apple-touch-icon-114x114.png" />
				<link rel="apple-touch-icon-precomposed" sizes="72x72" href="/favicons/apple-touch-icon-72x72.png" />
				<link rel="apple-touch-icon-precomposed" sizes="144x144" href="/favicons/apple-touch-icon-144x144.png" />
				<link rel="apple-touch-icon-precomposed" sizes="60x60" href="/favicons/apple-touch-icon-60x60.png" />
				<link rel="apple-touch-icon-precomposed" sizes="120x120" href="/favicons/apple-touch-icon-120x120.png" />
				<link rel="apple-touch-icon-precomposed" sizes="76x76" href="/favicons/apple-touch-icon-76x76.png" />
				<link rel="apple-touch-icon-precomposed" sizes="152x152" href="/favicons/apple-touch-icon-152x152.png" />
				<link rel="icon" type="image/png" href="/favicons/favicon-196x196.png" sizes="196x196" />
				<link rel="icon" type="image/png" href="/favicons/favicon-96x96.png" sizes="96x96" />
				<link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32" />
				<link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16" />
				<link rel="icon" type="image/png" href="/favicons/favicon-128x128.png" sizes="128x128" />
				<meta name="application-name" content="1jeune1solution" />
				<meta name="msapplication-TileColor" content="#FFFFFF" />
				<meta name="msapplication-TileImage" content="/favicons/mstile-144x144.png" />
				<meta name="msapplication-square70x70logo" content="/favicons/mstile-70x70.png" />
				<meta name="msapplication-square150x150logo" content="/favicons/mstile-150x150.png" />
				<meta name="msapplication-wide310x150logo" content="/favicons/mstile-310x150.png" />
				<meta name="msapplication-square310x310logo" content="/favicons/mstile-310x310.png" />
			</Head>
			<body id={ID_TOP_ELEMENT} data-version={process.env.NEXT_PUBLIC_APPLICATION_VERSION} data-env={process.env.NODE_ENV}>
				<Main />
				<NextScript />
				{
					process.env.NODE_ENV === 'production' && (
						// eslint-disable-next-line @next/next/no-sync-scripts
						<script
							src={`/scripts/tarteaucitron/tarteaucitron.js?v=${encodeURI(process.env.NEXT_PUBLIC_APPLICATION_VERSION!)}`} />
					)
				}
				{ process.env.NEXT_PUBLIC_ANALYTICS_EULERIAN_FEATURE === '1' && (
					<Script
          	id="eulerianAnalytics"
          	src={`/scripts/eulerian.${process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN}.js`}
          	strategy="beforeInteractive" />
				)}
			</body>
		</Html>
	);
}
