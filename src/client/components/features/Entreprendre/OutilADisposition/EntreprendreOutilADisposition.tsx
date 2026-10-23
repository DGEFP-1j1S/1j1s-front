import React from "react";

import { Carte } from "~/client/dsfr";

interface EntreprendreOutilADispositionProps {
  link: string
  linkLabel: string
  description: string
}

export function EntreprendreOutilADisposition({ link, linkLabel, description }: EntreprendreOutilADispositionProps) {
	return (
		<Carte className="height--full" titre={linkLabel} lien={link}>
			{description}
		</Carte>
	);
}
