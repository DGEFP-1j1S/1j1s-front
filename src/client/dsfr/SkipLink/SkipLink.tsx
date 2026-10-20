import React from 'react';

export function SkipLink() {
	return (
		<div className="fr-skiplinks">
			<nav role="navigation" aria-label="Accès rapide" className="fr-container">
				<ul className="fr-skiplinks__list">
					<li>
						<a className="fr-link" href="#contenu">Contenu principal</a>
					</li>
					<li>
						<a className="fr-link" href="#header">Menu</a>
					</li>
					<li>
						<a className="fr-link" href="#footer">Pied de page</a>
					</li>
				</ul>
			</nav>
		</div>
	);
}
