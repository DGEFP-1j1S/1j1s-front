import { useRouter } from 'next/router';
import React, { FormEvent } from 'react';

import { BoutonsRecherche } from '~/client/components/ui/Form/BoutonsRecherche/BoutonsRecherche';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { Input } from '~/client/components/ui/Form/Input';
import { useFormationInitialeQuery } from '~/client/hooks/useFormationInitialeQuery';
import { useReinitialisationFormulaire } from '~/client/hooks/useReinitialisationFormulaire';
import { getFormAsQuery } from '~/client/utils/form.util';

export function FormulaireRechercheFormationInitiale() {
	const queryParams = useFormationInitialeQuery();
	const router = useRouter();
	const { cle, estReinitialise, reinitialiser, valeursInitiales } = useReinitialisationFormulaire(queryParams);

	async function submitForm(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQuery(event.currentTarget, queryParams);
		return router.push({ query }, undefined, { shallow: true });
	}


	return (
		<form
			role="search"
			className="border--blue fr-p-5w"
			onSubmit={submitForm}
		>
			<h2 className="fr-h4 fr-mb-5w">Trouvez une formation</h2>
			<div className="fr-grid-row fr-grid-row--gutters">
				<div className="fr-col-12" key={cle}>
					<Champ className="fr-input-group">
						<Champ.Label>Domaine, mot-clé…
							<Champ.Label.Complement>Exemples: boulanger, informatique</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input
							render={Input}
							key={valeursInitiales.motCle || ''}
							defaultValue={valeursInitiales.motCle || ''}
							name="motCle"
							autoFocus={!estReinitialise} />
						<Champ.Error />
					</Champ>
				</div>
				<div className="fr-m-auto fr-mt-4w">
					<BoutonsRecherche onReinitialiser={reinitialiser} />
				</div>
			</div>
		</form>
	);
}
