import React, { useMemo } from 'react';

import { getHtmlFromMd } from './getHtmlFromMd';

interface MarkedProps extends React.ComponentPropsWithoutRef<'div'> {
	markdown: string
}

export default function MarkdownToHtml({ markdown, ...rest }: MarkedProps) {
	const html = useMemo(() => ({ __html: getHtmlFromMd(markdown) }), [markdown]);
	return (<div dangerouslySetInnerHTML={html} {...rest} />);
}
