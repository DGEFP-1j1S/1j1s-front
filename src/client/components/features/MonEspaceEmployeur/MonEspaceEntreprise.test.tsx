import { render, screen } from '@testing-library/react';

import { MonEspaceEntreprise } from '~/client/components/features/MonEspaceEmployeur/MonEspaceEntreprise';

describe('<MonEspaceEntreprise/>', () => {
	it('l‘utilisateur voit les liens de redirection', () => {
		process.env = {
			...process.env,
			NEXT_PUBLIC_LA_BONNE_ALTERNANCE_URL: 'https://url-lba.com/',
		};
		render(<MonEspaceEntreprise />);
		const linkConnexion = screen.getByRole('link', { name: 'Se connecter à la communauté - nouvelle fenêtre' });
		expect(linkConnexion).toBeVisible();
		expect(linkConnexion).toHaveAttribute('href', 'https://www.lesentreprises-sengagent.gouv.fr/login');

		const linkConnexionLBA = screen.getByRole('link', { name: 'Gérer ses offres - nouvelle fenêtre' });
		expect(linkConnexionLBA).toBeVisible();
		expect(linkConnexionLBA).toHaveAttribute('href', 'https://url-lba.com/espace-pro/authentification');

		const linkInscriptionLEE = screen.getByRole('link', { name: 'Rejoindre la mobilisation' });
		expect(linkInscriptionLEE).toBeVisible();
		expect(linkInscriptionLEE).toHaveAttribute('href', '/les-entreprises-s-engagent');

		const linkInscriptionLBA = screen.getByRole('link', { name: 'Inscrire son entreprise - nouvelle fenêtre' });
		expect(linkInscriptionLBA).toBeVisible();
		expect(linkInscriptionLBA).toHaveAttribute('href', 'https://url-lba.com/espace-pro/creation/entreprise');
	});

	it('voit la demande de contact par mail', () => {
		render(<MonEspaceEntreprise />);

		const demandeContactMail = screen.getByRole('link', { name: 'Contacter par email - nouvelle fenêtre' });
		expect(demandeContactMail).toBeVisible();
		expect(demandeContactMail).toHaveAttribute('href', 'mailto:contact-1j1s@sg.social.gouv.fr');
	});
});




