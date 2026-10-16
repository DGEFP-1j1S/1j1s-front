import { render, screen, within } from '@testing-library/react';

import {
	ResultatRechercherSolution,
} from '~/client/components/layouts/RechercherSolution/Resultat/ResultatRechercherSolution';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { anOffreEmploi } from '~/server/offres/domain/offre.fixture';

describe('RésultatRechercherSolution', () => {

	beforeEach(() => {
		mockSmallScreen();
		mockUseRouter({});
	});

	it('affiche une carte emploi avec un résumé de l‘offre', () => {
		const offreEmploi = anOffreEmploi();

		render(
			<ResultatRechercherSolution
				intituléOffre={offreEmploi.intitulé}
				lienOffre={`/emplois/${offreEmploi.id}`}
				logo={offreEmploi.entreprise.logo}
				sousTitreOffre={offreEmploi.entreprise.nom}
				étiquetteOffreList={offreEmploi.étiquetteList} />,
		);

		const étiquettesOffreAlternanceList = screen.getByRole('list', { name: 'Caractéristiques de l‘offre' });
		const lienVersOffreEmploi = screen.getByRole('link');
		const intituléOffreEmploi = screen.getByRole('heading', { level: 3 });

		expect(within(étiquettesOffreAlternanceList).queryAllByRole('listitem')).toHaveLength(4);
		expect(screen.getByText('En savoir plus')).toBeVisible();
		expect(lienVersOffreEmploi).toHaveAttribute('href', `/emplois/${offreEmploi.id}`);
		expect(intituléOffreEmploi.textContent).toEqual(offreEmploi.intitulé);
	});

	describe('lorsque le lien d‘offre n‘existe pas', () => {
		it('je ne peux pas clicker sur la carte', () => {
			const offreEmploi = anOffreEmploi();

			render(
				<ResultatRechercherSolution
					intituléOffre={offreEmploi.intitulé}
					logo={offreEmploi.entreprise.logo}
					sousTitreOffre={offreEmploi.entreprise.nom}
					étiquetteOffreList={offreEmploi.étiquetteList} />,
			);

			expect(screen.queryByRole('link')).not.toBeInTheDocument();
			expect(screen.queryByText('En savoir plus')).not.toBeInTheDocument();
		});
	});


	describe('lorsqu‘une description est fournise', () => {
		it('je vois la description', () => {
			const offreEmploi = anOffreEmploi();

			render(
				<ResultatRechercherSolution
					intituléOffre={offreEmploi.intitulé}
					logo={offreEmploi.entreprise.logo}
					sousTitreOffre={offreEmploi.entreprise.nom}
					étiquetteOffreList={offreEmploi.étiquetteList}>
					<div>Description 1</div>
					<div>Description 2</div>
				</ResultatRechercherSolution>,
			);

			expect(screen.getByText('Description 1')).toBeVisible();
			expect(screen.getByText('Description 2')).toBeVisible();
		});
	});

	describe('lorsqu‘un intitulé de lien est fournis', () => {
		it('je vois l‘intitulé', () => {
			const offreEmploi = anOffreEmploi();

			render(
				<ResultatRechercherSolution
					intituléOffre={offreEmploi.intitulé}
					intituléLienOffre="Candidater"
					logo={offreEmploi.entreprise.logo}
					sousTitreOffre={offreEmploi.entreprise.nom}
					étiquetteOffreList={offreEmploi.étiquetteList}
					lienOffre={`/emplois/${offreEmploi.id}`}>
					<div>Description 1</div>
					<div>Description 2</div>
				</ResultatRechercherSolution>,
			);

			expect(screen.getByRole('link', { name: 'Candidater' })).toBeVisible();
		});
		it('n‘a pas d‘attribut aria-labelledby', () => {
			const offreEmploi = anOffreEmploi();

			render(
				<ResultatRechercherSolution
					intituléOffre={offreEmploi.intitulé}
					intituléLienOffre="Candidater"
					logo={offreEmploi.entreprise.logo}
					sousTitreOffre={offreEmploi.entreprise.nom}
					étiquetteOffreList={offreEmploi.étiquetteList}
					lienOffre={`/emplois/${offreEmploi.id}`}>
					<div>Description 1</div>
					<div>Description 2</div>
				</ResultatRechercherSolution>,
			);

			const lien = screen.getByRole('link', { name: 'Candidater' });
			expect(lien).toBeVisible();
			expect(lien).not.toHaveAttribute('aria-labelledby');
		});
	});
	describe('lorsqu‘un intitulé de lien n‘est pas fournis', () => {
		it('le nom du lien par défaut est complété par l‘intitulé de l‘offre', () => {
			const offreEmploi = anOffreEmploi();

			render(
				<ResultatRechercherSolution
					intituléOffre={'Barman'}
					logo={offreEmploi.entreprise.logo}
					sousTitreOffre={offreEmploi.entreprise.nom}
					étiquetteOffreList={offreEmploi.étiquetteList}
					lienOffre={`/emplois/${offreEmploi.id}`}>
					<div>Description 1</div>
					<div>Description 2</div>
				</ResultatRechercherSolution>,
			);

			expect(screen.getByRole('link', { name: 'Barman En savoir plus' })).toBeVisible();
		});
	});
});
