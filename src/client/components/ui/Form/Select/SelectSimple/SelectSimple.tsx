import React, {
	ChangeEvent,
	ComponentPropsWithoutRef,
	FocusEvent,
	useCallback,
	useMemo,
	useState,
} from 'react';

import { useTouchedInput } from '~/client/hooks/useTouchedInput';
import { useSynchronizedRef } from "~/client/hooks/useSynchronizedRef";

const DEFAULT_PLACEHOLDER = 'Sélectionnez votre choix';

interface Option {
	libellé: string;
	valeur: string;
}

type ErrorMessage = string;

type Value = string;

type SelectSimpleProps = Omit<React.ComponentPropsWithoutRef<'select'>, 'onChange' | 'value'> & {
	value?: Value;
	onChange?: (e: Value) => void;
	onTouch?: (touched: boolean) => void;
	defaultValue?: string;
	placeholder?: string,
	optionsList: Option[];
	validation?: (value: ComponentPropsWithoutRef<'select'>['value']) => ErrorMessage;
}

export const SelectSimple = React.forwardRef<HTMLSelectElement, SelectSimpleProps>(function SelectSimple({
	optionsList,
	children,
	value: valueProps,
	placeholder: placeholderProps,
	name,
	onChange: onChangeProps = doNothing,
	onFocus: onFocusProps,
	onBlur: onBlurProps,
	onTouch,
	defaultValue,
	required,
	validation = nullValidation,
	...rest
	}, outerRef) {
	const selectRef = useSynchronizedRef(outerRef);

	const { saveValueOnFocus, setTouchedOnBlur, touched } = useTouchedInput();

	const [internalValue, setInternalValue] = useState(defaultValue ?? '');
	const value = valueProps ?? internalValue;
	const placeholder = useDisplayName(value, children, placeholderProps);

	const selectOption = useCallback(function selectOption(event: ChangeEvent<HTMLSelectElement>) {
		const error = validation(event.currentTarget.value);
		event.currentTarget?.setCustomValidity(error);
		setInternalValue(event.target.value);
		onChangeProps(event.target.value.toString())
	}, [onChangeProps, validation]);

	const onFocus = useCallback(function onFocus(event: FocusEvent<HTMLSelectElement>) {
		saveValueOnFocus(event.currentTarget.value);
		onFocusProps?.(event);
	}, [onFocusProps, saveValueOnFocus]);

	const onBlur = useCallback(function onBlur(event: FocusEvent<HTMLSelectElement>) {
		const hasBecomeTouched = setTouchedOnBlur(event.currentTarget.value);
		if (hasBecomeTouched) {
			onTouch?.(true);
		}
		onBlurProps?.(event);
	}, [onBlurProps, onTouch, setTouchedOnBlur]);

	return (
		<select
			className="fr-select"
			name={name}
			required={required}
			value={value}
			data-touched={touched}
			ref={selectRef}
			onChange={selectOption}
			onFocus={onFocus}
			onBlur={onBlur}
			{...rest}
		>
			<option value="" disabled>{placeholder}</option>
			{optionsList.map((option) => (
				<option key={option.valeur} value={option.valeur}>{option.libellé}</option>
			))}
		</select>
	);
})

function nullValidation() {
	return '';
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
