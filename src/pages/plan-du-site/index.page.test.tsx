import { render, screen, within } from '@testing-library/react';

import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import PlanDuSite from '~/pages/plan-du-site/index.page';

describe('Plan du site', () => {
	describe('quand toutes les features sont activées', () => {
		beforeEach(() => {
			process.env.NEXT_PUBLIC_FORMATIONS_INITIALES_FEATURE = '1';
			process.env.NEXT_PUBLIC_EMPLOIS_EUROPE_FEATURE = '1';
			process.env.NEXT_PUBLIC_STAGES_3EME_FEATURE = '1';
			process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '0';
			process.env.NEXT_PUBLIC_1JEUNE1PERMIS_FEATURE = '1';
		});

		it.each`
		nom                                                       | path
		${'Accueil'}                                              | ${'/'}
		
		${'Emplois'}                                              | ${'/emplois'}
		${'Stages d’études'}                                      | ${'/stages'}
		${'Stages de 3e et 2de'}                                	| ${'/stages-3e-et-2de'}
		${'Contrats d’alternance'}                                | ${'https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution?utm_source=1j1s&utm_medium=website&utm_campaign=landinglba1j1s'}
		${'Jobs d‘été'}                                           | ${'/jobs-ete'}
		${'Jobs étudiants'}                                       | ${'/jobs-etudiants'}
		${'Emplois en Europe'}                                    | ${'/emplois-europe'}
		${'Découvrir les services jeunes liés aux offres'}        | ${'/services-jeunes?filtre=vieProfessionnelle'}
		
		${'Formations initiales'}                                 | ${'/formations-initiales'}
		${'Formations en apprentissage'}                          | ${'/formations/apprentissage'}
		${'Découvrir les métiers'}                                | ${'/decouvrir-les-metiers'}
		${'Participer à des évènements'}                          | ${'/evenements'}
		${'Découvrir et trouver sa voie avec l’apprentissage'}    | ${'https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution?utm_source=1j1s&utm_medium=website&utm_campaign=landinglba1j1s'}
		${'Découvrir les services jeunes liés aux formations et à l’orientation'}   | ${'/services-jeunes?filtre=orienterFormer'}
		
		${'Bénévolat'}                                            | ${'/benevolat'}
		${'Service civique'}                                      | ${'/service-civique'}
		${'Découvrir les services jeunes liés à l’engagement civique'}        			| ${'/services-jeunes?filtre=engagement'}
		
		${'Annonces'}                                             | ${'/logements/annonces'}
		${'Aides financières au logement'}                        | ${'/logements/aides-logement'}
		${'Découvrir tous nos conseils'}                      	  | ${'/logements/conseils'}
		${'Découvrir les services jeunes liés au logement'}       | ${'/services-jeunes?filtre=logement'}
		
		${'Contrat Engagement Jeune'}                             | ${'/contrat-engagement-jeune'}
		${'Echanger avec un mentor'}                              | ${'/mentorat'}
		${'Trouver une structure d’accompagnement'}               | ${'/accompagnement'}
		${'Entreprendre : financements, aides et accompagnement'} | ${'/entreprendre'}
		${'Expérience en Europe'}                                 | ${'/experience-europe'}
		${'Découvrir les services jeunes liés à l’accompagnement'}      						| ${'/services-jeunes?filtre=accompagnement'}
		
		${'Simulateur d’aides financières'}                       | ${'/mes-aides'}
		${'Aides au permis de conduire'}	           	            | ${'/1jeune1permis'}
		${'Créer son CV personnalisé'}                            | ${'/creer-mon-cv'}
		${'Découvrir les services jeunes liés aux aides financières'}      					| ${'/services-jeunes?filtre=aidesFinancieres'}
		
		${'Rejoindre la mobilisation'}                            | ${'/les-entreprises-s-engagent'}
		${'Je recrute'}                                           | ${'/je-recrute'}
		${'Je deviens mentor'}                                    | ${'/je-deviens-mentor'}
		${'Je propose des immersions'}                            | ${'/immersions'}
		${'Je forme les jeunes grâce à l‘emploi'}                 | ${'/je-recrute-afpr-poei'}
		${'Je recrute un apprenti'} 							                | ${'https://labonnealternance.apprentissage.beta.gouv.fr/1jeune1solution-recruteurs?utm_source=1j1s&utm_medium=website&utm_campaign=recruteurs_landinglba1j1s'}
		${'Découvrir les mesures employeurs'}                     | ${'/mesures-employeurs'}
		${'Accéder à mon espace'}                                 | ${'/mon-espace'}
		
		${'Services Jeunes'}                  					          | ${'/services-jeunes'}
		${'Foire aux questions'}                 								  | ${'/faq'}
		${'Conditions Générales d’utilisation'}                   | ${'/cgu'}
		${'Accessibilité : Partiellement conforme'}               | ${'/accessibilite'}
		${'Mentions légales'}                                     | ${'/mentions-legales'}
		${'Politique de confidentialité'}                         | ${'/confidentialite'}`(
			'présente la page $nom du site',
			async ({ nom, path }) => {
				const analyticsService = aManualAnalyticsService();

				render(
					<DependenciesProvider
						analyticsService={analyticsService}>
						<PlanDuSite />
					</DependenciesProvider>,
				);

				const plan = screen.getByRole('list', { name: /Plan du site/i });
				const lien = within(plan).getByRole('link', { name: nom });
				expect(lien).toBeVisible();
				expect(lien).toHaveAttribute('href', path);
			});
	});

	describe('quand il y a des features désactivées, elles ne sont pas contenues dans le plan du site', () => {
		beforeEach(() => {
			process.env.NEXT_PUBLIC_FORMATIONS_INITIALES_FEATURE = '0';
			process.env.NEXT_PUBLIC_EMPLOIS_EUROPE_FEATURE = '0';
			process.env.NEXT_PUBLIC_STAGES_3EME_FEATURE = '0';
			process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE = '1';
			process.env.NEXT_PUBLIC_1JEUNE1PERMIS_FEATURE = '0';
		});

		it.each`
		nom                                                       | path
		${'Stages de 3e et 2de'}                                	| ${'/stages-3e-et-2de'}
		${'Emplois en Europe'}                                    | ${'/emplois-europe'}
		${'Formations initiales'}                                 | ${'/formations-initiales'}
		${'Aides au permis de conduire'}	           	            | ${'/1jeune1permis'}
		${'Découvrir les services jeunes liés aux offres'}        | ${'/services-jeunes?filtre=vieProfessionnelle'}
		${'Découvrir les services jeunes liés aux formations et à l’orientation'}   | ${'/services-jeunes?filtre=orienterFormer'}
		${'Découvrir les services jeunes liés à l’engagement civique'}        			| ${'/services-jeunes?filtre=engagement'}
		${'Découvrir les services jeunes liés au logement'}       | ${'/services-jeunes?filtre=logement'}
		${'Découvrir les services jeunes liés à l’accompagnement'}      						| ${'/services-jeunes?filtre=accompagnement'}
		${'Découvrir les services jeunes liés aux aides financières'}      					| ${'/services-jeunes?filtre=aidesFinancieres'}`
		('La page $nom n’est pas présente', async ({ nom }) => {
			const analyticsService = aManualAnalyticsService();

			render(
				<DependenciesProvider
					analyticsService={analyticsService}>
					<PlanDuSite />
				</DependenciesProvider>,
			);

			const plan = screen.getByRole('list', { name: /Plan du site/i });
			const lien = within(plan).queryByRole('link', { name: nom });
			expect(lien).not.toBeInTheDocument();
		});
	});

	it('envoie les analytics de la page à son affichage', () => {
		const analyticsService = aManualAnalyticsService();

		render(
			<DependenciesProvider
				analyticsService={analyticsService}>
				<PlanDuSite />
			</DependenciesProvider>,
		);

		expect(analyticsService.envoyerAnalyticsPageVue).toHaveBeenCalledWith({
			page_template: 'contenu_statique',
			pagegroup: 'contenu_statique',
			pagelabel: 'contenu_statique',
			'segment-site': 'page_de_base',
		});
	});
});
