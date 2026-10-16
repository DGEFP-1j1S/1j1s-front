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
import {
	SelectMultipleActionCloseList,
	SelectMultipleActionFocusFirstOption,
	SelectMultipleActionFocusLastOption,
	SelectMultipleActionFocusOptionMatchingUserInput,
	SelectMultipleActionNextOption,
	SelectMultipleActionOpenList,
	SelectMultipleActionPreviousOption,
	SelectMultipleActionSelectOption,
	SelectMultipleActionSetValueTypedByUser,
	SelectMultipleActionToggleList,
	SelectMultipleReducer,
} from '~/client/components/ui/Form/Select/SelectMultiple/SelectMultipleReducer';
import { SelectOption } from '~/client/components/ui/Form/Select/SelectOption/SelectOption';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { useTouchedInput } from '~/client/hooks/useTouchedInput';

import styles from '../Select.module.scss';
import { SelectContext } from '../SelectContext';

const SELECT_PLACEHOLDER_MULTIPLE = 'Sélectionnez vos choix';
const DEFAULT_DEBOUNCE_TIMEOUT = 300;

export type SelectMultipleProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange' | 'onInvalid'> & {
	value?: Array<string>;
	onChange?: (value: HTMLElement) => void;
	defaultValue?: Array<string>;
	onTouch?: (touched: boolean) => void,
	placeholder?: string,
	required?: boolean,
	onInvalid?: FormEventHandler<HTMLInputElement>,
	optionsAriaLabel: string;
}

