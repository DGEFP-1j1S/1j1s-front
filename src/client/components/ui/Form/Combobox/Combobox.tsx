import classNames from 'classnames';
import React, {
	ComponentPropsWithoutRef,
	FocusEvent,
	KeyboardEvent,
	SyntheticEvent,
	useCallback,
	useId,
	useLayoutEffect,
	useMemo,
	useReducer,
	useRef,
} from 'react';

import { KeyBoard } from '~/client/components/keyboard/keyboard.enum';
import { Input } from '~/client/components/ui/Form/Input';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { useSynchronizedRef } from '~/client/hooks/useSynchronizedRef';
import { useTouchedInput } from '~/client/hooks/useTouchedInput';

import { ChangeEvent } from './ChangeEvent';
import styles from './Combobox.module.scss';
import { ComboboxProvider } from './ComboboxContext';
import {
	ComboboxActionCloseList,
	ComboboxActionNextOption,
	ComboboxActionOpenList,
	ComboboxActionPreviousOption,
	ComboboxActionSelectOption,
	ComboboxActionSetValue,
	ComboboxActionToggleList,
	ComboboxReducer,
} from './ComboboxReducer';
import { filterValueOrLabelStartsWith } from './filterStrategies/filterValueOrLabelStartsWith';


type ComboboxProps = Omit<
	React.ComponentPropsWithoutRef<'input'>, 'onBlur' | 'onFocus' | 'onChange' | 'onInput'
> & {
	optionsAriaLabel: string;
	onBlur?: React.ComponentPropsWithoutRef<'div'>['onBlur'],
	onFocus?: React.ComponentPropsWithoutRef<'div'>['onFocus'],
	onChange?: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void,
	onInput?: (event: React.FormEvent<HTMLInputElement>, newValue: string) => void,
	onTouch?: (touched: boolean) => void,
	requireValidOption?: boolean,
	filter?: (element: Element, currentValue: string) => boolean,
	valueName?: string;
};

