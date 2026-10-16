import classNames from 'classnames';
import React, { ComponentPropsWithoutRef, useCallback, useEffect, useId, useState } from 'react';

import { Error } from '~/client/components/ui/Form/Error';
import { Hint } from '~/client/components/ui/Form/Hint';
import { Label } from '~/client/components/ui/Form/Label';

import styles from './Champ.module.scss';
import { ChampContextProvider, useChampContext } from './ChampContext';

export function Champ(props: ComponentPropsWithoutRef<'div'>) {
	const [errorId, setErrorId] = useState<string>(useId());
	const [hintId, setHintId] = useState<string>(useId());
	const [inputId, setInputId] = useState<string>(useId());
	const [errorMessage, setErrorMessage] = useState<string>('');
	const { className: classNameProps, ...otherProps } = props;

	return (
		<ChampContextProvider value={{
			errorId,
			errorMessage,
			hintId,
			inputId,
			setErrorId,
			setErrorMessage,
			setHintId,
			setInputId,
		}}>
			<div className={classNames(styles.champ, classNameProps)} {...otherProps} />
		</ChampContextProvider>
	);
}

type InputChampProps<Props extends ComponentChildrenPropsNecessary> = Props extends {
	render: unknown
} ? never : Props & {
	render: React.ComponentType<Props>
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChangeFunction = (event: any & { currentTarget: { validationMessage: string; }}, ...args: any[]) => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TouchFunction = (touched: boolean, ...args: any[]) => void;
type ComponentChildrenPropsNecessary = {
	onChange?: ChangeFunction
	onInvalid?: ChangeFunction
	onTouch?: TouchFunction
	'aria-describedby'?: string
	id?: string
}

export const InputChamp: <Props extends ComponentChildrenPropsNecessary>(props: InputChampProps<Props>) => React.ReactNode = React.forwardRef(
	function InputChamp<Props extends ComponentChildrenPropsNecessary>(
		{
			'aria-describedby': ariaDescribedby = '',
			id,
			onChange: onChangeProps = doNothing,
			onInvalid: onInvalidProps = doNothing,
			onTouch: onTouchProps = doNothing,
			render: Render,
			...rest
		}: InputChampProps<Props>, outerRef: React.ForwardedRef<HTMLInputElement>) {
		const { errorId, hintId, inputId, setInputId, setErrorMessage, errorMessage } = useChampContext();

		useEffect(() => {
			if (id) { setInputId(id); }
		}, [id, setInputId]);

		const onChange = useCallback<ChangeFunction>((event, ...args) => {
			setErrorMessage('');
			onChangeProps(event, ...args);
		}, [onChangeProps, setErrorMessage]);

		const onTouch = useCallback<TouchFunction>((touched, ...args) => {
			onTouchProps(touched, ...args);
		}, [onTouchProps]);

		const onInvalid = useCallback<ChangeFunction>((event, ...args) => {
			setErrorMessage(event.currentTarget.validationMessage);
			onInvalidProps(event, ...args);
		}, [onInvalidProps, setErrorMessage]);

		return (
			<Render
				onTouch={onTouch}
				aria-describedby={`${ariaDescribedby} ${errorMessage ? errorId : ''} ${hintId}`}
				aria-invalid={errorMessage !== ''}
				id={inputId}
				onInvalid={onInvalid}
				onChange={onChange}
				ref={outerRef}
				{...rest} />
		);
	});

function ErrorChamp({ id, ...rest }: Omit<ComponentPropsWithoutRef<typeof Error>, 'children'>) {
	const { errorId, setErrorId, errorMessage } = useChampContext();

	useEffect(() => {
		if (id) { setErrorId(id); }
	}, [id, setErrorId]);

	return (errorMessage && <Error id={id ?? errorId} {...rest}>{errorMessage}</Error>);
}

function HintChamp({ id, ...rest }: ComponentPropsWithoutRef<typeof Hint>) {
	const { hintId, setHintId } = useChampContext();

	useEffect(() => {
		if (id) { setHintId(id); }
	}, [id, setHintId]);

	return (<Hint id={id ?? hintId} {...rest} />);
}

function LabelChamp(props: ComponentPropsWithoutRef<typeof Label>) {
	const { inputId } = useChampContext();
	return <Label htmlFor={inputId} {...props} />;
}

Champ.Input = InputChamp;
Champ.Label = Object.assign(LabelChamp, Label);
Champ.Error = ErrorChamp;
Champ.Hint = HintChamp;

function doNothing() {
	return;
}
