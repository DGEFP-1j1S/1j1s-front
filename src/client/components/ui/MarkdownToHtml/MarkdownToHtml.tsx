import classNames from 'classnames';
import React, { useMemo } from 'react';

import { getHtmlFromMd } from './getHtmlFromMd';
import styles from './MarkdownToHtml.module.scss';

interface MarkedProps extends React.ComponentPropsWithoutRef<'div'> {
	markdown: string
}

export default function MarkdownToHtml({ markdown, className, ...rest }: MarkedProps) {
	const html = useMemo(() => ({ __html: getHtmlFromMd(markdown) }), [markdown]);
	return (<div dangerouslySetInnerHTML={html} className={classNames(styles.markdown, className)} {...rest} />);
}
