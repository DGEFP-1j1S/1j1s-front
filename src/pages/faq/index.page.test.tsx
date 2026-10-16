import '~/test-utils';

import {
	render,
	screen,
	within,
} from '@testing-library/react';

import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aManualAnalyticsService } from '~/client/services/analytics/analytics.service.fixture';
import FaqPage from '~/pages/faq/index.page';
import { FAQQuestion } from '~/server/faq/domain/FAQ';
import { aQuestion } from '~/server/faq/domain/FAQ.fixture';

const listeDeQuestionResultat: Array<FAQQuestion> = [
	aQuestion({
		problématique: 'Comment constituer un dossier locatif ?',
		slug: 'Comment-constituer-un-dossier-locatif-?',
	}),
	aQuestion({
		problématique: 'Je n’arrive pas à candidater à une offre d’emploi',
		slug: 'Je-n’arrive-pas-à-candidater-à-une-offre-d’emploi',
	}),
];

describe('Page FAQ', () => {
	beforeEach(() => {
		mockSmallScreen();
		mockUseRouter({});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});
	it('doit rendre du HTML respectant la specification', () => {
		const { container } = render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<FaqPage listeDeQuestionRéponse={listeDeQuestionResultat} />
			</DependenciesProvider>);

		expect(container.outerHTML).toHTMLValidate();
	});

	it('n‘a pas de défaut d‘accessibilité', async () => {
		const analyticsService = aManualAnalyticsService();

		const { container } = render(
			<DependenciesProvider analyticsService={analyticsService}>
				<FaqPage listeDeQuestionRéponse={listeDeQuestionResultat} />
			</DependenciesProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it('envoie les analytics de la page à son affichage', async () => {
		const analyticsService = aManualAnalyticsService();
		render(
			<DependenciesProvider analyticsService={analyticsService}>
				<FaqPage listeDeQuestionRéponse={listeDeQuestionResultat} />
			</DependenciesProvider>,
		);

		expect(analyticsService.envoyerAnalyticsPageVue).toHaveBeenCalledWith({
			page_template: 'contenu_statique',
			pagegroup: 'contenu_statique',
			pagelabel: 'contenu_statique',
			'segment-site': 'page_de_base',
		});
	});

	it('affiche le titre de la page', async () => {
		render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<FaqPage listeDeQuestionRéponse={listeDeQuestionResultat} />
			</DependenciesProvider>);

		const title = await screen.findByRole('heading', { level: 1 });
		expect(title).toHaveTextContent('FAQ - QUESTIONS FRÉQUEMMENT POSÉES');
	});

	it('affiche le sous titre de la page', async () => {
		render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<FaqPage listeDeQuestionRéponse={listeDeQuestionResultat} />
			</DependenciesProvider>);

		const sousTitre = await screen.findByRole('heading', { level: 2 });
		expect(sousTitre).toHaveTextContent('Que pouvons-nous faire pour vous ?');

	});

	it('affiche une liste de question', async () => {
		render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<FaqPage listeDeQuestionRéponse={listeDeQuestionResultat} />
			</DependenciesProvider>);

		const listeDeQuestion = screen.getByRole('list');
		expect(listeDeQuestion).toHaveAttribute('aria-label', 'Foire aux questions');

		const listItem = within(listeDeQuestion).getAllByRole('listitem');
		expect(listItem.length).toEqual(2);
	});

	it('affiche les questions sous forme de lien', async () => {
		render(
			<DependenciesProvider analyticsService={aManualAnalyticsService()}>
				<FaqPage listeDeQuestionRéponse={listeDeQuestionResultat} />
			</DependenciesProvider>);

		const listeDeQuestion = screen.getByRole('list');
		const questions = within(listeDeQuestion).getAllByRole('listitem');

		questions.forEach((question, index) => {
			const lien = within(question).getByRole('link');
			expect(lien).toHaveTextContent(listeDeQuestionResultat[index].problématique);
			expect(lien).toHaveAttribute('href', `/faq/${listeDeQuestionResultat[index].slug}`);
		});
	});

	describe('quand la list de question est vide', () => {
		it('n’affiche pas de liste', async () => {
			render(
				<DependenciesProvider analyticsService={aManualAnalyticsService()}>
					<FaqPage listeDeQuestionRéponse={[]} />
				</DependenciesProvider>);

			const listeDeQuestion = screen.queryByRole('list');
			expect(listeDeQuestion).not.toBeInTheDocument();
		});
	});

	it('affiche le bouton de contact avec la bonne redirection', () => {

		const analyticsService = aManualAnalyticsService();
		render(
			<DependenciesProvider analyticsService={analyticsService}>
				<FaqPage listeDeQuestionRéponse={listeDeQuestionResultat} />
			</DependenciesProvider>,
		);

		const button = screen.getByRole('link', { name: 'Nous contacter' });
		expect(button).toBeVisible();
		expect(button).toHaveAttribute('href', 'mailto:contact-1j1s@sg.social.gouv.fr');
	});
});
