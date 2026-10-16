import { Combobox } from '~/client/components/ui/Form/Combobox';
import {
	formatLibelleLocalisation,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/localisations/formatLibelleLocalisation';
import {
	Localisations,
} from '~/client/components/ui/Form/Combobox/ComboboxLocalisation/localisations/localisations';

type LocalisationOptionsByCategoryProps = {
	localisations: Localisations
	optionMessage: string
}

export const LocalisationOptionsByCategory = ({ localisations, optionMessage }: LocalisationOptionsByCategoryProps) => (
	<>
		{localisations.regionList.length > 0 && (
			<Combobox.Category name="Régions">
				{localisations.regionList.map((suggestion) =>
					(
						<Combobox.Option key={suggestion.code}>
							{formatLibelleLocalisation(suggestion.nom, suggestion.code)}
						</Combobox.Option>
					))}
			</Combobox.Category>
		)}

		{localisations.departementList.length > 0 && (
			<Combobox.Category name="Départements">
				{localisations.departementList.map((suggestion) =>
					(
						<Combobox.Option key={suggestion.code}>
							{formatLibelleLocalisation(suggestion.nom, suggestion.code)}
						</Combobox.Option>
					))}
			</Combobox.Category>
		)}

		{localisations.communeList.length > 0 && (
			<Combobox.Category name="Communes">
				{localisations.communeList.map((suggestion) =>
					(
						<Combobox.Option key={suggestion.codeInsee}>
							{formatLibelleLocalisation(suggestion.nom, suggestion.codePostal)}
						</Combobox.Option>
					))}
			</Combobox.Category>
		)}
		<Combobox.AsyncMessage>
			{optionMessage}
		</Combobox.AsyncMessage>
	</>
);
