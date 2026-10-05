import { getHtmlFromMd } from '~/client/components/ui/MarkdownToHtml/getHtmlFromMd';

describe('getHtmlFromMd', () => {
	it('transforme le markdown en HMTL', () => {
		const markdown = '# je suis le titre\n **Je suis le paragraphe en gras**';
		const result = getHtmlFromMd(markdown);
		expect(result).toBe('<h1 id="je-suis-le-titre" class="text--blue">je suis le titre</h1>\n<p><strong>Je suis le paragraphe en gras</strong></p>\n');
	});

	describe('quand les liens ne sont pas des ancres', () => {
		it('transforme les liens en liens s‘ouvrant dans un nouvel onglet', () => {
			const markdown = '[example de lien](https://example.com)';
			const result = getHtmlFromMd(markdown);
			expect(result).toBe('<p><a href="https://example.com" target="_blank">example de lien</a></p>\n');
		});
	});

	describe('quand les liens sont des ancres', () => {
		it('transforme les liens en liens de redirection interne n’ouvrant pas dans un nouvel onglet', () => {
			const markdown = '[exemple de lien](#exemple)';
			const result = getHtmlFromMd(markdown);
			expect(result).toBe('<p><a href="#exemple">exemple de lien</a></p>\n');
		});
	});


	it('transforme les email en mailto', () => {
		const markdown = 'email@example.com';
		const result = getHtmlFromMd(markdown);
		expect(result).toBe('<p><a href="mailto:email@example.com" target="_blank">email@example.com</a></p>\n');
	});

	it('ajoute un id sur les titres, pour être utiliser en ancre', () => {
		const markdown = '# 1. Avantages du travail';
		const result = getHtmlFromMd(markdown);
		expect(result).toBe('<h1 id="1.-avantages-du-travail" class="text--blue">1. Avantages du travail</h1>\n');
	});

	it("encapsule les tableaux dans la structure fr-table du DSFR", () => {
		// GIVEN
		const markdown = "| Titre |\n| --- |\n| Valeur |";

		// WHEN
		const result = getHtmlFromMd(markdown);

		// THEN
		expect(result).toContain("<div class=\"fr-table\"><div class=\"fr-table__wrapper\"><div class=\"fr-table__container\"><div class=\"fr-table__content\">\n<table>");
		expect(result).toContain("</table>\n</div></div></div></div>");
	});

	it("colore en bleu uniquement les titres de niveau 1", () => {
		// GIVEN
		const markdown = "# Titre principal\n## Sous-titre";

		// WHEN
		const result = getHtmlFromMd(markdown);

		// THEN
		expect(result).toBe("<h1 id=\"titre-principal\" class=\"text--blue\">Titre principal</h1>\n<h2 id=\"sous-titre\">Sous-titre</h2>\n");
	});

	it('accepte le html', () => {
		const markdown = '# 1. Avantages du travail\n <p>je suis le paragraphe</p>';
		const result = getHtmlFromMd(markdown);
		expect(result).toBe('<h1 id="1.-avantages-du-travail" class="text--blue">1. Avantages du travail</h1>\n <p>je suis le paragraphe</p>');
	});
});
