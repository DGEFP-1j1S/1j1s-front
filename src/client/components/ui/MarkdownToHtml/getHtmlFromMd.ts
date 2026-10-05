import markdownit from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';

function isAnchor(url: string | number | null): boolean {
	if (typeof url !== 'string') return false;
	return url.startsWith('#');
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

	md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
		if (!isAnchor(tokens[idx].attrGet('href'))) {
			tokens[idx].attrSet('target', '_blank');
		}
		return defaultRender(tokens, idx, options, env, self);
	};

	md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
		return "<div class=\"fr-table\"><div class=\"fr-table__wrapper\"><div class=\"fr-table__container\"><div class=\"fr-table__content\">\n" + self.renderToken(tokens, idx, options);
	};

	md.renderer.rules.table_close = function (tokens, idx, options, env, self) {
		return self.renderToken(tokens, idx, options) + "</div></div></div></div>\n";
	};

	md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
		if (tokens[idx].tag === "h1") {
		tokens[idx].attrJoin("class", "text--blue");
		}
		return self.renderToken(tokens, idx, options);
	};

	return md.render(markdown);
}
