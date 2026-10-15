import React, { ReactNode } from 'react';

import { Tag } from '~/client/dsfr';

interface TagListProps extends React.ComponentPropsWithoutRef<'ul'> {
  list: Array<ReactNode>
}

export function TagList({list, ...rest }: TagListProps) {
	return (
		<ul className="fr-grid-row fr-grid-row--gutters fr-mb-2w" {...rest}>
			{
				list
					.filter((tag) => !!tag)
					.map((tag, index) => (
						<li className="fr-col-auto" key={`${tag}-${index}`}>
							<Tag className="background--blue-ecume text--blue fr-text--bold" >{tag}</Tag>
						</li>
					))
			}
		</ul>
	);
}
