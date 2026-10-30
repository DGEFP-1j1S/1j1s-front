import classNames from 'classnames';
import React, {
	FocusEvent,
	KeyboardEvent,
	useCallback,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';

import { KeyBoard } from '~/client/components/keyboard/keyboard.enum';
import styles from '~/client/components/ui/Form/Select/Select.module.scss';
import { SelectContext } from '~/client/components/ui/Form/Select/SelectContext';
import { SelectOption } from '~/client/components/ui/Form/Select/SelectOption/SelectOption';

import comboboxMultipleStyles from './ComboboxMultiple.module.scss';

export type ComboboxMultipleProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'value' | 'onChange'> & {
	optionsAriaLabel: string
	value: Array<string>
	onChange: (optionValue: string) => void
	inputValue: string
	onInputValueChange: (inputValue: string) => void
	onTouch?: (touched: boolean) => void
};

export function ComboboxMultiple({
	optionsAriaLabel,
	value,
	onChange,
	inputValue,
	onInputValueChange,
	onTouch,
	onKeyDown: onKeyDownProps,
	className,
	children,
	...inputProps
}: ComboboxMultipleProps) {
	const listboxRef = useRef<HTMLUListElement>(null);
	const listboxId = useId();
	const [isListOpen, setIsListOpen] = useState(false);
	const [activeDescendant, setActiveDescendant] = useState<string | undefined>(undefined);

	function getOptions() {
		return Array.from(listboxRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
	}

	function ouvrirLaListe() {
		setIsListOpen(true);
	}

	function fermerLaListe() {
		setIsListOpen(false);
		setActiveDescendant(undefined);
	}

	useLayoutEffect(function scrollOptionIntoView() {
		if (activeDescendant) {
			document.getElementById(activeDescendant)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}, [activeDescendant]);

	const onOptionSelection = useCallback((optionId: string) => {
		const optionValue = document.getElementById(optionId)?.getAttribute('data-value');
		if (optionValue) onChange(optionValue);
	}, [onChange]);

	const isCurrentItemSelected = useCallback((optionValue: string) => value.includes(optionValue), [value]);

	function deplacerLOptionActive(decalage: number) {
		const options = getOptions();
		if (options.length === 0) return;
		const indexCourant = options.findIndex((option) => option.id === activeDescendant);
		const indexSuivant = indexCourant === -1
			? (decalage > 0 ? 0 : options.length - 1)
			: (indexCourant + decalage + options.length) % options.length;
		setActiveDescendant(options[indexSuivant].id);
	}

	function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		switch (event.key) {
			case KeyBoard.ARROW_DOWN:
			case KeyBoard.IE_ARROW_DOWN:
				event.preventDefault();
				if (!isListOpen) {
					ouvrirLaListe();
				} else if (!event.altKey) {
					deplacerLOptionActive(1);
				}
				break;
			case KeyBoard.ARROW_UP:
			case KeyBoard.IE_ARROW_UP:
				event.preventDefault();
				if (!isListOpen) {
					ouvrirLaListe();
				} else {
					deplacerLOptionActive(-1);
				}
				break;
			case KeyBoard.ESCAPE:
			case KeyBoard.IE_ESCAPE:
				if (isListOpen) event.preventDefault();
				fermerLaListe();
				break;
			case KeyBoard.ENTER:
				// NOTE : sans option active, Entrée soumet le formulaire
				if (isListOpen && activeDescendant) {
					event.preventDefault();
					onOptionSelection(activeDescendant);
				}
				break;
			default:
				break;
		}
		onKeyDownProps?.(event);
	}

	function onBlur(event: FocusEvent<HTMLDivElement>) {
		if (!event.currentTarget.contains(event.relatedTarget)) {
			fermerLaListe();
			// NOTE : la saisie ne sert qu‘à filtrer les options ; on la vide pour laisser voir le placeholder (ex : nombre d‘options cochées)
			if (inputValue) onInputValueChange('');
			onTouch?.(true);
		}
	}

	return (
		<SelectContext.Provider value={{ activeDescendant, isCurrentItemSelected, onOptionSelection }}>
			<div className={classNames(styles.container, comboboxMultipleStyles.comboboxMultiple, className)} onBlur={onBlur}>
				<input
					type="text"
					role="combobox"
					className="fr-input"
					autoComplete="off"
					aria-autocomplete="list"
					aria-controls={listboxId}
					aria-expanded={isListOpen}
					aria-activedescendant={activeDescendant}
					value={inputValue}
					onChange={(event) => {
						onInputValueChange(event.currentTarget.value);
						setActiveDescendant(undefined);
						ouvrirLaListe();
					}}
					onClick={ouvrirLaListe}
					onKeyDown={onKeyDown}
					{...inputProps} />
				<ul
					className="fr-pl-0"
					role="listbox"
					aria-multiselectable="true"
					aria-label={optionsAriaLabel}
					id={listboxId}
					ref={listboxRef}
					tabIndex={-1}
					hidden={!isListOpen}>
					{children}
				</ul>
			</div>
		</SelectContext.Provider>
	);
}

ComboboxMultiple.Option = SelectOption;
