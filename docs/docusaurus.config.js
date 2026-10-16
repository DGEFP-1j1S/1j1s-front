// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {

	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: '1j1s-front/',

	customFields: {
		shortTitle: '1jeune1solution',
	},


	// Le chemin d'accès au favicon de votre site, il doit s'agir d'une URL qui peut être utilisée dans le href du lien.
	favicon: 'img/favicon.ico',


	// Even if you don't use internalization, you can use this field to set useful
	// metadata like html lang. For example, if your site is Chinese, you may want
	// to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'fr',
		locales: ['fr'],
	},


	// Usually your repo name.
	// Cette option ajoute <meta name="robots" content="noindex, nofollow"> à chaque page,
	// pour dire aux moteurs de recherche de ne pas indexer votre site
	noIndex: true,


	// Le comportement de Docusaurus lorsqu'il détecte un lien défectueux.
	onBrokenLinks: 'throw',


	// Le comportement de Docusaurus lorsqu'il détecte un lien défectueux du Markdown.
	onBrokenMarkdownLinks: 'throw',


	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'DNUM-SocialGouv',


	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						'https://github.com/DNUM-SocialGouv/1j1s-front/tree/main/docs/docs/',


					lastVersion: 'current',

					sidebarPath: require.resolve('./sidebars.js'),
					versions: {
						current: {
							label: 'Future version 🚧',
						},
					},
				},
				pages: {
					mdxPageComponent: '@theme/MDXPage',
					path: 'pages',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],


	// Usually your GitHub org/user name.
	projectName: '1j1s-front',


	// Le slogan de votre site web.
	tagline: 'Le code source de 1jeune1solution est ouvert pour que chacun puisse contribuer à l\'avenir des jeunes !',


	themeConfig:
	/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({

			footer: {
				copyright: 'Sauf mention contraire, tous les contenus de ce site sont sous licence <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md">etalab-2.0</a>',
				links: [
					{
						items: [
							{
								href: 'https://github.com/DNUM-SocialGouv/1j1s-front',
								label: 'Front (sur Github)',
							},
							{
								href: 'https://github.com/DNUM-SocialGouv/1j1s-main-cms',
								label: 'CMS (sur Github)',
							},
							{
								href: 'https://github.com/DNUM-SocialGouv/1j1s-etl',
								label: 'ETL (sur Github)',
							},
						],
						title: 'Composants techniques',
					},
					{
						items: [
							{
								href: 'https://www.figma.com/file/AYdRLod5b9ZMKVoBU2hczj/Prototypes_1jeune1solution?node-id=4%3A2&t=62l0sMZ6lFPWxcxS-0',
								label: 'Figma',
							},
							{
								href: 'https://jira-mcas.atlassian.net/browse/UNJ1S',
								label: 'JIRA',
							},
						],
						title: 'Outils',
					},
					{
						items: [
							{
								html: 'Une initiative du Gouvernement pour accompagner, former, et faciliter l’entrée dans la vie professionnelle de tous les jeunes de 15 à 30 ans, sur tous les territoires.',
							},
						],
						title: '#1jeune1solution',
					},
				],
				style: 'dark',
			},
			// Replace with your project's social card
			image: 'img/docusaurus-social-card.jpg',
			navbar: {
				items: [
					{
						docId: 'architecture/architecture',
						label: 'Front',
						position: 'left',
						type: 'doc',
					},
					{
						href: 'https://dnum-socialgouv.github.io/1j1s-etl/docs/architecture',
						label: 'ETL',
						position: 'left',
						target: '_self',
					},
					{
						href: 'https://dnum-socialgouv.github.io/1j1s-main-cms/docs/architecture',
						label: 'CMS',
						position: 'left',
						target: '_self',
					},
					{
						label: 'Design System',
						position: 'left',
						// Avoid optimisation for external application on same domain
						target: '_parent',
						to: './storybook',
					},
					{
						position: 'right',
						type: 'docsVersionDropdown',
					},
					{
						href: 'https://github.com/DNUM-SocialGouv/1j1s-front',
						label: 'Code source',
						position: 'right',
					},
				],
				logo: {
					alt: '#1jeune1solution',
					src: '/img/mariane.svg',
				},
				title: 'Documentation technique 1jeune1solution',
			},
			prism: {
				darkTheme: darkCodeTheme,
				theme: lightCodeTheme,
			},
		}),


	// Titre de votre site. Sera utilisé dans les métadonnées et comme titre dans l'onglet du navigateur.
	title: 'Documentation Technique 1jeune1solution',

	// URL de votre site web. Cela peut également être considéré comme le nom d'hôte de premier niveau.
	url: 'https://dnum-socialgouv.github.io/',
};

module.exports = config;
