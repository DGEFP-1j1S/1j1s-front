import { GetServerSidePropsResult } from 'next';
import React from 'react';

import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/application-mobile/index.analytics';
import { Head } from "~/client/components/head/Head";
import { HeroApplicationMobile } from "~/client/components/features/ApplicationMobile/HeroApplicationMobile";
import { CeQueTuPourrasFaireSurLApp } from "~/client/components/features/ApplicationMobile/CeQueTuPourrasFaireSurLApp";
import { FonctionnalitesPrincipales } from "~/client/components/features/ApplicationMobile/FonctionnalitesPrincipales";
import { PourquoiLUtiliser } from "~/client/components/features/ApplicationMobile/PourquoiLUtiliser";
import { CitationsApp } from "~/client/components/features/ApplicationMobile/CitationsApp";

interface ApplicationMobilePageProps {
	estLive: boolean
}

export default function ApplicationMobilePage({ estLive }: ApplicationMobilePageProps) {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Application mobile | 1jeune1solution"
				description="L‘application mobile 1jeune1solution"
				robots="index,follow" />
			<main id="contenu">
				<HeroApplicationMobile estLive={estLive} />
				<CeQueTuPourrasFaireSurLApp/>
				<FonctionnalitesPrincipales/>
				<PourquoiLUtiliser/>
				<CitationsApp/>
			</main>
		</>
	);
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<ApplicationMobilePageProps>> {
	return { props: { estLive: process.env.NEXT_PUBLIC_APP_MOBILE_1J1S_LIVE === '1' } };
}
