import Link from 'next/link';

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
	return (
		<nav role="navigation" className="fr-breadcrumb" aria-label="vous êtes ici :">
			<button className="fr-breadcrumb__button" aria-expanded="false" aria-controls="breadcrumb-list">
				Voir le fil d&apos;Ariane
			</button>
			<div className="fr-collapse" id="breadcrumb-list">
				<ol className="fr-breadcrumb__list">
					<li>
						<Link className="fr-breadcrumb__link" href="/">Accueil</Link>
					</li>
					{items.map((item, index) => (
						<li key={index}>
							{item.href ? (
								<Link className="fr-breadcrumb__link" href={item.href}>{item.label}</Link>
							) : (
								<span className="fr-breadcrumb__link" aria-current="page">{item.label}</span>
							)}
						</li>
					))}
				</ol>
			</div>
		</nav>
	);
}
