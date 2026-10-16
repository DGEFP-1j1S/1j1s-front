import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';

import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { Combobox } from '~/client/components/ui/Form/Combobox';
import {
	buildUserInput,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/defaultLocalisation/buildUserInput';
import {
	DefaultLocalisation,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/defaultLocalisation/defaultLocalisation';
import {
	LocalisationOptionsByCategory,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/LocalisationOptionsByCategory';
import {
	findMatchingLocalisation,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/localisations/findMatchingLocalisation';
import { Localisations } from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/localisations/localisations';
import {
	mapToLocalisations,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/localisations/mapToLocalisations';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { LocalisationService } from '~/client/services/localisation/localisation.service';
import { isSuccess } from '~/server/errors/either';
import { TypeLocalisation } from '~/server/localisations/domain/localisation';

const MESSAGE_ERREUR_FETCH = 'Une erreur est survenue lors de la récupération des lieux. Veuillez réessayer plus tard.';
const MESSAGE_PAS_DE_RESULTAT = 'Aucune proposition ne correspond à votre saisie. Vérifiez que votre saisie correspond bien à un lieu. Exemple : Paris, ...';
const MESSAGE_CHARGEMENT = 'Chargement ...';
const MESSAGE_CHAMP_VIDE = 'Commencez à saisir au moins 3 caractères, 2 chiffres d’un département ou les 5 chiffres d’une commune, puis sélectionnez votre localisation';
const DEFAULT_LABEL = 'Localisation';
const DEFAULT_LABEL_COMPLEMENT = 'Exemples : Paris, Béziers…';

type ComboboxProps = React.ComponentPropsWithoutRef<typeof Combobox>;
type ComboboxRef = React.ComponentRef<typeof Combobox>;

type ComboboxPropsWithOmit = Omit<ComboboxProps, 'defaultValue' | 'optionsAriaLabel'>
type ComboboxLocalisationProps = ComboboxPropsWithOmit & {
	label?: string,
	labelComplement?: string,
	defaultValue?: DefaultLocalisation | undefined,
	debounceTimeout?: number,
}
type FetchStatus = 'init' | 'pending' | 'success' | 'failure';

export const ComboboxLocalisation = React.forwardRef<ComboboxRef, ComboboxLocalisationProps>(function ComboboxLocalisation(props, ref) {
	const {
		label = DEFAULT_LABEL,
		labelComplement = DEFAULT_LABEL_COMPLEMENT,
		defaultValue,
		onChange: onChangeProps = () => null,
		debounceTimeout = 300,
		id: idProps,
		...rest
	} = props;

	const localisationService = useDependency<LocalisationService>('localisationService');

	const [userInput, setUserInput] = useState<string>(buildUserInput(defaultValue));
	const [localisationOptions, setLocalisationOptions] = useState<Localisations>({
		communeList: defaultValue?.type === TypeLocalisation.COMMUNE ? [defaultValue] : [],
		departementList: defaultValue?.type === TypeLocalisation.DEPARTEMENT ? [defaultValue] : [],
		regionList: defaultValue?.type === TypeLocalisation.REGION ? [defaultValue] : [],
	});
	const [status, setStatus] = useState<FetchStatus>('init');

	const matchingOption = findMatchingLocalisation(localisationOptions, userInput);

	const idState = useId();
	const inputId = idProps ?? idState;

	const isSuggestionListEmpty = useCallback(() => {
		return !localisationOptions.departementList.length && !localisationOptions.regionList.length && !localisationOptions.communeList.length;
	}, [localisationOptions]);

	const optionMessage: string =
		localisationService.isInvalidLocalisationQuery(userInput) && MESSAGE_CHAMP_VIDE
			|| status === 'failure' && MESSAGE_ERREUR_FETCH
			|| status === 'pending' && MESSAGE_CHARGEMENT
			|| isSuggestionListEmpty() && MESSAGE_PAS_DE_RESULTAT
			|| '';

	const rechercherLocalisation = useCallback(async (userInput: string) => {
		const response = await localisationService.rechercherLocalisation(userInput);

		if (response && isSuccess(response)) {
			setStatus('success');
			setLocalisationOptions(mapToLocalisations(response.result));
		} else {
			setStatus('failure');
			setLocalisationOptions({ communeList: [], departementList: [], regionList: [] });
		}
	}, [localisationService]);

	const handleRechercherWithDebounce = useMemo(() => {
		return debounce(rechercherLocalisation, debounceTimeout);
	}, [rechercherLocalisation, debounceTimeout]);

	const getLocalisationDebounced = useCallback(async function (userInput: string) {
		if (localisationService.isInvalidLocalisationQuery(userInput)) {
			setLocalisationOptions({ communeList: [], departementList: [], regionList: [] });
			return;
		}
		setStatus('pending');

		handleRechercherWithDebounce(userInput);
	}, [handleRechercherWithDebounce, localisationService]);

	useEffect(() => {
		return () => {
			handleRechercherWithDebounce.cancel();
		};
	}, [handleRechercherWithDebounce]);

	return (
		<Champ>
			<Champ.Label>
				{label}
				<Champ.Label.Complement>{labelComplement}</Champ.Label.Complement>
			</Champ.Label>
			<Champ.Input
				render={Combobox}
				ref={ref}
				autoComplete="off"
				optionsAriaLabel="localisations"
				id={inputId}
				value={userInput}
				onChange={
					(event, newUserInput) => {
						getLocalisationDebounced(newUserInput);
						setUserInput(newUserInput);
						onChangeProps(event, newUserInput);
					}
				}
				requireValidOption
				filter={Combobox.noFilter}
				{...rest}>
				<LocalisationOptionsByCategory localisations={localisationOptions} optionMessage={optionMessage} />
			</Champ.Input>
			<Champ.Error />
			<input type="hidden" value={matchingOption?.nom ?? ''} name="nomLocalisation" />
			<input type="hidden" value={matchingOption?.codePostal ?? ''} name="codePostalLocalisation" />
			<input type="hidden" value={matchingOption?.code ?? ''} name="codeLocalisation" />
			<input type="hidden" value={matchingOption?.type ?? ''} name="typeLocalisation" />
		</Champ>
	);
});
