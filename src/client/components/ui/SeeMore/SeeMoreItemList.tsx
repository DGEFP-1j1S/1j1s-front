import classNames from 'classnames';
import React, { useCallback, useId, useMemo, useRef, useState } from 'react';

import { Button } from '~/client/dsfr';
import { Icon } from '~/client/components/ui/Icon/Icon';

const SEE_MORE_LABEL_DEFAULT = 'Voir plus';
const SEE_LESS_LABEL_DEFAULT = 'Voir moins';
const NUMBER_OF_VISIBLE_ITEMS_DEFAULT = 3;

export interface SeeMoreProps extends React.ComponentPropsWithoutRef<'div'> {
	itemList: React.ReactNode[]
	numberOfVisibleItems: number
	seeMoreLabel?: string
	seeLessLabel?: string
	seeMoreAriaLabel: string
	seeLessAriaLabel: string
}

export default function SeeMoreItemList(props: SeeMoreProps) {
	const {
		itemList,
		numberOfVisibleItems = NUMBER_OF_VISIBLE_ITEMS_DEFAULT,
		seeMoreLabel = SEE_MORE_LABEL_DEFAULT,
		seeLessLabel = SEE_LESS_LABEL_DEFAULT,
		seeMoreAriaLabel,
		seeLessAriaLabel,
		className,
	} = props;

	const ariaId = useId();
	const listRef = useRef<HTMLUListElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	const completeItemList = useMemo(() => itemList, [itemList]);

	const visibleItemList = useMemo(() => {
		return itemList?.slice(0, numberOfVisibleItems);
	}, [itemList, numberOfVisibleItems]);


	const itemListToDisplay = useMemo(() => {
		if (isOpen) return completeItemList;
		return visibleItemList;
	}, [isOpen, completeItemList, visibleItemList]);

	const toggle = useCallback(() => {
		listRef.current?.focus();
		listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

		setIsOpen(!isOpen);
	}, [isOpen]);

	const buttonLabel = useMemo(() => isOpen ? seeLessLabel : seeMoreLabel,
		[seeMoreLabel, seeLessLabel, isOpen]);
	const buttonAriaLabel = useMemo(() => isOpen ? seeLessAriaLabel : seeMoreAriaLabel,
		[isOpen, seeLessAriaLabel, seeMoreAriaLabel]);

	if (!itemList || itemList.length <= 0) return null;
	return (
		<>
			{itemListToDisplay.length > 0 && (
				
					<ul id={`section-${ariaId}`} className='fr-grid-row fr-grid-row--gutters' ref={listRef} tabIndex={-1}>
						{itemListToDisplay?.map((element, index) =>
							<li key={index} className="fr-col-lg-4 fr-col-md-6 fr-col-12">{element}</li>,
						)}
					</ul>
				
			)}
			{itemList.length > numberOfVisibleItems && (
				<div className='flex justify-center fr-mt-4w'>
					<Button className={classNames(className)}
						appearance="tertiary"
						label={buttonLabel}
						icon={isOpen ? <Icon name={'angle-up'} /> : <Icon name={'angle-down'} />}
						iconPosition={'right'}
						onClick={toggle}
						type="button"
						aria-expanded={isOpen}
						aria-controls={`section-${ariaId}`}
						aria-label={buttonAriaLabel} 
					/>
				</div>
			)}
		</>
	);
}
