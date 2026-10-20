import React from 'react';

import { Banner } from "~/client/components/ui/Hero/Hero";

interface BanniereMissionProps {
	isServiceCivique: boolean;
}

export function BanniereMission({ isServiceCivique }: BanniereMissionProps) {
	const primaryText = `Je découvre les missions de ${isServiceCivique ? 'Service Civique' : 'Bénévolat'}`;
	return (
		<Banner>
			<h1 className="fr-h1 fr-mb-0">
				{primaryText} pour me rendre utile tout en préparant mon avenir
			</h1>
		</Banner>
	);
}
