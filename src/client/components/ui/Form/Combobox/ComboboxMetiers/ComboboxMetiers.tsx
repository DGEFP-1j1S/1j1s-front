import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { Metier } from '~/client/components/ui/Form/Combobox/ComboboxMetiers/Metier';
import { useMetierDependency } from '~/client/context/metier.context';
import { isSuccess } from '~/server/errors/either';

import { Combobox } from '..';
import styles from './ComboboxMetiers.module.scss';

type ComboboxProps = React.ComponentPropsWithoutRef<typeof Combobox>;
type ComboboxMetiersProps = Omit<ComboboxProps, 'defaultValue' | 'optionsAriaLabel'> & {
	label?: string,
	defaultValue?: Metier,
	debounceTimeout?: number,
}

const DEFAULT_DEBOUNCE_TIMEOUT = 300;

// NOTE (BRUJ 05/02/2024): 3 caractère min pour éviter d'avoir 9 000 métiers et des soucis de performance
const MINIMUM_CHARACTER_NUMBER_FOR_SEARCH = 3;
const MESSAGE_ERREUR_FETCH = 'Une erreur est survenue lors de la récupération des métiers. Veuillez réessayer plus tard.';
const MESSAGE_PAS_DE_RESULTAT
	= 'Aucune proposition ne correspond à votre saisie. Vérifiez que votre saisie correspond bien à un métier. Exemple : boulanger, …';
const MESSAGE_CHARGEMENT = 'Chargement…';
const MESSAGE_CHAMP_CARACTERE_MIN = 'Commencez à saisir au moins 3 caractères';
const DEFAULT_LABEL = 'Domaine';

function MetiersTrouves({ quantity }: { quantity: number }) {
	return (
		<small className={styles.nombreResultats}>{
			quantity > 1
				? `${quantity} métiers trouvés`
				: `${quantity} métier trouvé`
		}</small>
	);
}

type FetchStatus = 'init' | 'pending' | 'success' | 'failure';
type ComboboxRef = React.ComponentRef<typeof Combobox>;
export const ComboboxMetiers = React.forwardRef<ComboboxRef, ComboboxMetiersProps>(function ComboboxMetiers(props, ref) {
	const {
		label = DEFAULT_LABEL,
		defaultValue,
		onChange: onChangeProps = () => null,
		debounceTimeout = DEFAULT_DEBOUNCE_TIMEOUT,
		...comboboxProps
	} = props;

	const metierRechercheService = useMetierDependency('metierService');

	function isInputValueLengthValid(inputValue: string) {
		return inputValue.length >= MINIMUM_CHARACTER_NUMBER_FOR_SEARCH;
	}

	const [metiers, setMetiers] = useState<Metier[]>(defaultValue ? [defaultValue] : []);
	const [status, setStatus] = useState<FetchStatus>('init');
	const [value, setValue] = useState(defaultValue?.label ?? '');


	const getMetiersCall = useMemo(() => {
		return async function (motCle: string) {
			const response = await metierRechercheService.rechercherMetier(motCle);

			if (response && isSuccess(response)) {
				setStatus('success');
				setMetiers(response.result);
			} else {
				setStatus('failure');
			}
		};
	}, [metierRechercheService]);

	const handleRechercherWithDebounce = useMemo(() => {
		return debounce(getMetiersCall, debounceTimeout);
	}, [debounceTimeout, getMetiersCall]);

	useEffect(() => {
		return () => {
			handleRechercherWithDebounce.cancel();
		};
	}, [handleRechercherWithDebounce]);

	const getMetiersDebounced = useCallback(async function getMetiers(motCle: string) {
		if (!isInputValueLengthValid(motCle)) {
			handleRechercherWithDebounce.cancel();
			setMetiers([]);
			return;
		}
		setStatus('pending');
		handleRechercherWithDebounce(motCle);
	}, [handleRechercherWithDebounce]);

	return (
		<Champ>
			<Champ.Label>
				{label}
				<Champ.Label.Complement>Exemples : boulangerie, enseignement</Champ.Label.Complement>
			</Champ.Label>
			<Champ.Input
				render={Combobox}
				ref={ref}
				filter={Combobox.noFilter}
				optionsAriaLabel="métiers"
				autoComplete="off"
				valueName={comboboxProps.valueName || 'codeMetier'}
				name={comboboxProps.name || 'libelleMetier'}
				onChange={(event, newValue) => {
					getMetiersDebounced(newValue);
					setValue(newValue);
					onChangeProps(event, newValue);
				}}
				value={value}
				requireValidOption
				{...comboboxProps}>
				{
					(metiers.map((suggestion) => (
						<Combobox.Option key={suggestion.label} value={suggestion.code}>{suggestion.label}</Combobox.Option>
					)))
				}
				<Combobox.AsyncMessage>
					{
						!isInputValueLengthValid(value) && MESSAGE_CHAMP_CARACTERE_MIN
						|| status === 'failure' && MESSAGE_ERREUR_FETCH
						|| status === 'pending' && MESSAGE_CHARGEMENT
						|| metiers.length === 0 && MESSAGE_PAS_DE_RESULTAT
						|| <MetiersTrouves quantity={metiers.length} />
					}
				</Combobox.AsyncMessage>
			</Champ.Input>
			<Champ.Error />
		</Champ>
	);
});
