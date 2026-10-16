import { GénérerRobotsUseCase } from '~/server/robots/useCases/générerRobots.useCase';

describe('GénérerRobotsUseCase', () => {
	describe('quand l’environnement est "production"', () => {
		it('retourne le contenu de robots.txt de production',  async() => {
			const environment = 'production';
			const générerRobotsUseCase = new GénérerRobotsUseCase(environment);
			const expected = 'User-agent: *\n' +
				'Allow: /\n' +
				'Allow: /emplois/\n' +
				'\n' +
				'User-agent: *\n' +
				'Disallow: /benevolat/\n' +
				'Disallow: /emplois-europe/\n' +
				'Disallow: /jobs-etudiants/\n' +
				'Disallow: /logements/annonces/\n' +
				'Disallow: /service-civique/\n' +
				'Disallow: /stages/';

			const result = await générerRobotsUseCase.handle();

			expect(result).toEqual(expected);
		});
	});

	describe('quand l’environnement n’est pas "production"', () => {
		it('retourne le contenu de robots.txt de pas production',  async() => {
			const environment = 'recette';
			const générerRobotsUseCase = new GénérerRobotsUseCase(environment);
			const expected = 'User-agent: *\n' +
				'Disallow: /';

			const result = await générerRobotsUseCase.handle();

			expect(result).toEqual(expected);
		});
	});
});
