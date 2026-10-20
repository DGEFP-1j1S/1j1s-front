import "~/test-utils";

import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { DependenciesProvider } from "~/client/context/dependenciesContainer.context";
import { CookiesService, EtatGestionnaireConsentement, Finalite } from "~/client/services/cookies/cookies.service";
import { aCookiesService } from "~/client/services/cookies/cookies.service.fixture";

import { GestionnaireConsentement } from "./GestionnaireConsentement";

function aCookiesServiceObservable(etatInitial: Partial<EtatGestionnaireConsentement>, override?: Partial<CookiesService>) {
	let etat: EtatGestionnaireConsentement = { banniereOuverte: false, panneauOuvert: false, ...etatInitial };
	const listeners = new Set<() => void>();
	const service = aCookiesService({
		getEtat: () => etat,
		subscribe: (listener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		...override,
	});
	const changerEtat = (changement: Partial<EtatGestionnaireConsentement>) => act(() => {
		etat = { ...etat, ...changement };
		listeners.forEach((listener) => listener());
	});
	return { changerEtat, service };
}

function mockDsfr() {
	window.dsfr = Object.assign((element: Element) => ({
		modal: {
			conceal: () => {
				if (!element.hasAttribute('open')) return;
				element.removeAttribute('open');
				element.dispatchEvent(new Event('dsfr.conceal'));
			},
			disclose: () => element.setAttribute('open', ''),
		},
	}), { start: vi.fn() });
}

const finalites: Array<Finalite> = [
	{ description: '<p>Nécessaires au fonctionnement du site</p>', id: 'obligatoire', obligatoire: true, services: [], titre: 'Cookies techniques' },
	{
		description: 'Contenus multimédia',
		id: 'video',
		obligatoire: false,
		services: [{ autorise: true, description: '<p>Vidéos hébergées par Google</p>', id: 'youtube', nom: 'YouTube' }],
		titre: 'Vidéos',
	},
	{
		id: 'analytic',
		obligatoire: false,
		services: [
			{ autorise: undefined, id: 'eulerian', nom: 'Eulerian' },
			{ autorise: undefined, id: 'matomo', nom: 'Matomo' },
		],
		titre: 'Mesure d’audience',
	},
];

function renderGestionnaire(cookiesService: CookiesService) {
	return render(
		<DependenciesProvider cookiesService={cookiesService}>
			<GestionnaireConsentement />
		</DependenciesProvider>,
	);
}

describe('GestionnaireConsentement', () => {
	beforeEach(() => {
		mockDsfr();
	});

	describe('bannière', () => {
		it('n’affiche pas la bannière quand tarteaucitron ne la demande pas', () => {
			const { service } = aCookiesServiceObservable({ banniereOuverte: false });

			renderGestionnaire(service);

			expect(screen.queryByRole('heading', { name: 'À propos des cookies sur 1jeune1solution.gouv.fr' })).not.toBeInTheDocument();
		});

		it('affiche la bannière quand tarteaucitron l’ouvre, et la masque quand il la ferme', () => {
			const { service, changerEtat } = aCookiesServiceObservable({ banniereOuverte: false });
			renderGestionnaire(service);

			changerEtat({ banniereOuverte: true });
			expect(screen.getByRole('heading', { level: 2, name: 'À propos des cookies sur 1jeune1solution.gouv.fr' })).toBeVisible();

			changerEtat({ banniereOuverte: false });
			expect(screen.queryByRole('heading', { name: 'À propos des cookies sur 1jeune1solution.gouv.fr' })).not.toBeInTheDocument();
		});

		it('affiche un lien vers la politique de confidentialité', () => {
			const { service } = aCookiesServiceObservable({ banniereOuverte: true });

			renderGestionnaire(service);

			expect(screen.getByRole('link', { name: 'Politique de confidentialité' })).toHaveAttribute('href', '/confidentialite');
		});

		it.each([
			['Tout accepter', 'acceptAll'],
			['Tout refuser', 'denyAll'],
			['Personnaliser', 'openPanel'],
		] as const)('le bouton « %s » appelle %s', async (nomBouton, methode) => {
			const user = userEvent.setup();
			const { service } = aCookiesServiceObservable({ banniereOuverte: true });
			renderGestionnaire(service);

			await user.click(screen.getByRole('button', { name: nomBouton }));

			expect(service[methode]).toHaveBeenCalledTimes(1);
		});
	});

	describe('panneau', () => {
		it('ouvre la modale DSFR quand tarteaucitron ouvre le panneau', () => {
			const { service, changerEtat } = aCookiesServiceObservable({}, { getFinalites: () => finalites });
			renderGestionnaire(service);

			changerEtat({ panneauOuvert: true });

			expect(screen.getByRole('dialog', { name: 'Panneau de gestion des cookies' })).toBeVisible();
		});

		it('affiche une finalité par catégorie, avec les cookies obligatoires acceptés et non refusables', () => {
			const { service } = aCookiesServiceObservable({ panneauOuvert: true }, { getFinalites: () => finalites });

			renderGestionnaire(service);

			const obligatoires = screen.getByRole('group', { name: /Cookies techniques/ });
			expect(within(obligatoires).getByRole('radio', { name: 'Accepter' })).toBeChecked();
			expect(within(obligatoires).getByRole('radio', { name: 'Refuser' })).toBeDisabled();
			expect(screen.getByRole('group', { name: /Vidéos/ })).toBeVisible();
			expect(screen.getByRole('group', { name: /Mesure d’audience/ })).toBeVisible();
		});

		it('coche les choix déjà enregistrés', () => {
			const { service } = aCookiesServiceObservable({ panneauOuvert: true }, { getFinalites: () => finalites });

			renderGestionnaire(service);

			const videos = screen.getByRole('group', { name: /Vidéos/ });
			expect(within(videos).getAllByRole('radio', { name: 'Accepter' })[0]).toBeChecked();
			const mesureAudience = screen.getByRole('group', { name: /Mesure d’audience/ });
			expect(within(mesureAudience).getAllByRole('radio', { name: 'Accepter' })[0]).not.toBeChecked();
			expect(within(mesureAudience).getAllByRole('radio', { name: 'Refuser' })[0]).not.toBeChecked();
		});

		it('enregistre les choix par finalité à la confirmation', async () => {
			const user = userEvent.setup();
			const { service } = aCookiesServiceObservable({ panneauOuvert: true }, { getFinalites: () => finalites });
			renderGestionnaire(service);

			const mesureAudience = screen.getByRole('group', { name: /Mesure d’audience/ });
			await user.click(within(mesureAudience).getAllByRole('radio', { name: 'Refuser' })[0]);
			await user.click(screen.getByRole('button', { name: 'Confirmer mes choix' }));

			expect(service.saveChoices).toHaveBeenCalledWith({ eulerian: false, matomo: false, youtube: true });
		});

		it('n’enregistre rien sans confirmation', async () => {
			const user = userEvent.setup();
			const { service } = aCookiesServiceObservable({ panneauOuvert: true }, { getFinalites: () => finalites });
			renderGestionnaire(service);

			await user.click(screen.getByRole('radio', { name: 'Tout refuser' }));

			expect(service.saveChoices).not.toHaveBeenCalled();
		});

		it('applique « Tout refuser » à tous les services', async () => {
			const user = userEvent.setup();
			const { service } = aCookiesServiceObservable({ panneauOuvert: true }, { getFinalites: () => finalites });
			renderGestionnaire(service);

			await user.click(screen.getByRole('radio', { name: 'Tout refuser' }));
			await user.click(screen.getByRole('button', { name: 'Confirmer mes choix' }));

			expect(service.saveChoices).toHaveBeenCalledWith({ eulerian: false, matomo: false, youtube: false });
		});

		it('permet de choisir service par service dans les détails d’une finalité', async () => {
			const user = userEvent.setup();
			const { service } = aCookiesServiceObservable({ panneauOuvert: true }, { getFinalites: () => finalites });
			renderGestionnaire(service);

			const mesureAudience = screen.getByRole('group', { name: /Mesure d’audience/ });
			const boutonDetails = within(mesureAudience).getByRole('button', { name: 'Voir plus de détails' });
			expect(boutonDetails).toHaveAttribute('aria-expanded', 'false');
			expect(screen.queryByRole('group', { name: 'Matomo' })).not.toBeInTheDocument();

			await user.click(boutonDetails);
			expect(boutonDetails).toHaveAttribute('aria-expanded', 'true');
			await user.click(within(screen.getByRole('group', { name: 'Matomo' })).getByRole('radio', { name: 'Accepter' }));
			await user.click(screen.getByRole('button', { name: 'Confirmer mes choix' }));

			expect(service.saveChoices).toHaveBeenCalledWith({ matomo: true, youtube: true });
		});

		it('ferme le panneau tarteaucitron quand la modale DSFR est fermée', () => {
			const { service } = aCookiesServiceObservable({ panneauOuvert: true }, { getFinalites: () => finalites });
			renderGestionnaire(service);

			act(() => {
				screen.getByRole('dialog').dispatchEvent(new Event('dsfr.conceal'));
			});

			expect(service.closePanel).toHaveBeenCalledTimes(1);
		});

		it('ne rappelle pas tarteaucitron quand la fermeture vient de lui', () => {
			const { service, changerEtat } = aCookiesServiceObservable({ panneauOuvert: true }, { getFinalites: () => finalites });
			renderGestionnaire(service);

			changerEtat({ panneauOuvert: false });

			expect(service.closePanel).not.toHaveBeenCalled();
		});
	});
});
