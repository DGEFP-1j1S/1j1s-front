import { render, screen, within } from '@testing-library/react';

import { RechercherSolutionLayout } from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayout';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { mockSmallScreen } from '~/client/components/window.mock';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';

describe('RechercherSolutionLayout', () => {
	beforeEach(() => {
		mockUseRouter({ query: { motCle: 'boulanger', page: '1' } });
	});

	describe('aucune recherche n’est lancée', () => {
		it('n’affiche pas le message de résultats de recherche ni d’étiquette', () => {
			const messageResultat = 'message de résultats de recherche';
			const etiquettes = 'étiquettes de recherche';

			render(<RechercherSolutionLayout
				isEtatInitial={true}
				banniere={<></>}
				formulaireRecherche={<></>}
				etiquettesRecherche={<>{etiquettes}</>}
				messageResultatRecherche={<h2>{messageResultat}</h2>}
				listeSolutionElement={<></>}
				isChargement={false}
				nombreTotalSolutions={0} />);

			// THEN
			expect(screen.queryByRole('heading', { level: 2, name: messageResultat })).not.toBeInTheDocument();
			expect(screen.queryByText(etiquettes)).not.toBeInTheDocument();
		});
	});

	describe('pendant le chargement de la recherche', () => {
		it('affiche les skeletons', () => {
			render(<RechercherSolutionLayout
				isChargement={true}
				banniere={<></>}
				formulaireRecherche={<></>}
				etiquettesRecherche={<></>}
				messageResultatRecherche={<></>}
				listeSolutionElement={<></>}
				isEtatInitial={false}
				nombreTotalSolutions={0} />);

			const skeletons = screen.getAllByLabelText('...En cours de chargement');
			expect(skeletons).toHaveLength(2);
			const skeletonMessageResultatUl = skeletons[0];
			const skeletonMessageResultatLi = within(skeletons[0]).getAllByRole('listitem');
			expect(skeletonMessageResultatUl).toBeVisible();
			expect(skeletonMessageResultatLi).toHaveLength(1);
			const skeletonListeResultatsUl = skeletons[1];
			const skeletonListeResultatsLi = within(skeletons[1]).getAllByRole('listitem');
			expect(skeletonListeResultatsUl).toBeVisible();
			expect(skeletonListeResultatsLi).toHaveLength(2);
		});
	});

	describe('la recherche est effectuée', () => {
		describe('lorsqu‘il en résulte une erreur', () => {
			it('annonce l‘erreur au lecteur d‘écran', () => {
				render(<RechercherSolutionLayout
					erreurRecherche={ErreurMetier.DEMANDE_INCORRECTE}
					isChargement={false}
					banniere={<></>}
					formulaireRecherche={<></>}
					etiquettesRecherche={<>étiquettes</>}
					listeSolutionElement={<>liste des résultats</>}
					messageResultatRecherche={<>message du nombre de résultats</>}
					isEtatInitial={false}
					nombreTotalSolutions={0} />);

				const alertElement = screen.getByRole('alert');

				expect(alertElement).toHaveTextContent(/Erreur - Demande incorrecteVotre navigateur a envoyé une demande que ce serveur n’a pas pu comprendre./);
			});

			it('affiche l’erreur en question', () => {
				render(<RechercherSolutionLayout
					erreurRecherche={ErreurMetier.DEMANDE_INCORRECTE}
					isChargement={false}
					banniere={<></>}
					etiquettesRecherche={<></>}
					formulaireRecherche={<></>}
					messageResultatRecherche={<></>}
					listeSolutionElement={<></>}
					isEtatInitial={false}
					nombreTotalSolutions={0} />);

				// THEN
				const messageErreur = screen.getByText('Erreur - Demande incorrecte');
				expect(messageErreur).toBeVisible();
			});

			it('n’affiche pas les étiquettes de la recherche, le message du nombre de résultats, la liste des résultats', () => {
				render(<RechercherSolutionLayout
					erreurRecherche={ErreurMetier.DEMANDE_INCORRECTE}
					isChargement={false}
					banniere={<></>}
					etiquettesRecherche={<div data-testid={'étiquettes'} />}
					formulaireRecherche={<></>}
					messageResultatRecherche={<div data-testid={'message du nombre de résultats'} />}
					isEtatInitial={false}
					nombreTotalSolutions={0}
					listeSolutionElement={<div data-testid={'liste des résultats'} />} />);

				// THEN
				const etiquettes = screen.queryByTestId('étiquettes');
				const messageNbResultats = screen.queryByTestId('message du nombre de résultats');
				const listeResultats = screen.queryByTestId('liste des résultats');
				expect(etiquettes).not.toBeInTheDocument();
				expect(messageNbResultats).not.toBeInTheDocument();
				expect(listeResultats).not.toBeInTheDocument();
			});
		});

		describe('lorsqu‘il n’y a pas d’erreur', () => {
			describe('lorsqu’il y a des résultats', () => {
				it('annonce le nombre de résultat au lecteur d‘écran', () => {
					render(<RechercherSolutionLayout
						nombreTotalSolutions={10}
						isChargement={false}
						banniere={<></>}
						formulaireRecherche={<></>}
						etiquettesRecherche={<>étiquettes</>}
						listeSolutionElement={<>liste des résultats</>}
						messageResultatRecherche={<>message du nombre de résultats</>}
						isEtatInitial={false} />);

					expect(screen.getByRole('status')).toHaveTextContent('message du nombre de résultats');
				});

				it('affiche les étiquettes de la recherche, le message du nombre de résultats, la liste des résultats', () => {
					render(<RechercherSolutionLayout
						isChargement={false}
						nombreTotalSolutions={10}
						banniere={<></>}
						formulaireRecherche={<></>}
						etiquettesRecherche={<>étiquettes</>}
						listeSolutionElement={<>liste des résultats</>}
						messageResultatRecherche={<>message du nombre de résultats</>}
						isEtatInitial={false} />);

					const etiquettes = screen.getByText('étiquettes');
					const messageNbResultats = screen.getByText('message du nombre de résultats');
					const listeResultats = screen.getByText('liste des résultats');

					expect(etiquettes).toBeVisible();
					expect(messageNbResultats).toBeVisible();
					expect(listeResultats).toBeVisible();
				});

				it('affiche une footnote et une pagination', () => {
					mockSmallScreen();

					render(<RechercherSolutionLayout
						nombreTotalSolutions={10}
						isChargement={false}
						banniere={<></>}
						formulaireRecherche={<></>}
						etiquettesRecherche={<></>}
						listeSolutionElement={<div data-testid={'liste des résultats'} />}
						messageResultatRecherche={<></>}
						isEtatInitial={false}
						footnote={<div data-testid={'footnote'} />}
						paginationOffset={5} />);

					const footnote = screen.getByTestId('footnote');
					expect(footnote).toBeVisible();
					const pagination = screen.getByRole('navigation', { name: 'pagination' });
					expect(pagination).toBeVisible();
				});
			});

			describe('il y a 0 résultat', () => {
				it('annonce qu‘il n‘y a pas de résultat au lecteur d‘écran', () => {
					render(<RechercherSolutionLayout
						nombreTotalSolutions={0}
						isChargement={false}
						banniere={<></>}
						formulaireRecherche={<></>}
						etiquettesRecherche={<>étiquettes</>}
						listeSolutionElement={<>liste des résultats</>}
						messageResultatRecherche={<>message du nombre de résultats</>}
						isEtatInitial={false} />);

					const alertElement = screen.getByRole('alert');

					expect(alertElement).toHaveTextContent(/0 résultat/);
					expect(alertElement).toHaveTextContent(/Malheureusement, aucune offre ne correspond à votre recherche !Vérifiez l‘orthographe, essayez d‘autres mots-clés ou élargissez votre zone géographique de recherche./);
				});

				it('affiche une message indiquant 0 résultat', () => {
					render(<RechercherSolutionLayout
						nombreTotalSolutions={0}
						isChargement={false}
						banniere={<></>}
						formulaireRecherche={<></>}
						etiquettesRecherche={<div data-testid={'étiquettes'} />}
						messageResultatRecherche={<div data-testid={'message du nombre de résultats'} />}
						listeSolutionElement={<div data-testid={'liste des résultats'} />}
						isEtatInitial={false} />);
					// THEN
					const messageNbResultats = screen.getByText('0 résultat');

					expect(messageNbResultats).toBeVisible();
					expect(screen.queryByTestId('message du nombre de résultats')).not.toBeInTheDocument();
					expect(screen.queryByTestId('étiquettes')).not.toBeInTheDocument();
				});

				it('n’affiche pas d’étiquettes de la recherche, ni de message du nombre de résultats, ni la liste des résultats', () => {
					render(<RechercherSolutionLayout
						nombreTotalSolutions={0}
						isChargement={false}
						banniere={<></>}
						formulaireRecherche={<></>}
						etiquettesRecherche={<div data-testid={'étiquettes'} />}
						messageResultatRecherche={<div data-testid={'message du nombre de résultats'} />}
						listeSolutionElement={<div data-testid={'liste des résultats'} />}
						isEtatInitial={false} />);

					const etiquettes = screen.queryByTestId('étiquettes');
					const messageNbResultats = screen.queryByTestId('message du nombre de résultats');
					const listeResultats = screen.queryByTestId('liste des résultats');
					expect(etiquettes).not.toBeInTheDocument();
					expect(messageNbResultats).not.toBeInTheDocument();
					expect(listeResultats).not.toBeInTheDocument();
				});
			});
		});
	});
});
