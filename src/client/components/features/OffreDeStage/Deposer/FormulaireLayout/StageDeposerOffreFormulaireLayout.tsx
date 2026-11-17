import React, {
	FormEvent,
	RefObject,
} from 'react';

interface StageDeposerOffreFormulaireLayoutProps extends React.ComponentPropsWithoutRef<'form'>{
	inputsObligatoires: React.ReactElement
	inputsoptionnels: React.ReactElement
	formRef: RefObject<HTMLFormElement>
	handleFormSubmit: (event: FormEvent<HTMLFormElement>) => Promise<boolean | undefined>
	boutonValidation: React.ReactElement
}
export function StageDeposerOffreFormulaireLayout({ inputsObligatoires, inputsoptionnels, formRef, handleFormSubmit, boutonValidation, ...rest }: StageDeposerOffreFormulaireLayoutProps) {
	return (
		<form
			ref={formRef}
			className='border--blue fr-p-5v fr-p-md-5w'
			onSubmit={handleFormSubmit}
			{...rest}>
			<p className="fr-text--lg">Sauf mention contraire, tous les champs sont obligatoires.</p>
			<div className="fr-grid-row fr-grid-row--gutters">
				{inputsObligatoires}
			</div>
			<p className="fr-text--lg fr-mt-4w">Les champs suivants sont optionnels mais recommandés</p>
			<div className="fr-grid-row fr-grid-row--gutters">
				{inputsoptionnels}
			</div>
			<div className="text-align--right">
				{boutonValidation}
			</div>
		</form>
	);
}
