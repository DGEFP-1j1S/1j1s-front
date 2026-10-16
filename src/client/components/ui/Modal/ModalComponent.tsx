import classNames from 'classnames';
import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { KeyBoard } from '~/client/components/keyboard/keyboard.enum';
import { HtmlHeadingTag } from '~/client/components/props';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Icon } from '~/client/components/ui/Icon/Icon';
import styles from '~/client/components/ui/Modal/ModalComponent.module.scss';

interface ModalProps extends React.ComponentPropsWithoutRef<'dialog'> {
	isOpen: boolean;
	close: (...args: unknown[]) => unknown
	closeLabel?: string;
	closeTitle?: string;
	keepModalMounted?: boolean
}

type LabelRequired = {
	'aria-label'?: string;
	'aria-labelledby': string;
} | {
	'aria-label': string;
	'aria-labelledby'?: string;
}

type ModalPropsWithAccessibleDescription = LabelRequired & ModalProps

export function ModalComponent(props: ModalPropsWithAccessibleDescription) {
	const {
		children,
		className,
		close,
		closeLabel = 'Fermer',
		closeTitle = 'Fermer la modale',
		keepModalMounted = false,
		isOpen,
		...rest
	} = props;
	const modalRef = useRef<HTMLDialogElement>(null);
	const lastFocusBeforeOpenRef = useRef<HTMLElement | null>(null);

	function disableDocumentBodyScroll(isOpen: boolean) {
		document.body.style.overflow = isOpen ? 'hidden' : 'visible';
	}

	const closeModalOnClickOutside = useCallback((event: MouseEvent) => {
		if (modalRef.current && !modalRef.current.contains(event.target as Node))
			close();
	}, [modalRef, close]);

	const closeModalOnClickEscape = useCallback((event: KeyboardEvent) => {
		if (isOpen && (event.key === KeyBoard.ESCAPE || event.key === KeyBoard.IE_ESCAPE) && !event.defaultPrevented)
			close();
	}, [isOpen, close]);

	useEffect(function enableDocumentBodyWhenTheModalIsClosing() {
		return () => {
			disableDocumentBodyScroll(false);
		};
	}, []);

	useEffect(function gestionSortieModale() {
		document.addEventListener('mousedown', closeModalOnClickOutside);
		document.addEventListener('keydown', closeModalOnClickEscape);

		return () => {
			document.removeEventListener('mousedown', closeModalOnClickOutside);
			document.addEventListener('keydown', closeModalOnClickEscape);
		};
	}, [closeModalOnClickOutside, closeModalOnClickEscape]);

	function trapModalFocus() {
		if (modalRef.current) {
			const focusableElements = getFocusableElementsOf(modalRef.current);
			const firstFocusableElement = focusableElements[0] as HTMLElement;
			firstFocusableElement.focus();
		}

		window.addEventListener('keydown', function gestionTabulation(e) {
			if (!modalRef.current) return;
			if (e.key !== KeyBoard.TAB) return;

			const focusableElements = getFocusableElementsOf(modalRef.current);
			const firstFocusableElement = focusableElements[0] as HTMLElement;
			const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

			const tabOnLastFocusableElement = !e.shiftKey && document.activeElement === lastFocusableElement;
			if (tabOnLastFocusableElement) {
				firstFocusableElement.focus();
				return e.preventDefault();
			}

			const backtabOnFirstFocusableElement = e.shiftKey && document.activeElement === firstFocusableElement;
			if (backtabOnFirstFocusableElement) {
				lastFocusableElement.focus();
				return e.preventDefault();
			}
		});

		function getFocusableElementsOf(htmlElement: HTMLDialogElement) {
			return htmlElement.querySelectorAll('button, [href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])');
		}
	}

	useEffect(function HandleFocusBeforeOpen() {
		if (isOpen) {
			lastFocusBeforeOpenRef.current = document.activeElement as HTMLElement;
		}

		return () => {
			lastFocusBeforeOpenRef.current?.focus();
			lastFocusBeforeOpenRef.current = null;
		};
	}, [isOpen]);


	useEffect(() => {
		disableDocumentBodyScroll(isOpen);
		trapModalFocus();
	}, [isOpen]);

	return (
		<>
			{(isOpen || keepModalMounted) && createPortal(
				<dialog
					ref={modalRef}
					className={classNames(className, styles.modal)}
					open={isOpen}
					aria-modal="true"
					{...rest}>
					<div className={styles.modalBody}>
						<div className={styles.modalClose}>
							<ButtonComponent
								appearance="quaternary"
								icon={<Icon name="close" />}
								iconPosition="right"
								label={closeLabel}
								title={closeTitle}
								onClick={() => close()} />
						</div>
						{children}
					</div>
				</dialog>,
				document.body,
			)}
		</>
	);
}

function ModalTitle(props: { titleAs?: HtmlHeadingTag } & React.ComponentPropsWithoutRef<HtmlHeadingTag>) {
	const {
		titleAs = 'h1',
		children,
		className,
		id,
		...rest
	} = props;
	return React.createElement(titleAs, { className: classNames(className, styles.modalTitle), id, ...rest }, children);
}

function ModalContent({ children, className, ...rest }: React.ComponentPropsWithoutRef<'div'>) {
	return <div className={classNames(className, styles.modalContent)} {...rest}>{children}</div>;
}

function ModalFooter({ children, className, ...rest }: React.ComponentPropsWithoutRef<'footer'>) {
	return <footer className={classNames(className, styles.modalFooter)} {...rest}>{children}</footer>;
}

ModalComponent.Title = ModalTitle;
ModalComponent.Content = ModalContent;
ModalComponent.Footer = ModalFooter;