type InputValue = ComponentPropsWithoutRef<'input'>['value']
export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(function Combobox({
	children,
	value: valueProps,
	defaultValue,
	className,
	name,
	valueName,
	'aria-controls': ariaControls,
	optionsAriaLabel,
	onKeyDown: onKeyDownProps = doNothing,
	onChange: onChangeProps = doNothing,
	onBlur: onBlurProps = doNothing,
	onFocus: onFocusProps = doNothing,
	onInput: onInputProps = doNothing,
	onTouch: onTouchProps = doNothing,
	requireValidOption = false,
	required = false,
	filter = filterValueOrLabelStartsWith,
	...inputProps
}, inputOuterRef) {
	const { touched, saveValueOnFocus, setTouchedOnBlur } = useTouchedInput();

	const listboxRef = useRef<HTMLUListElement>(null);
	const inputRef = useSynchronizedRef(inputOuterRef);
	const [state, dispatch] = useReducer(
		ComboboxReducer, {
			activeDescendant: undefined,
			open: false,
			value: valueProps?.toString()
				?? defaultValue?.toString()
				?? '',
			visibleOptions: [],
		},
	);

	function getVisibleOptions() {
		return Array.from(listboxRef.current?.querySelectorAll<Element>('[role="option"]:not([hidden])') ?? []);
	}
	const { open, activeDescendant, value: valueState } = state;
	const value = valueProps?.toString() ?? valueState;
	const listboxId = useId();

	const matchingOptionValue = useMemo(() => {
		if (!value) return '';
		return findOptionValueByLabel(children, value) ?? '';
	}, [children, value]);

	const findMatchingOption = useCallback(function findMatchingOption(inputValue: InputValue): HTMLElement | undefined | null {
		const matchingOptionId = state.visibleOptions.find((optionId) => {
			const option = document.getElementById(optionId);
			return option?.textContent === inputValue;
		});
		return matchingOptionId ? document.getElementById(matchingOptionId) : undefined;
	}, [state.visibleOptions]);

	const validation = useCallback(function validation(newValue: InputValue) {
		if (!requireValidOption) return '';

		const isOptionValid = !!findMatchingOption(newValue);
		if (isOptionValid || (newValue === '' && !required)) {
			return '';
		}

		return 'Veuillez sélectionner une option dans la liste';
	}, [findMatchingOption, requireValidOption, required]);

	useLayoutEffect(function scrollOptionIntoView() {
		if (activeDescendant) {
			document.getElementById(activeDescendant)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}, [activeDescendant]);

	const triggerChangeEvent = useCallback(function triggerChangeEvents(newValue: string) {
		if (inputRef.current) {
			inputRef.current?.setCustomValidity('');
			const changeEvent = new ChangeEvent<HTMLInputElement>(inputRef.current);
			onChangeProps(changeEvent, newValue);
			onInputProps(changeEvent, newValue);
		}
	}, [inputRef, onChangeProps, onInputProps]);

	const onOptionSelection = useCallback(function onOptionSelection(option: Element) {
		dispatch(new ComboboxActionSelectOption(option));
		triggerChangeEvent(option.textContent ?? '');
		inputRef.current?.focus();
	}, [inputRef, triggerChangeEvent]);

	const onKeyDown = useCallback(function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		const options = getVisibleOptions();
		switch (event.key) {
			case KeyBoard.ARROW_UP:
			case KeyBoard.IE_ARROW_UP:
				dispatch(new ComboboxActionPreviousOption(options));
				event.preventDefault();
				break;
			case KeyBoard.ARROW_DOWN:
			case KeyBoard.IE_ARROW_DOWN:
				if (event.altKey) {
					dispatch(new ComboboxActionOpenList());
				} else {
					dispatch(new ComboboxActionNextOption(options));
				}
				event.preventDefault();
				break;
			case KeyBoard.ESCAPE:
			case KeyBoard.IE_ESCAPE:
				dispatch(new ComboboxActionCloseList());
				break;
			case KeyBoard.ENTER: {
				const selectedOptionID = event.currentTarget.getAttribute('aria-activedescendant');
				if (selectedOptionID) {
					dispatch(new ComboboxActionSelectOption(selectedOptionID));
					const selectedElement = document.getElementById(selectedOptionID);
					triggerChangeEvent(selectedElement?.textContent ?? '');
					event.preventDefault();
				}
				break;
			}
			default:
				break;
		}
		onKeyDownProps(event);
	}, [onKeyDownProps, triggerChangeEvent]);

	const onChange = useCallback(function onChange(event: ChangeEvent<HTMLInputElement>) {
		dispatch(new ComboboxActionSetValue(event.currentTarget.value));
		onChangeProps(event, event.currentTarget.value);
	}, [onChangeProps]);

	const onBlur = useCallback(function onBlur(event: FocusEvent<HTMLDivElement>) {
		const newFocusStillInCombobox = event.currentTarget.contains(event.relatedTarget);
		if (newFocusStillInCombobox) {
			cancelEvent(event);
			return;
		}

		dispatch(new ComboboxActionCloseList());
		const touched = setTouchedOnBlur(value);
		if (touched) {
			onTouchProps(touched);
		}
		onBlurProps(event);
	}, [setTouchedOnBlur, value, onBlurProps, onTouchProps]);

	const onFocus = useCallback(function onFocus(event: FocusEvent<HTMLDivElement>) {
		saveValueOnFocus(value);
		onFocusProps(event);
	}, [onFocusProps, saveValueOnFocus, value]);

	return (
		<ComboboxProvider value={{
			dispatch,
			filter,
			onOptionSelection,
			state: { ...state, value },
		}}>
			<div className={classNames(styles.combobox, className)} onBlur={onBlur} onFocus={onFocus}>
				<Input
					type="text"
					role="combobox"
					aria-expanded={open}
					aria-autocomplete="list"
					aria-activedescendant={activeDescendant}
					aria-controls={`${listboxId} ${ariaControls ?? ''}`}
					ref={inputRef}
					validation={validation}
					value={value}
					name={(valueName && name) || (name && `${name}.label`)}
					data-touched={touched}
					onChange={onChange}
					onKeyDown={onKeyDown}
					onInput={(event) => onInputProps(event, event.currentTarget.value)}
					required={required}
					{...inputProps} />
				<button
					onClick={() => {
						dispatch(new ComboboxActionToggleList());
						inputRef.current?.focus();
					}}
					type="button"
					disabled={inputProps.disabled || inputProps.readOnly}
					tabIndex={-1}
					aria-controls={listboxId}
					aria-expanded={open}
					aria-label={optionsAriaLabel}>
					<Icon name={'angle-down'} />
				</button>
				<ul
					role="listbox"
					id={listboxId}
					hidden={!open}
					ref={listboxRef}
					tabIndex={-1}
					aria-label={optionsAriaLabel}>
					{children}
				</ul>
				<Input
					type="hidden"
					name={valueName ?? (name && `${name}.value`)}
					value={matchingOptionValue}
					required={requireValidOption} />
			</div>
		</ComboboxProvider>
	);
});

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

function findOptionValueByLabel(node: React.ReactNode, label: string): string | undefined {
	let result: string | undefined;
	React.Children.forEach(node, (child) => {
		if (result) return;
		if (!React.isValidElement(child)) return;
		const textContent = extractTextContent(child.props.children);
		if (textContent === label && child.props.value !== undefined) {
			result = child.props.value?.toString();
		} else if (textContent === label && child.props.role !== 'status') {
			result = textContent;
		}
		if (!result && child.props.children) {
			result = findOptionValueByLabel(child.props.children, label);
		}
	});
	return result;
}
