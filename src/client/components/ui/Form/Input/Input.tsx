import classNames from 'classnames';
import React, { ComponentPropsWithoutRef, FocusEvent, useCallback, useEffect } from 'react';

import { ChangeEvent } from '~/client/components/ui/Form/Combobox/ChangeEvent';
import { useSynchronizedRef } from '~/client/hooks/useSynchronizedRef';
import { useTouchedInput } from '~/client/hooks/useTouchedInput';

import styles from './Input.module.scss';

type ErrorMessage = string;

type InputProps = ComponentPropsWithoutRef<'input'> & {
	validation?: (value: ComponentPropsWithoutRef<'input'>['value']) => ErrorMessage;
	onTouch?: (touched: boolean) => void,
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
	{
		className,
		validation = nullValidation,
		onChange: onChangeProps = doNothing,
		onFocus: onFocusProps = doNothing,
		onBlur: onBlurProps = doNothing,
		onTouch: onTouchProps = doNothing,
		...props
	}, outerRef) {
	const inputRef = useSynchronizedRef(outerRef);
	const { touched, saveValueOnFocus, setTouchedOnBlur } = useTouchedInput();

	useEffect(() => {
		const error = validation(inputRef.current?.value);
		inputRef.current?.setCustomValidity(error);
		if (touched) {
			inputRef.current?.checkValidity();
		}
	}, [inputRef, touched, validation]);

	const onChange = useCallback(function onChange(event: ChangeEvent<HTMLInputElement>) {
		const error = validation(event.currentTarget.value);
		event.currentTarget?.setCustomValidity(error);
		onChangeProps(event);

		if (touched) {
			inputRef.current?.checkValidity();
		}
	}, [inputRef, onChangeProps, touched, validation]);

	const onFocus = useCallback(function onFocus(event: FocusEvent<HTMLInputElement>) {
		saveValueOnFocus(event.currentTarget.value);
		onFocusProps(event);
	}, [onFocusProps, saveValueOnFocus]);

	const onBlur = useCallback(async function onFocus(event: FocusEvent<HTMLInputElement>) {
		const touched = setTouchedOnBlur(event.currentTarget.value);
		if (touched) {
			onTouchProps(touched);
		}
		onBlurProps(event);
	}, [onBlurProps, onTouchProps, setTouchedOnBlur]);

	return (
		<input
			data-touched={touched}
			ref={inputRef}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			className={classNames(styles.input, className)}
			{...props} />
	);
});


function doNothing() {
	return;
}

function nullValidation() {
	return '';
}
