import { Head } from '~/client/components/head/Head';
import MarkdownToHtml from '~/client/components/ui/MarkdownToHtml/MarkdownToHtml';

export interface ConsulterContenuProps {
  titre: string
  contenu: string
}

export function ConsulterContenu({ titre, contenu }: ConsulterContenuProps) {
	return (
		<main id="contenu">
			<article className="fr-container fr-py-4w">
				<Head
					title={`${titre} | 1jeune1solution`}
					robots="index,follow" />
				<MarkdownToHtml markdown={contenu} />
			</article>
		</main>
	);
}
