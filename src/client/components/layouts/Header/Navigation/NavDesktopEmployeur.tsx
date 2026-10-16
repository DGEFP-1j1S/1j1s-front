import classNames from 'classnames';
import { useRouter } from 'next/router';
import { FocusEvent,useCallback,useMemo, useRef, useState } from 'react';

import { Icon } from '~/client/components/ui/Icon/Icon';
import { Link } from '~/client/components/ui/Link/Link';
import { useExitModal } from '~/client/hooks/useExitModal';

import styles from './NavDesktopEmployeur.module.scss';
import { isNavigationItem, NavigationItem, NavigationItemWithChildren } from './NavigationStructure';

interface NavEmployeursProps {
  item: NavigationItemWithChildren;
  onClick?: () => void;
}

export function NavDesktopEmployeur({ item: root }: NavEmployeursProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const wrapper = useRef<HTMLDivElement>(null);
	const content = useRef<HTMLUListElement>(null);
	const router = useRouter();
	const isActive = useMemo(() => isItemActive(root, router.pathname), [router.pathname, root]);

	useExitModal(wrapper, isExpanded, () => isExpanded && setIsExpanded(false));

	const onBlur = useCallback((event: FocusEvent<HTMLLIElement>) => {
		const newFocusStillInSubItems = event.currentTarget.contains(event.relatedTarget);
		
		if (!newFocusStillInSubItems) {
			setIsExpanded(false);
			return;
		}
	}, []);

	return (
		<li className={styles.navItem} onBlur={onBlur}>
			<button className={styles.navItemButton}
				onClick={(e) => {
					e.stopPropagation();
					setIsExpanded(!isExpanded);
				}}>
				<span className={styles.navItemLabel} aria-current={isActive}>{root.label}</span>
				<Icon name="angle-down" className={classNames(styles.icon, { [styles.expanded]: isExpanded })} />
			</button>
			<div ref={wrapper} className={classNames(styles.navWrapper, { [styles.expanded]: isExpanded })}>
				<ul ref={content} className={styles.navDetail}>
					{listsFromChildren(router.pathname, root, () => setIsExpanded(false))}
				</ul>
			</div>
		</li>
	);
}

function isItemActive(item: NavigationItemWithChildren, path: string): boolean {
	return item.children.some((subItem) => {
		return isNavigationItem(subItem) ? subItem.link === path : isItemActive(subItem, path);
	});
}

function listsFromChildren(path: string, item: NavigationItemWithChildren | NavigationItem, onItemChosen: () => void) {
	const isActive = isNavigationItem(item) && item.link === path;
	if (isNavigationItem(item)) {
		return (
			<li key={item.link} className={styles.navLeaf}>
				<span aria-current={isActive} onClick={onItemChosen} className={styles.employeursLien}>
					<Link href={item.link}>
						{item.label}
					</Link>
				</span>
			</li>
		);
	}
	return (
		<li key={item.label} className={styles.navSection}>
			<span className={styles.navSectionHeader}>
				<strong className={styles.subNavTitle}>{item.label}</strong>
				{item.legend ? <em>{item.legend}</em> : ''}
			</span>
			<ul className={styles.navSectionItems}>
				{item.children.map((i) => listsFromChildren(path, i, onItemChosen))}
			</ul>
		</li>
	);
}
