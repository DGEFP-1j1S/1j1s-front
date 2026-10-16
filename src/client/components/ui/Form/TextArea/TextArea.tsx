import classNames from 'classnames';
import React, { ComponentPropsWithoutRef, FocusEvent, useCallback, useEffect } from 'react';

import { useSynchronizedRef } from '~/client/hooks/useSynchronizedRef';
import { useTouchedInput } from '~/client/hooks/useTouchedInput';

import { ChangeEvent } from '../Combobox/ChangeEvent';
import styles from './TextArea.module.scss';


type ErrorMessage = string;

type TextAreaProps = ComponentPropsWithoutRef<'textarea'> & {
	validation?: (value: ComponentPropsWithoutRef<'textarea'>['value']) => ErrorMessage;
	onTouch?: (touched: boolean) => void,
};

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
	{
		className,
		validation = nullValidation,
		onChange: onChangeProps = doNothing,
		onFocus: onFocusProps = doNothing,
		onBlur: onBlurProps = doNothing,
		onTouch: onTouchProps = doNothing,
		...props
	}, refProps) {

	const ref = useSynchronizedRef(refProps);
	const { touched, saveValueOnFocus, setTouchedOnBlur } = useTouchedInput();

	useEffect(() => {
		const error = validation(ref.current?.value);
		ref.current?.setCustomValidity(error);
		if (touched) {
			ref.current?.checkValidity();
		}
	}, [ref, touched, validation]);

	const onChange = useCallback(function onChange(event: ChangeEvent<HTMLTextAreaElement>) {
		const error = validation(event.currentTarget.value);
		event.currentTarget?.setCustomValidity(error);
		onChangeProps(event);
		if (touched) {
			ref.current?.checkValidity();
		}
	}, [ref, onChangeProps, touched, validation]);

	const onFocus = useCallback(function onFocus(event: FocusEvent<HTMLTextAreaElement>) {
		saveValueOnFocus(event.currentTarget.value);
		onFocusProps(event);
	}, [onFocusProps, saveValueOnFocus]);

	const onBlur = useCallback(async function onFocus(event: FocusEvent<HTMLTextAreaElement>) {
		const touched = setTouchedOnBlur(event.currentTarget.value);
		if (touched) {
			onTouchProps(touched);
		}
		onBlurProps(event);
	}, [onBlurProps, onTouchProps, setTouchedOnBlur]);

	return (
		<textarea
			data-touched={touched}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			className={classNames(styles.textarea, className)}
			ref={ref}
			{...props} />
	);
});

function doNothing() {
	return;
}

function nullValidation() {
	return '';
}
