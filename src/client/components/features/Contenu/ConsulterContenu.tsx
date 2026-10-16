import styles from '~/client/components/features/Contenu/ConsulterContenu.module.scss';
import { Head } from '~/client/components/head/Head';
import { Container } from '~/client/components/layouts/Container/Container';
import MarkdownToHtml from '~/client/components/ui/MarkdownToHtml/MarkdownToHtml';
import MarkdownToHtmlStyles from '~/client/components/ui/MarkdownToHtml/MarkdownToHtml.module.scss';

export interface ConsulterContenuProps {
  titre: string
  contenu: string
}

export function ConsulterContenu({ titre, contenu }: ConsulterContenuProps) {
	return (
		<main id="contenu">
			<Container>
				<article className={styles.article}>
					<Head
						title={`${titre} | 1jeune1solution`}
						robots="index,follow" />
					<MarkdownToHtml markdown={contenu} className={MarkdownToHtmlStyles.normalize} />
				</article>
			</Container>
		</main>
	);
}
