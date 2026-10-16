import React, { useMemo } from 'react';

import { useCombobox } from '~/client/components/ui/Form/Combobox/ComboboxContext';

type CategoryProps = React.ComponentPropsWithoutRef<'ul'> & {
	name: string,
};

function extractTextContent(node: React.ReactNode): string {
	if (typeof node === 'string') return node;
	if (typeof node === 'number') return String(node);
	if (Array.isArray(node)) return node.map(extractTextContent).join('');
	if (React.isValidElement(node)) return extractTextContent(node.props.children);
	return '';
}

function createElementProxy(child: React.ReactElement): Element {
	return {
		textContent: extractTextContent(child.props.children),
		getAttribute: (attr: string) => attr === 'data-value' ? (child.props.value?.toString() ?? null) : null,
	} as unknown as Element;
}

export const Category = React.forwardRef<HTMLUListElement, CategoryProps>(function Category({
	children,
	name,
	...ulProps
}, outerRef) {
	const { state: { value }, filter } = useCombobox();

	const hidden = useMemo(() => {
		let hasMatchingOption = false;
		React.Children.forEach(children, (child) => {
			if (!hasMatchingOption && React.isValidElement(child)) {
				if (filter(createElementProxy(child), value)) {
					hasMatchingOption = true;
				}
			}
		});
		return !hasMatchingOption;
	}, [children, value, filter]);

	return (
		<li role="none" hidden={hidden}>
			{name}
			<ul role="group" aria-label={name} {...ulProps} ref={outerRef}>
				{children}
			</ul>
		</li>
	);
});
