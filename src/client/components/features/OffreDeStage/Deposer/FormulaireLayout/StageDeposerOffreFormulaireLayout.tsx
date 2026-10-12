import React, {
	FormEvent,
	RefObject,
} from 'react';

interface StageDeposerOffreFormulaireLayoutProps extends React.ComponentPropsWithoutRef<'form'>{
	inputsObligatoires: React.ReactElement
	inputsFacultatifs: React.ReactElement
	formRef: RefObject<HTMLFormElement>
	handleFormSubmit: (event: FormEvent<HTMLFormElement>) => Promise<boolean | undefined>
	boutonValidation: React.ReactElement
}
export function StageDeposerOffreFormulaireLayout({ inputsObligatoires, inputsFacultatifs, formRef, handleFormSubmit, boutonValidation, ...rest }: StageDeposerOffreFormulaireLayoutProps) {
	return (
		<form
			ref={formRef}
			className='border--blue fr-p-5w'
			onSubmit={handleFormSubmit}
			{...rest}>
			<fieldset className="fr-fieldset">
				<legend className="fr-fieldset__legend fr-fieldset__legend--regular fr-text--lg">
					Les champs suivants sont obligatoires
				</legend>
				<div className="fr-fieldset__element">
					<div className="fr-grid-row fr-grid-row--gutters">
						{inputsObligatoires}
					</div>
				</div>
			</fieldset>
			<fieldset className="fr-fieldset fr-mt-4w">
				<legend className="fr-fieldset__legend fr-fieldset__legend--regular fr-text--lg">
				Les champs suivants sont facultatifs mais recommandés
				</legend>
				<div className="fr-fieldset__element">
					<div className="fr-grid-row fr-grid-row--gutters">
						{inputsFacultatifs}
					</div>
				</div>
			</fieldset>
			<div className="text-align--right">
				{boutonValidation}
			</div>
		</form>
	);
}
