import React from 'react';

import { BandeauAccueilApplicationMobile } from "~/client/components/features/ApplicationMobile/BandeauAccueilApplicationMobile";
import Accompagnement from '~/client/components/features/ContratEngagementJeune/Accompagnement/Accompagnement';
import Actions from '~/client/components/features/ContratEngagementJeune/Actions/Actions';
import PourquoiCEstFaitPourMoi from '~/client/components/features/ContratEngagementJeune/Pourquoi/PourquoiCEstFaitPourMoi';
import QuEstCeQueCEst from '~/client/components/features/ContratEngagementJeune/QuEstCeQueCest/QuEstCeQueCEst';
import QuEstCeQueJyGagne from '~/client/components/features/ContratEngagementJeune/QuEstCeQueJyGagne/QuEstCeQueJyGagne';
import { Temoignages } from '~/client/components/features/ContratEngagementJeune/Temoignages/Temoignages';
import { Head } from '~/client/components/head/Head';
import { HeroWithButtonLink } from "~/client/components/ui/Hero/HeroWithButtonLink";
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/contrat-engagement-jeune/index.analytics';

export default function ContratEngagementJeune() {
	useAnalytics(analytics);

	return (
		<>
			<Head
				title="Contrat d’engagement jeune | 1jeune1solution"
				description="Plus de 400 000 offres d‘emplois et d‘alternances sélectionnées pour vous"
				robots="index,follow"
			/>
			<main id="contenu">
				<div className="background--blue-light fr-py-9w">
					<HeroWithButtonLink
						title="Le Contrat d’Engagement Jeune, la solution pour vous"
						content="Découvrez le CEJ, un parcours personnalisé pour vous aider à définir votre projet professionnel et trouver un emploi."
						buttonLabel="Trouver mon accompagnement"
						buttonHref="#accompagnement"
						buttonIcon="fr-icon-arrow-right-line"
						imgSrc="/images/CEJ/hero.webp"
						imgContain />
				</div>
				<QuEstCeQueCEst />
				<PourquoiCEstFaitPourMoi />
				<Actions />
				<QuEstCeQueJyGagne />
				<Temoignages />
				<Accompagnement />
				<BandeauAccueilApplicationMobile
					estLive={process.env.NEXT_PUBLIC_APP_MOBILE_1J1S_LIVE === "1"}
					titre="L’application 1 jeune 1 solution pour suivre mon parcours CEJ"
					titreAs="h2" />
			</main>
		</>
	);
}
