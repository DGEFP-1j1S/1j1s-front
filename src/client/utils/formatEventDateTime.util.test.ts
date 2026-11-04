import { formatEventDateTime } from '~/client/utils/formatEventDateTime.util';

describe('formatEventDateTime', () => {
	describe('quand la date de début et de fin sont identiques', () => {
		it('retourne la même date avec les heures correspondantes, à l‘heure de Paris', () => {
			const dateDebut = '2022-12-01T19:00:00.000Z';
			const dateFin = '2022-12-01T21:00:00.000Z';
			const expected = 'jeu. 1 décembre de 20:00 à 22:00';

			const actual = formatEventDateTime(dateDebut, dateFin);
			expect(actual).toEqual(expected);
		});
	});

	describe('quand la date de début et de fin sont différentes', () => {
		it('retourne les dates formatées avec les heures', () => {
			const dateDebut = '2022-12-01T08:00:00.000Z';
			const dateFin = '2022-12-02T17:00:00.000Z';
			const expected = 'jeu. 1 décembre à 09:00 - ven. 2 décembre à 18:00';

			const actual = formatEventDateTime(dateDebut, dateFin);
			expect(actual).toEqual(expected);
		});
	});

	describe('quand les heures sont à 00:00 à Paris', () => {
		it('retourne la date sans les heures', () => {
			const dateDebut = '2022-12-01T23:00:00.000Z';
			const dateFin = '2022-12-02T23:00:00.000Z';
			const expected = 'ven. 2 décembre - sam. 3 décembre';

			const actual = formatEventDateTime(dateDebut, dateFin);
			expect(actual).toEqual(expected);
		});
	});

	it('utilise l‘heure de Paris pour savoir si les deux dates sont le même jour', () => {
		// 23h30 et 00h30 à Paris : deux jours différents, alors que c‘est le même jour en UTC
		const dateDebut = '2022-12-01T22:30:00.000Z';
		const dateFin = '2022-12-01T23:30:00.000Z';
		const expected = 'jeu. 1 décembre à 23:30 - ven. 2 décembre à 00:30';

		const actual = formatEventDateTime(dateDebut, dateFin);
		expect(actual).toEqual(expected);
	});
});
