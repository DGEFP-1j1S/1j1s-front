import debounce from 'lodash.debounce';
import React, {
	FocusEvent,
	FormEventHandler,
	KeyboardEvent,
	SyntheticEvent,
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useReducer,
	useRef,
} from 'react';

import { KeyBoard } from '~/client/components/keyboard/keyboard.enum';
import { Input } from '~/client/components/ui/Form/Input';
import { isSearchableCharacter } from '~/client/components/ui/Form/Select/Select.utils';
import { SelectContext } from '~/client/components/ui/Form/Select/SelectContext';
import { SelectOption } from '~/client/components/ui/Form/Select/SelectOption/SelectOption';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { useTouchedInput } from '~/client/hooks/useTouchedInput';

import styles from '../Select.module.scss';
import {
	SelectSimpleActionClearUserInput,
	SelectSimpleActionCloseList,
	SelectSimpleActionFocusFirstOption,
	SelectSimpleActionFocusLastOption,
	SelectSimpleActionFocusOptionMatchingUserInput,
	SelectSimpleActionNextOption,
	SelectSimpleActionOpenList,
	SelectSimpleActionPreviousOption,
	SelectSimpleActionSelectOption,
	SelectSimpleActionToggleList,
	SelectSimpleReducer,
} from './SelectSimpleReducer';

const DEFAULT_PLACEHOLDER = 'Sélectionnez votre choix';
const DEFAULT_DEBOUNCE_TIMEOUT = 300;

export type SelectSimpleProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange' | 'onInvalid'> & {
	value?: Value;
	onChange?: (value: HTMLElement) => void;
	defaultValue?: string;
	onTouch?: (touched: boolean) => void,
	placeholder?: string,
	required?: boolean,
	onInvalid?: FormEventHandler<HTMLInputElement>,
	optionsAriaLabel: string;
}

type Value = string;

