import React, { ReactNode } from 'react';

import { Badge } from "~/client/dsfr/Badge";

interface BadgeListProps extends React.ComponentPropsWithoutRef<'ul'> {
  list: Array<ReactNode>
	colorClass?: string
}

export function BadgeList({list, colorClass, ...rest }: BadgeListProps) {
	return (
		<ul {...rest} className={`fr-badges-group ${rest.className ?? ''}`} >
			{
				list
					.filter((tag) => !!tag)
					.map((tag, index) => (
						<li key={`${tag}-${index}`}>
							<Badge className={colorClass} >{tag}</Badge>
						</li>
					))
			}
		</ul>
	);
}