export function SelectMultiple({
	optionsAriaLabel,
	children,
	value: valueProps,
	placeholder,
	name,
	onChange: onChangeProps = doNothing,
	onInvalid: onInvalidProps = doNothing,
	onTouch: onTouchProps = doNothing,
	onFocus: onFocusProps = doNothing,
	defaultValue,
	required,
	...rest
}: SelectMultipleProps) {
	const listboxRef = useRef<HTMLUListElement>(null);
	const firstInputHiddenRef = useRef<HTMLInputElement>(null);

	const listboxId = useId();

	const { saveValueOnFocus, setTouchedOnBlur, touched } = useTouchedInput<Array<string>>();

	const [{
		optionsSelectedValues,
		activeDescendant,
		isListOptionsOpen,
	}, dispatch] = useReducer(
		SelectMultipleReducer, {
			activeDescendant: undefined,
			isListOptionsOpen: false,
			optionsSelectedValues: defaultValue ? defaultValue : [],
			valueTypedByUser: '',
			visibleOptions: [],
		},
	);

	function getOptions() {
		return Array.from(listboxRef.current?.querySelectorAll<Element>('[role="option"]') ?? []);
	}
	const value = valueProps ?? optionsSelectedValues;

	const selectOption = useCallback((optionId: string) => {
		firstInputHiddenRef.current?.setCustomValidity('');

		dispatch(new SelectMultipleActionSelectOption(optionId));
		const option = document.getElementById(optionId);
		if (option) { onChangeProps(option); }
	}, [onChangeProps]);

	useEffect(() => {
		if (touched) {
			firstInputHiddenRef.current?.checkValidity();
		}
	}, [value, touched]);

	useLayoutEffect(function scrollOptionIntoView() {
		if (activeDescendant) {
			document.getElementById(activeDescendant)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}, [activeDescendant]);

	const onBlur = useCallback(function onBlur(event: FocusEvent<HTMLButtonElement>) {
		const newFocusStillInCombobox = event.currentTarget.contains(event.relatedTarget);
		if (newFocusStillInCombobox) {
			cancelEvent(event);
			return;
		}
		const touched = setTouchedOnBlur(value);
		if (touched) {
			onTouchProps(touched);
		}
		dispatch(new SelectMultipleActionCloseList());
	}, [onTouchProps, setTouchedOnBlur, value]);
	const onFocus = useCallback(function onFocus(event: FocusEvent<HTMLButtonElement>) {
		saveValueOnFocus(value);
		onFocusProps(event);
	}, [onFocusProps, saveValueOnFocus, value]);

	const isCurrentItemSelected = useCallback((optionValue: string) => {
		return value.includes(optionValue);
	}, [value]);

	const resetValueTypedByUser = useCallback(() => {
		dispatch(new SelectMultipleActionSetValueTypedByUser(''));
	}, []);

	const handleFocusOnTypeLetterDebounce = useMemo(() => {
		return debounce(resetValueTypedByUser, DEFAULT_DEBOUNCE_TIMEOUT);
	}, [resetValueTypedByUser]);

	const onKeyDown = useCallback(function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
		const { key, altKey } = event;
		const options = getOptions();

		if (isSearchableCharacter(event.nativeEvent)) {
			event.preventDefault();
			dispatch(new SelectMultipleActionFocusOptionMatchingUserInput(key, options));
			handleFocusOnTypeLetterDebounce();
		}

		switch (event.key) {
			case KeyBoard.ARROW_UP:
			case KeyBoard.IE_ARROW_UP:
				if (isListOptionsOpen) {
					if (altKey) {
						if (activeDescendant) { selectOption(activeDescendant); }
						dispatch(new SelectMultipleActionCloseList());
					} else {
						dispatch(new SelectMultipleActionPreviousOption(options));
					}
				} else {
					dispatch(new SelectMultipleActionOpenList(options));
				}
				event.preventDefault();
				break;
			case KeyBoard.ARROW_DOWN:
			case KeyBoard.IE_ARROW_DOWN:
				if (isListOptionsOpen) {
					dispatch(new SelectMultipleActionNextOption(options));
				} else {
					dispatch(new SelectMultipleActionOpenList(options));
				}
				event.preventDefault();
				break;
			case KeyBoard.PAGE_UP:
				if (isListOptionsOpen) {
					event.preventDefault();
					dispatch(new SelectMultipleActionPreviousOption(options, 10));
				}
				break;
			case KeyBoard.PAGE_DOWN:
				if (isListOptionsOpen) {
					event.preventDefault();
					dispatch(new SelectMultipleActionNextOption(options, 10));
				}
				break;
			case KeyBoard.ESCAPE:
			case KeyBoard.IE_ESCAPE:
				if (isListOptionsOpen) { event.preventDefault(); }
				dispatch(new SelectMultipleActionCloseList());
				break;
			case KeyBoard.SPACE:
			case KeyBoard.ENTER: {
				if (isListOptionsOpen) {
					const selectedOptionID = event.currentTarget.getAttribute('aria-activedescendant');
					if (selectedOptionID) {
						selectOption(selectedOptionID);
						event.preventDefault();
					}
				} else {
					cancelEvent(event);
					dispatch(new SelectMultipleActionOpenList(options));
				}
				break;
			}
			case KeyBoard.HOME: {
				dispatch(new SelectMultipleActionFocusFirstOption(options));
				event.preventDefault();
				break;
			}
			case KeyBoard.END: {
				dispatch(new SelectMultipleActionFocusLastOption(options));
				event.preventDefault();
				break;
			}
			default:
				break;
		}
	}, [activeDescendant, handleFocusOnTypeLetterDebounce, isListOptionsOpen, selectOption]);

	const placeholderSelectedOptions = useMemo(function placeholderSelectedOptions() {
		const optionsSelectedValueLength = value.length;
		if (optionsSelectedValueLength > 1) { return `${optionsSelectedValueLength} choix sélectionnés`; }
		if (optionsSelectedValueLength === 1) { return '1 choix sélectionné'; }
		if (placeholder) { return placeholder; }
		return SELECT_PLACEHOLDER_MULTIPLE;
	}, [value.length, placeholder]);

	return (
		<SelectContext.Provider value={{
			activeDescendant: activeDescendant,
			isCurrentItemSelected,
			onOptionSelection: selectOption,
		}}>
			<div className={styles.container}>
				<Input
					ref={firstInputHiddenRef}
					onInvalid={onInvalidProps}
					tabIndex={-1}
					required={required}
					aria-hidden="true"
					name={name}
					value={value[0] || ''} />
				{value.slice(1).map((optionValue) => (
					<Input
						type="hidden"
						key={optionValue}
						name={name}
						value={optionValue} />
				))}
				<button
					type="button"
					role="combobox"
					aria-controls={listboxId}
					aria-haspopup="listbox"
					aria-expanded={isListOptionsOpen}
					data-touched={touched}
					onClick={() => dispatch(new SelectMultipleActionToggleList(getOptions()))}
					onFocus={onFocus}
					aria-activedescendant={activeDescendant}
					onKeyDown={onKeyDown}
					onBlur={onBlur}
					aria-required={required}
					{...rest}>
					{placeholderSelectedOptions}
					<Icon name={'angle-down'} />
				</button>
				<ul
					aria-multiselectable="true"
					role="listbox"
					ref={listboxRef}
					aria-label={optionsAriaLabel}
					id={listboxId}
					tabIndex={-1}
					hidden={!isListOptionsOpen}>
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

SelectMultiple.Option = SelectOption;
