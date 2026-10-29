import classNames from 'classnames';
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';

import { KeyBoard } from '../../../keyboard/keyboard.enum';
import { ButtonComponent } from '../../Button/ButtonComponent';
import { Icon } from '../../Icon/Icon';
import styles from './ChampIntervalle.module.scss';

interface ChampIntervalleProps extends Pick<React.HTMLAttributes<unknown>, 'className'> {
    label: string
    placeholder: string
    unite: string
    min: number
    max: number
    /** les bornes sont envoyées dans le formulaire sous les noms `${name}Min` et `${name}Max` */
    name: string
    valeurMinInitiale?: number
    valeurMaxInitiale?: number
		'data-testid'?: string // FIXME (SULI 29-03-2024): a été ajouté pour faire passer des tests car pas de CSS inclus dans le JSDOM
}

export function ChampIntervalle(props: ChampIntervalleProps) {
	const { label, placeholder, unite, min, max, className, name, valeurMinInitiale, valeurMaxInitiale } = props;
	const [isRangeBoxOpen, setIsRangeBoxOpen] = useState(false);
  type EmptyInput = '';
  const [minValue, setMinValue] = useState<number | EmptyInput>(valeurMinInitiale ?? '');
  const [maxValue, setMaxValue] = useState<number | EmptyInput>(valeurMaxInitiale ?? '');

  const rangeBoxRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const inputMinId = useId();
  const inputMaxId = useId();
  const BUTTON_LABEL = 'Appliquer';

  const closeRangeBoxOnClickOutside = useCallback((event: MouseEvent) => {
  	if (!(rangeBoxRef.current)?.contains(event.target as Node)) {
  		setIsRangeBoxOpen(false);
  	}
  }, []);

  const closeRangeBoxOnEscape = useCallback((event: KeyboardEvent) => {
  	if (event.key === KeyBoard.ESCAPE && isRangeBoxOpen) {
  		setIsRangeBoxOpen(false);
  	}
  }, [isRangeBoxOpen]);

  useEffect(function setEventListenerOnMount() {
  	// FIXME (GAFI 28-10-2024): À placer plutôt sur le onBlur du composant au global pour éviter le flicker
  	// 	quand on click sur le label
  	document.addEventListener('mousedown', closeRangeBoxOnClickOutside);
  	document.addEventListener('keyup', closeRangeBoxOnEscape);

  	return () => {
  		document.removeEventListener('mousedown', closeRangeBoxOnClickOutside);
  		document.removeEventListener('keyup', closeRangeBoxOnEscape);
  	};
  }, [closeRangeBoxOnClickOutside, closeRangeBoxOnEscape]);

  const onMaxInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  	const value = event.target.value;
  	if(!value) setMaxValue('');
  	else setMaxValue(Number(value));
  }, []);

  const onMinInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  	const value = event.target.value;
  	if(!value) setMinValue('');
  	else setMinValue(Number(value));
  }, []);

  // NOTE : les bornes ne sont appliquées qu‘à la soumission du formulaire ; « Appliquer » referme la saisie
  function fermerLaSaisie() {
  	setIsRangeBoxOpen(false);
  }

  const displayPlaceholder = () => {
  	if (minValue && !maxValue) return `A partir de ${minValue} ${unite}`;
  	if (!minValue && maxValue) return `Jusqu‘à ${maxValue} ${unite}`;
  	if (minValue && maxValue ) return `De ${minValue} ${unite} à ${maxValue} ${unite}`;
  	return placeholder;
  };

  const renderRangeBox = () => (
  	<fieldset className={styles.rangeBox}>
  		<label className={styles.label} htmlFor={inputMinId}>Minimum</label>
  		<span className={styles.customRangeInputWrapper}>
  			<input
  				id={inputMinId}
					className='fr-input'
  				type="number"
  				min={min}
  				max={max}
  				value={minValue}
  				onChange={onMinInputChange} />
  			<span>{unite}</span>
  		</span>
  		<label className={styles.label} htmlFor={inputMaxId}>Maximum</label>
  		<span className={classNames(styles.customRangeInputWrapper)}>
  			<input
  				id={inputMaxId}
					className='fr-input'
  				type="number"
  				min={min}
  				max={max}
  				value={maxValue}
  				onChange={onMaxInputChange} />
  			<span>{unite}</span>
  		</span>
  		<ButtonComponent type="button" label={BUTTON_LABEL} onClick={fermerLaSaisie} />
  	</fieldset>
  );

  return (
  	<div className={classNames(className)} data-testid={props['data-testid']}>
  		<label className={styles.label} htmlFor={buttonId}>{label}</label>
  		<div ref={rangeBoxRef} className={styles.selectContainer}>
  			<button
  				type="button"
  				aria-haspopup="listbox"
  				aria-expanded={isRangeBoxOpen}
  				id={buttonId}
  				className={styles.button}
  				onClick={() => setIsRangeBoxOpen(!isRangeBoxOpen)}>
  				<span>{displayPlaceholder()}</span>
  				<Icon name={isRangeBoxOpen ? 'angle-up' : 'angle-down'} />
  			</button>
  			{isRangeBoxOpen && renderRangeBox()}
  		</div>
  		{minValue !== '' && <input type="hidden" name={`${name}Min`} value={minValue} />}
  		{maxValue !== '' && <input type="hidden" name={`${name}Max`} value={maxValue} />}
  	</div>
  );
}


