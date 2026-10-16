import markdownit from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';

function isAnchor(url: string | null): boolean {
	if (!url) return false;
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

	return md.render(markdown);
}
