import { useRouter } from 'next/router';
import React, { FormEvent } from 'react';

import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { ChampFacette } from '~/client/components/ui/Form/ChampFacette/ChampFacette';
import { ChampIntervalle } from '~/client/components/ui/Form/ChampIntervalle/ChampIntervalle';
import { Input } from '~/client/components/ui/Form/Input';
import { Button } from '~/client/dsfr';
import { useAnnonceDeLogementQuery } from '~/client/hooks/useAnnonceDeLogementQuery';
import { getFormAsQueryAvecValeursRepetees } from '~/client/utils/form.util';
import { Facette } from '~/server/services/meilisearch/rechercheIndexee';

export const PRIX_MINIMUM = 0;
export const PRIX_MAXIMUM = 3000;
export const SURFACE_MINIMUM = 0;
export const SURFACE_MAXIMUM = 500;
export const DEVISE = '€';
export const UNITE_SURFACE = 'm²';

interface FormulaireRechercheAnnonceLogementProps {
	facettes: {
		typesOffre: Array<Facette>
		typesBien: Array<Facette>
	}
}

function toNumber(valeur?: string) {
	return valeur ? Number(valeur) : undefined;
}

export function FormulaireRechercheAnnonceLogement({ facettes }: FormulaireRechercheAnnonceLogementProps) {
	const router = useRouter();
	const queryParams = useAnnonceDeLogementQuery();

	function rechercher(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const query = getFormAsQueryAvecValeursRepetees(event.currentTarget, queryParams);
		router.push({ query }, undefined, { scroll: false });
	}

	return (
		<form
			className="border--blue fr-p-5w"
			role="search"
			aria-label="Rechercher un logement"
			onSubmit={rechercher}>
			<h2 className="fr-h4 fr-mb-3w">Trouvez un logement qui vous correspond</h2>
			<div className="fr-grid-row fr-grid-row--gutters">
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<Champ className="fr-input-group">
						<Champ.Label>
							Ville
							<Champ.Label.Complement>Exemples : Paris, Toulouse</Champ.Label.Complement>
						</Champ.Label>
						<Champ.Input render={Input} name="ville" defaultValue={queryParams.ville} />
						<Champ.Error />
					</Champ>
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<ChampFacette
						label="Type d‘offre"
						labelComplement="Exemple : Location"
						name="typesOffre"
						facettes={facettes.typesOffre}
						valeursInitiales={queryParams.typesOffre ?? []} />
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<ChampFacette
						label="Type de bien"
						labelComplement="Exemple : Appartement"
						name="typesBien"
						facettes={facettes.typesBien}
						valeursInitiales={queryParams.typesBien ?? []} />
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<ChampIntervalle
						name="surface"
						label="Surface (m²)"
						placeholder="Surface"
						unite={UNITE_SURFACE}
						min={SURFACE_MINIMUM}
						max={SURFACE_MAXIMUM}
						valeurMinInitiale={toNumber(queryParams.surfaceMin)}
						valeurMaxInitiale={toNumber(queryParams.surfaceMax)} />
				</div>
				<div className="fr-col-12 fr-col-md-6 fr-col-lg-4">
					<ChampIntervalle
						name="prix"
						label="Prix"
						placeholder="Fourchette de prix"
						unite={DEVISE}
						min={PRIX_MINIMUM}
						max={PRIX_MAXIMUM}
						valeurMinInitiale={toNumber(queryParams.prixMin)}
						valeurMaxInitiale={toNumber(queryParams.prixMax)} />
				</div>
			</div>
			<div className="fr-grid-row fr-grid-row--center fr-mt-4w">
				<Button className="fr-btn--lg" label="Rechercher" type="submit" />
			</div>
		</form>
	);
}
