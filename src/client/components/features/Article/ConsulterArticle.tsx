import classNames from 'classnames';

import styles from '~/client/components/features/Article/ConsulterArticle.module.scss';
import { BackButton } from '~/client/components/features/ButtonRetour/BackButton';
import MarkdownToHtml from '~/client/components/ui/MarkdownToHtml/MarkdownToHtml';
import MarkdownToHtmlStyles from '~/client/components/ui/MarkdownToHtml/MarkdownToHtml.module.scss';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import useSanitize from '~/client/hooks/useSanitize';
import { DateService } from '~/client/services/date/date.service';
import { Article } from '~/server/articles/domain/article';

interface ConsulterArticleProps {
  article: Article
}

export function ConsulterArticle({ article }: ConsulterArticleProps) {
	const titre = useSanitize(article.titre);
	const bannièreSrc = useSanitize(article.bannière?.src);
	const bannièreAlt = useSanitize(article.bannière?.alt);
	const contenu = article.contenu ;

	const dateService = useDependency<DateService>('dateService');
	const dateDerniereMiseAJour = article.dateDerniereMiseAJour ? dateService.formatToHumanReadableDate(new Date(article.dateDerniereMiseAJour)) : undefined;

	return (
		<>
			<main className={classNames('fr-container', styles.consulterArticle)}>
				<BackButton className={styles.consulterArticleButtonRetour} />
				<h1 className={classNames(styles.titre, styles.blocTexte)}>{titre}</h1>
				{ dateDerniereMiseAJour && <p className={styles.blocTexte}>Dernière mise à jour le {dateDerniereMiseAJour}</p> }
				{/* eslint-disable-next-line @next/next/no-img-element */}
				{ bannièreSrc && <img src={bannièreSrc} alt={bannièreAlt} decoding="async" loading="lazy" /> }
				<MarkdownToHtml markdown={contenu} className={classNames(styles.blocTexte, MarkdownToHtmlStyles.normalize)} />
			</main>
		</>
	);
}
