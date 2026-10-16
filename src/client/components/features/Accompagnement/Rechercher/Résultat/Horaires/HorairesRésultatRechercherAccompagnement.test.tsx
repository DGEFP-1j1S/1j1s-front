import { render, screen } from '@testing-library/react';

import {
	HorairesResultatRechercherAccompagnement,
} from '~/client/components/features/Accompagnement/Rechercher/Résultat/Horaires/HorairesResultatRechercherAccompagnement';
import {
	EtablissementAccompagnementHoraire,
	JourSemaine,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

describe('HorairesResultatRechercherAccompagnement', () => {
	describe('quand heures est undefined ou un tableau vide', () => {
		it('affiche "Fermé"', () => {
			const horaire: EtablissementAccompagnementHoraire = {
				heures: [],
				jour: JourSemaine.LUNDI,
			};
      
			render(
				<output name="result">
					<HorairesResultatRechercherAccompagnement horaire={horaire} />
				</output>,
			);

			const status = screen.getByRole('status');

			expect(status).toHaveTextContent('Lundi : Fermé');
		});
	});

	describe('quand heures contient qu‘une seule plage horaire', () => {
		it('affiche la plage d‘ouverture', () => {
			const horaire: EtablissementAccompagnementHoraire = {
				heures: [
					{
						début: '14:00:00',
						fin: '19:00:00',
					},
				],
				jour: JourSemaine.MARDI,
			};

			render(
				<output name="result">
					<HorairesResultatRechercherAccompagnement horaire={horaire} />
				</output>,
			);

			const status = screen.getByRole('status');

			expect(status).toHaveTextContent('Mardi : 14h - 19h');
		});
	});

	describe('quand heures contient plusieurs plages horaires', () => {
		it('affiche les différentes plages d‘ouverture', () => {
			const horaire: EtablissementAccompagnementHoraire = {
				heures: [
					{
						début: '10:30:00',
						fin: '13:00:00',
					},
					{
						début: '14:00:00',
						fin: '19:00:00',
					},
				],
				jour: JourSemaine.VENDREDI,
			};

			render(
				<output name="result">
					<HorairesResultatRechercherAccompagnement horaire={horaire} />
				</output>,
			);

			const status = screen.getByRole('status');

			expect(status).toHaveTextContent('Vendredi : 10h30 - 13h et 14h - 19h');
		});
	});
});
