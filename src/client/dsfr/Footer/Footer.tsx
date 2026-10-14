import { Link } from "~/client/components/ui/Link/Link";
import {
	navigationItemList,
	NavigationItem,
} from "~/client/components/layouts/Header/Navigation/NavigationStructure";

interface SocialLink {
	id: string
	label: string
	url: string
	buttonClass: string
}

interface FooterLink {
	title: string
	url: string
}

const socialLinks: Array<SocialLink> = [
	{ id: "rs-linkedin", label: "LinkedIn", url: "https://www.linkedin.com/showcase/1jeune1solution/about/", buttonClass: "fr-btn--linkedin" },
	{ id: "rs-instagram", label: "Instagram", url: "https://www.instagram.com/1jeune1solution/", buttonClass: "fr-btn--instagram" },
	{ id: "rs-tiktok", label: "TikTok", url: "https://www.tiktok.com/@1jeune_1solution", buttonClass: "fr-btn--tiktok" },
];

const externalLinks: Array<FooterLink> = [
	{ title: 'legifrance.gouv.fr', url: 'https://www.legifrance.gouv.fr/' },
	{ title: 'gouvernement.fr', url: 'https://www.gouvernement.fr/' },
	{ title: 'service-public.fr', url: 'https://www.service-public.fr/' },
	{ title: 'data.gouv.fr', url: 'https://www.data.gouv.fr/' },
];

const helpfulLinks: Array<FooterLink> = [
	{ title: 'Plan du site', url: '/plan-du-site' },
	{ title: "Conditions générales d'utilisation", url: '/cgu' },
	{ title: 'Accessibilité : Partiellement conforme', url: '/accessibilite' },
	{ title: 'Mentions légales', url: '/mentions-legales' },
	{ title: 'Politique de confidentialité', url: '/confidentialite' },
];

function getFooterNavigationCategories() {
	const navItems = navigationItemList();
	const categories = [
		navItems.offresNav,
		navItems.orientationNav,
		navItems.accompagnementNav,
		navItems.engagementNav,
		navItems.logementsNav,
		navItems.aidesEtOutilsNav,
		navItems.employeurNav,
	];
	return categories.map((category) => ({
		label: category.label,
		children: category.children
			.filter((child): child is NavigationItem => "link" in child)
			.filter((child) => typeof child.label === "string")
			.map((child) => ({ label: child.label as string, link: child.link })),
	}));
}

export function Footer() {
	return (
		<>
			<div className="fr-follow" id="follow">
				<div className="fr-container">
					<div className="fr-grid-row">
						<div className="fr-col-12">
							<div className="fr-follow__social">
								<h2 className="fr-h5">Suivez-nous sur les réseaux sociaux</h2>
								<ul className="fr-btns-group">
									{socialLinks.map((link) => (
										<li key={link.id}>
											<Link
												title={`Suivez-nous sur ${link.label}`}
												id={link.id}
												href={link.url}
												target="_blank"
												rel="noopener external"
												className={`${link.buttonClass} fr-btn`}
												prefetch={false}
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<footer id="footer" className="fr-footer fr-pb-4w" role="contentinfo">
				<div className="fr-footer__top">
					<div className="fr-container">
						<div className="fr-grid-row fr-grid-row--start fr-grid-row--gutters">
							{getFooterNavigationCategories().map((category) => (
								<div key={category.label} className="fr-col-md fr-col-6">
									<h2 className="fr-footer__top-cat">{category.label}</h2>
									<ul className="fr-footer__top-list">
										{category.children.map((item) => (
											<li key={item.link}>
												<Link href={item.link} className="fr-footer__top-link" prefetch={false}>
													{item.label}
												</Link>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="fr-container">
					<div className="fr-footer__body">
						<div className="fr-footer__brand fr-enlarge-link">
							<p className="fr-logo">
								Ministère<br/>
								du travail<br/>
								et des solidarités
							</p>
						</div>
						<div className="fr-footer__content">
							<p className="fr-footer__content-desc">
								<strong className="fr-text--lg">1 jeune 1 solution</strong><br/>
								Accompagner, former, et faciliter l’entrée dans la vie professionnelle de tous les jeunes de 15 à 30 ans, sur tous les territoires.
							</p>
							<ul className="fr-footer__content-list">
								{externalLinks.map((link) => (
									<li className="fr-footer__content-item" key={link.title}>
										<Link href={link.url} className="fr-footer__content-link" prefetch={false}>
											{link.title}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="fr-footer__bottom">
						<ul className="fr-footer__bottom-list">
							{helpfulLinks.map(link => (
								<li className="fr-footer__bottom-item" key={link.title}>
									<Link href={link.url} className="fr-footer__bottom-link" prefetch={false}>{link.title}</Link>
								</li>
							))}
						</ul>
						<div className="fr-footer__bottom-copy">
							<p>Sauf mention contraire, tous les contenus de ce site sont sous licence&nbsp;
								<Link
									href="https://www.etalab.gouv.fr/wp-content/uploads/2017/04/ETALAB-Licence-Ouverte-v2.0.pdf"
									prefetch={false}>
									etalab-2.0
								</Link>
							</p>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
