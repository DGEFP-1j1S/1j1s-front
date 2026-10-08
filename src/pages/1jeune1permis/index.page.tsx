import { GetServerSidePropsResult } from 'next';
import React, { useEffect, useRef, useState } from 'react';

import { Head } from '~/client/components/head/Head';
import { Container } from '~/client/components/layouts/Container/Container';
import useAnalytics from '~/client/hooks/useAnalytics';

import analyticsPageConfig from './index.analytics';
import styles from './index.module.scss';

const URL_IFRAME_1JEUNE_1PERMIS = 'https://mes-aides.francetravail.fr/export/1-jeune-1-permis';
const DOMAINE_1JEUNE_1PERMIS = 'https://mes-aides.francetravail.fr';

export async function getStaticProps(): Promise<GetServerSidePropsResult<Record<never, never>>> {
	const isFeatureActive = process.env.NEXT_PUBLIC_1JEUNE1PERMIS_FEATURE === '1';

	if (!isFeatureActive) return { notFound: true };

	return {
		props: {},
	};
}
const DISTANT_PIXEL_MARGIN = 50;
const SIZE_REQUEST_INTERVAL_IN_MS = 500;
interface MessageEventData { type: string; height: number }

function heightFromMessage(event: MessageEvent<string>): number | undefined {
	let data: MessageEventData;

	if (event.origin !== DOMAINE_1JEUNE_1PERMIS) return undefined;

	try {
		data = JSON.parse(event.data);
	} catch {
		return undefined;
	}

	if (typeof data !== 'object' || data.type !== 'resize-iframe') return undefined;

	return data.height;
}

/* NOTE (JUFE - 2026-10-07): le contenu distant est dans un conteneur en `min-height: 100vh`, donc la hauteur qu'il mesure
*  ne descend jamais sous celle de l'iframe : il nous renvoie alors notre propre hauteur augmentée de sa marge.
*  Appliquer cette hauteur ferait grandir l'iframe à l'infini, à chaque aller-retour. */
function isEchoOfCurrentHeight(receivedHeight: number, currentHeight: number | undefined) {
	if (currentHeight === undefined) return false;

	return receivedHeight > currentHeight && receivedHeight <= currentHeight + DISTANT_PIXEL_MARGIN;
}

export default function UnJeuneUnPermis() {

	useAnalytics(analyticsPageConfig);
	const [iframeHeight, setIframeHeight] = useState<number | undefined>(undefined);
	const iRef = useRef<HTMLIFrameElement>(null);

	useEffect(() => {
		const onMessage = (event: MessageEvent<string>) => {
			const receivedHeight = heightFromMessage(event);

			if (receivedHeight === undefined) return;

			setIframeHeight((currentHeight) => isEchoOfCurrentHeight(receivedHeight, currentHeight) ? currentHeight : receivedHeight);
		};

		window.addEventListener(
			'message',
			onMessage,
		);

		return () => {
			window.removeEventListener('message', onMessage);
		};
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			// Polling pour déclencher l'envoi de la taille de l'iframe
			iRef.current?.contentWindow?.postMessage('size-request', '*');
		}, SIZE_REQUEST_INTERVAL_IN_MS);
		return () => clearInterval(interval);
	}, []);

	return (
		<main id="contenu">
			<Head
				title={'1jeune1permis | 1jeune1solution'}
				robots="index,follow" />
			<Container>
				<iframe className={styles.iframe}
					title="Informations sur le dispositif 1 jeune 1 permis"
					src={URL_IFRAME_1JEUNE_1PERMIS}
					style={iframeHeight ? { '--1jeune1permis-iframe-height' : `${iframeHeight}px` } as React.CSSProperties : {}}
					ref={iRef} />
			</Container>
		</main>
	);
}


