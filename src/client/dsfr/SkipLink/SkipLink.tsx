import React from 'react';
import useBreakpoint from "~/client/hooks/useBreakpoint";

export function SkipLink() {
	const { isLargeScreen } = useBreakpoint()

	return (
		<div className="fr-skiplinks">
			<nav role="navigation" aria-label="Accès rapide" className="fr-container">
				<ul className="fr-skiplinks__list">
					<li>
						<a className="fr-link" href="#contenu">Contenu principal</a>
					</li>
					<li>
						<a className="fr-link" href={isLargeScreen ? "#navigation" : "#header-menu-button" }>Menu</a>
					</li>
					<li>
						<a className="fr-link" href="#footer">Pied de page</a>
					</li>
				</ul>
			</nav>
		</div>
	);
}
