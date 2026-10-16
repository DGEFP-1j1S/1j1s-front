import React from 'react';

import SkipLink from '~/client/components/ui/SkipLink/SkipLink';


export function LayoutMaintenance({ children }: React.PropsWithChildren) {
	return (
		<>
			<SkipLink />
			{children}
		</>
	);
}
