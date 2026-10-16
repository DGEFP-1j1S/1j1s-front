import React from 'react';

import { LightHero, LightHeroPrimaryText, LightHeroSecondaryText } from '~/client/components/ui/Hero/LightHero';

interface BanniereMissionProps {
	isServiceCivique: boolean;
}

export function BanniereMission({ isServiceCivique }: BanniereMissionProps) {
	const primaryText = `Je découvre les missions de ${isServiceCivique ? 'Service Civique' : 'Bénévolat'}`;
	return (
		<LightHero>
			<h1>
				<LightHeroPrimaryText>{primaryText}</LightHeroPrimaryText>
				<LightHeroSecondaryText>pour me rendre utile tout en préparant mon avenir</LightHeroSecondaryText>
			</h1>
		</LightHero>
	);
}
