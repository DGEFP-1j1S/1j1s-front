import markdownit from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';

function isAnchor(url: string | number | null): boolean {
	if (typeof url !== 'string') return false;
	return url.startsWith('#');
}

const PUCE_EN_DEBUT_DE_LIGNE = /^[ \t]*●[ \t]*/gm;

function convertirPucesEnListe(markdown: string): string {
	return markdown.replace(PUCE_EN_DEBUT_DE_LIGNE, '- ');
}

export function getHtmlFromMd(markdown: string): string {
	const md = markdownit({
		html: true,
		linkify: true,
	});
	md.use(markdownItAnchor, { tabIndex: false });

	const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
		return self.renderToken(tokens, idx, options);
	};

	let estDansUnLienExterne = false;

	md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
		estDansUnLienExterne = !isAnchor(tokens[idx].attrGet('href'));
		if (estDansUnLienExterne) {
			tokens[idx].attrSet('target', '_blank');
		}
		return defaultRender(tokens, idx, options, env, self);
	};

	md.renderer.rules.link_close = function (tokens, idx, options, env, self) {
		const mentionNouvelleFenetre = estDansUnLienExterne ? '<span class="fr-sr-only">- nouvelle fenêtre</span>' : '';
		return mentionNouvelleFenetre + self.renderToken(tokens, idx, options);
	};

	md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
		return "<div class=\"fr-table\"><div class=\"fr-table__wrapper\"><div class=\"fr-table__container\"><div class=\"fr-table__content\">\n" + self.renderToken(tokens, idx, options);
	};

	md.renderer.rules.table_close = function (tokens, idx, options, env, self) {
		return self.renderToken(tokens, idx, options) + "</div></div></div></div>\n";
	};

	md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
		return self.renderToken(tokens, idx, options);
	};

	return md.render(convertirPucesEnListe(markdown));
}
