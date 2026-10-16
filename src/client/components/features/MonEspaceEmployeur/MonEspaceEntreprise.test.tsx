import { render, screen } from '@testing-library/react';

import { MonEspaceEntreprise } from '~/client/components/features/MonEspaceEmployeur/MonEspaceEntreprise';

describe('<MonEspaceEntreprise/>', () => {
	it('l‘utilisateur voit les liens de redirection', () => {
		process.env = {
			...process.env,
			NEXT_PUBLIC_LA_BONNE_ALTERNANCE_URL: 'https://url-lba.com/',
		};
		render(<MonEspaceEntreprise />);
		const linkConnexion = screen.getAllByRole('link', { name: 'Se connecter - nouvelle fenêtre' });
		expect(linkConnexion[0]).toBeVisible();
		expect(linkConnexion[0]).toHaveAttribute('href', 'https://www.lesentreprises-sengagent.gouv.fr/login');

		expect(linkConnexion[1]).toBeVisible();
		expect(linkConnexion[1]).toHaveAttribute('href', 'https://url-lba.com/espace-pro/authentification');

		const linkInscriptionLEE = screen.getByRole('link', { name: 'Pas encore inscrit ? Rejoignez la mobilisation' });
		expect(linkInscriptionLEE).toBeVisible();
		expect(linkInscriptionLEE).toHaveAttribute('href', '/les-entreprises-s-engagent');

		const linkInscriptionLBA = screen.getByRole('link', { name: 'Pas encore inscrit ? Inscrivez votre entreprise' });
		expect(linkInscriptionLBA).toBeVisible();
		expect(linkInscriptionLBA).toHaveAttribute('href', 'https://url-lba.com/espace-pro/creation/entreprise');
	});

	it('voit la demande de contact par mail', () => {
		render(<MonEspaceEntreprise />);

		const demandeContactMail = screen.getByRole('link', { name: 'nous contacter par email - nouvelle fenêtre' });
		expect(demandeContactMail).toBeVisible();
		expect(demandeContactMail).toHaveAttribute('href', 'mailto:contact-1j1s@sg.social.gouv.fr');
	});
});




