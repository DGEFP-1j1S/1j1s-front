import React, { useMemo, useRef, useState } from 'react';
import { useRefinementList, UseRefinementListProps } from 'react-instantsearch';

import { KeyBoard } from '~/client/components/keyboard/keyboard.enum';

import { Champ } from '../../Form/Champ/Champ';
import { Combobox } from '../../Form/Combobox';

const MESSAGE_PAS_DE_RESULTAT = 'Aucune proposition ne correspond à votre saisie. Vérifiez que votre saisie correspond bien à un lieu. Exemple : Paris, Marseille …';
const NOMBRE_RESULTAT_MAXIMUM = 20;
const INPUT_VALUE_NAME = 'inputLocalisation';

export function MeilisearchComboboxLocalisation(props: UseRefinementListProps) {
	const { refine, items, searchForItems } = useRefinementList({ ...props, limit: NOMBRE_RESULTAT_MAXIMUM });
	const [userInput, setUserInput] = useState<string>('');
	const comboboxRef = useRef<HTMLInputElement>(null);

	const listeDeLocalisations = useMemo(
		() => items.filter(({ isRefined }) => !isRefined).map(({ value }) => value).slice(0, NOMBRE_RESULTAT_MAXIMUM),
		[items]);

	function rechercherLocalisations(saisie: string) {
		setUserInput(saisie);
		searchForItems(saisie);
	}

	function onOptionSelected(localisation: string) {
		refine(localisation);
		setUserInput('');
		searchForItems('');
	}

	function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key == KeyBoard.ENTER) {
			const activeDescendantId = comboboxRef.current?.getAttribute('aria-activedescendant');
			if (activeDescendantId) {
				const selectedElement = document.getElementById(activeDescendantId);
				if (selectedElement?.textContent) { onOptionSelected(selectedElement.textContent); };
			} else {
				const inputValue = document.querySelector<HTMLInputElement>(`input[name=${INPUT_VALUE_NAME}]`)?.value;
				if (inputValue) {
					onOptionSelected(inputValue);
				}
			}
		}
	}

	function onClickOnOption(event: React.MouseEvent<HTMLLIElement>) {
		if (event.currentTarget.textContent) { onOptionSelected(event.currentTarget.textContent); };
	}

	return (
		<Champ onKeyDown={onKeyDown}>
			<Champ.Label>
				Localisation
			</Champ.Label>
			<Champ.Input
				render={Combobox}
				ref={comboboxRef}
				valueName={INPUT_VALUE_NAME}
				requireValidOption
				optionsAriaLabel="villes"
				placeholder={'Exemples : Toulouse, Paris…'}
				value={userInput}
				autoComplete="off"
				filter={Combobox.noFilter}
				onChange={(_, newValue) => {
					rechercherLocalisations(newValue);
				}}>
				{listeDeLocalisations.map((suggestion) => (
					<Combobox.Option key={suggestion} onClick={onClickOnOption}>
						{suggestion}
					</Combobox.Option>
				))}
				<Combobox.AsyncMessage>{listeDeLocalisations.length === 0 && MESSAGE_PAS_DE_RESULTAT}</Combobox.AsyncMessage>
			</Champ.Input>
			<Champ.Error />
		</Champ>
	);
}