export function SelectSimple({
	optionsAriaLabel,
	children,
	value: valueProps,
	placeholder: placeholderProps,
	name,
	onChange: onChangeProps = doNothing,
	onFocus: onFocusProps = doNothing,
	onInvalid: onInvalidProps = doNothing,
	onTouch: onTouchProps = doNothing,
	defaultValue,
	required,
	...rest
}: SelectSimpleProps) {
	const listboxRef = useRef<HTMLUListElement>(null);
	const inputHiddenRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();

	const { saveValueOnFocus, setTouchedOnBlur, touched } = useTouchedInput();

	const [{
		activeDescendant,
		open,
		selectedValue: valueState,
	}, dispatch] = useReducer(
		SelectSimpleReducer, {
			activeDescendant: undefined,
			open: false,
			selectedValue: defaultValue ?? '',
			userInput: '',
			visibleOptions: [],
		},
	);

	function getOptions() {
		return Array.from(listboxRef.current?.querySelectorAll<Element>('[role="option"]') ?? []);
	}

	const value = valueProps ?? valueState;
	const placeholder = useDisplayName(value, children, placeholderProps);

	useEffect(function checkValidityOnChange() {
		if (touched) {
			inputHiddenRef.current?.checkValidity();
		}
	}, [value, touched]);

	const selectOption = useCallback(function selectOption(optionId: string) {
		dispatch(new SelectSimpleActionSelectOption(optionId));
		const option = document.getElementById(optionId);
		if (option) { onChangeProps(option); }
	}, [onChangeProps]);

	useLayoutEffect(function scrollOptionIntoView() {
		if (activeDescendant) {
			document.getElementById(activeDescendant)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}, [activeDescendant]);

	const onFocus = useCallback(function onFocus(event: FocusEvent<HTMLButtonElement>) {
		saveValueOnFocus(value ?? '');
		onFocusProps(event);
	}, [onFocusProps, saveValueOnFocus, value]);

	const onBlur = useCallback(function onBlur(event: FocusEvent<HTMLButtonElement>) {
		const newFocusStillInSelect = event.currentTarget.contains(event.relatedTarget);
		if (newFocusStillInSelect) {
			cancelEvent(event);
			return;
		}

		const touched = setTouchedOnBlur(value ?? '');
		if (touched) {
			onTouchProps(touched);
		}
		dispatch(new SelectSimpleActionCloseList());
	}, [onTouchProps, setTouchedOnBlur, value]);

	const isSelected = useCallback(function isSelected(optionValue?: string) {
		return value === optionValue;
	}, [value]);

	const clearUserInput = useMemo(() => {
		return debounce(() => dispatch(new SelectSimpleActionClearUserInput()), DEFAULT_DEBOUNCE_TIMEOUT);
	}, []);

	const onKeyDown = useCallback(function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
		const { key, altKey } = event;
		const options = getOptions();

		const searchableCharacter = isSearchableCharacter(event.nativeEvent);
		if (searchableCharacter) {
			event.preventDefault();
			dispatch(new SelectSimpleActionFocusOptionMatchingUserInput(key, options));
			clearUserInput();
		}

		switch (key) {
			case KeyBoard.PAGE_UP:
				if (open) {
					event.preventDefault();
					dispatch(new SelectSimpleActionPreviousOption(options, 10));
				}
				break;
			case KeyBoard.PAGE_DOWN:
				if (open) {
					event.preventDefault();
					dispatch(new SelectSimpleActionNextOption(options, 10));
				}
				break;
			case KeyBoard.ARROW_UP:
			case KeyBoard.IE_ARROW_UP:
				if (open) {
					if (altKey) {
						if (activeDescendant) { selectOption(activeDescendant); }
					} else {
						dispatch(new SelectSimpleActionPreviousOption(options));
					}
				} else {
					dispatch(new SelectSimpleActionOpenList(options));
				}
				event.preventDefault();
				break;
			case KeyBoard.ARROW_DOWN:
			case KeyBoard.IE_ARROW_DOWN:
				if (open) {
					dispatch(new SelectSimpleActionNextOption(options));
				} else {
					dispatch(new SelectSimpleActionOpenList(options));
				}
				event.preventDefault();
				break;
			case KeyBoard.ESCAPE:
			case KeyBoard.IE_ESCAPE:
				if (open) {
					event.preventDefault();
					dispatch(new SelectSimpleActionCloseList());
				}
				break;
			case KeyBoard.SPACE:
			case KeyBoard.ENTER: {
				if (open) {
					if (activeDescendant) {
						selectOption(activeDescendant);
						event.preventDefault();
					}
				} else {
					cancelEvent(event);
					dispatch(new SelectSimpleActionOpenList(options));
				}
				break;
			}
			case KeyBoard.TAB: {
				if (open) {
					if (activeDescendant) {
						selectOption(activeDescendant);
					}
				}
				break;
			}
			case KeyBoard.HOME: {
				dispatch(new SelectSimpleActionFocusFirstOption(options));
				event.preventDefault();
				break;
			}
			case KeyBoard.END: {
				dispatch(new SelectSimpleActionFocusLastOption(options));
				event.preventDefault();
				break;
			}
			default:
				break;

		}
	}, [activeDescendant, clearUserInput, open, selectOption]);

	return (
		<SelectContext.Provider value={{
			activeDescendant: activeDescendant,
			isCurrentItemSelected: isSelected,
			onOptionSelection: selectOption,
		}}>
			<div className={styles.container}>
				<Input
					ref={inputHiddenRef}
					tabIndex={-1}
					required={required}
					aria-hidden={'true'}
					name={name}
					onInvalid={onInvalidProps}
					value={value} />
				<button
					type="button"
					role="combobox"
					aria-controls={listboxId}
					aria-haspopup="listbox"
					aria-expanded={open}
					data-touched={touched}
					aria-required={required}
					onClick={() => dispatch(new SelectSimpleActionToggleList(getOptions()))}
					aria-activedescendant={activeDescendant}
					onKeyDown={onKeyDown}
					onBlur={onBlur}
					onFocus={onFocus}
					{...rest}>
					{placeholder}
					<Icon name={'angle-down'} />
				</button>
				<ul
					role="listbox"
					ref={listboxRef}
					aria-label={optionsAriaLabel}
					id={listboxId}
					tabIndex={-1}
					hidden={!open}>
					{children}
				</ul>
			</div>
		</SelectContext.Provider>
	);
}


function cancelEvent(event: SyntheticEvent) {
	event.preventDefault();
	event.stopPropagation();
}

function doNothing() {
	return;
}

function extractTextContent(node: React.ReactNode): string {
	if (typeof node === 'string') return node;
	if (typeof node === 'number') return String(node);
	if (Array.isArray(node)) return node.map(extractTextContent).join('');
	if (React.isValidElement(node)) return extractTextContent(node.props.children);
	return '';
}

function useDisplayName(value: Value | undefined, children: React.ReactNode, placeholder?: string): string {
	return useMemo(() => {
		if (!value) return placeholder ?? DEFAULT_PLACEHOLDER;

		let displayName: string | undefined;
		React.Children.forEach(children, (child) => {
			if (React.isValidElement(child) && child.props.value?.toString() === value) {
				displayName = extractTextContent(child.props.children);
			}
		});

		return displayName ?? placeholder ?? DEFAULT_PLACEHOLDER;
	}, [value, children, placeholder]);
}

SelectSimple.Option = SelectOption;
