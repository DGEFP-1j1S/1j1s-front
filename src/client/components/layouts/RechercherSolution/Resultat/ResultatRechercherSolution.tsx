import classNames from 'classnames';
import React, { PropsWithChildren, ReactNode, useId } from 'react';

import styles from '~/client/components/layouts/RechercherSolution/Resultat/ResultatRechercherSolution.module.scss';
import { Image } from '~/client/components/ui/Img';
import { Link } from '~/client/components/ui/Link/Link';
import { TagList } from '~/client/components/ui/Tag/TagList';

type LogoProps = ({ logo?: never, logoAlt?: never } | { logo: string, logoAlt?: string })
type ResultatRechercherSolutionProps = {
	lienOffre?: string;
	intituléOffre: string | ReactNode;
	intituléLienOffre?: string;
	sousTitreOffre?: string | ReactNode;
	étiquetteOffreList: Array<string>;
} & React.HTMLAttributes<HTMLElement> & LogoProps;

export function ResultatRechercherSolution(props: PropsWithChildren<ResultatRechercherSolutionProps>) {
	const {
		lienOffre,
		intituléOffre,
		intituléLienOffre,
		logo,
		sousTitreOffre,
		étiquetteOffreList,
		children,
		logoAlt = '',
		className,
	} = props;
	const idLink = useId();
	const idIntitulé = useId();

	return (
		<div className={classNames(styles.card, className)}>

			{logo && <Image alt={logoAlt} src={logo} width={120} height={120} />}

			<div className={styles.mainContent}>
				<header>
					<h3 id={idIntitulé} className={styles.title}>{intituléOffre}</h3>
					{sousTitreOffre && <div className={styles.subtitle}>{sousTitreOffre}</div>}
				</header>

				{children && <div>{children}</div>}
			</div>

			<span className={styles.separator} />

			{étiquetteOffreList.length > 0 &&
				<TagList className={styles.tags} list={étiquetteOffreList} aria-label="Caractéristiques de l‘offre" />}

			{lienOffre && (
				<Link
					id={idLink}
					href={lienOffre}
					appearance={'asQuaternaryButton'}
					aria-labelledby={intituléLienOffre ? undefined : `${idIntitulé} ${idLink}`}>
					{intituléLienOffre || 'En savoir plus'}
					<Link.Icon name="angle-right" />
				</Link>
  		)}
		</div>
	);
}
