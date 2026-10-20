import React from 'react';

import { SkipLink } from '~/client/dsfr';


export function LayoutMaintenance({ children }: React.PropsWithChildren) {
	return (
		<>
			<SkipLink />
			{children}
		</>
	);
}
