import { render, screen, within } from '@testing-library/react';

import {
	DetailEmploiEurope,
} from '~/client/components/features/EmploisEurope/ConsulterOffre/ConsulterOffreEmploiEurope';
import { mockUseRouter } from '~/client/components/useRouter.mock';
import { DependenciesProvider } from '~/client/context/dependenciesContainer.context';
import { aStorageService } from '~/client/services/storage/storage.service.fixture';
import { anEmploiEurope } from '~/server/emplois-europe/domain/emploiEurope.fixture';
import { NiveauDEtudesLibelle } from '~/server/emplois-europe/domain/niveauDEtudes';
import { LEVEL_CODE, LEVEL_NAME } from '~/server/emplois-europe/infra/langageEures';
import { UNITE_EXPERIENCE_NECESSAIRE } from '~/server/emplois-europe/infra/uniteExperienceNecessaire';

function getSection(name: string): HTMLElement {
	return screen.getByRole("heading", { level: 2, name }).parentElement as HTMLElement;
}

function querySection(name: string) {
	return screen.queryByRole("heading", { level: 2, name });
}

describe('DetailOffreEmploiEurope', () => {

	beforeEach(() => {
		mockUseRouter({});
	});

	describe('affiche le titre de l‘offre', () => {
		describe('titre disponible', () => {
			it('affiche le titre de l‘offre d‘emploi avec l‘attribut langue associé', () => {
				const offreEmploiEurope = anEmploiEurope({ codeLangueDeLOffre: 'lb', titre: 'Boulanger' });

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				const titreDeLOffre = screen.getByRole('heading', { level: 1, name: 'Boulanger' });

				expect(titreDeLOffre).toBeVisible();
				expect(titreDeLOffre).toHaveAttribute('lang', 'lb');
			});
			it('si la langue n‘est pas présente, affiche le titre avec l‘attribut langue inconnue', () => {
				const offreEmploiEurope = anEmploiEurope({ codeLangueDeLOffre: undefined, titre: 'Boulanger' });

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				const titreDeLOffre = screen.getByRole('heading', { level: 1, name: 'Boulanger' });

				expect(titreDeLOffre).toBeVisible();
				expect(titreDeLOffre).toHaveAttribute('lang', '');
			});
		});

		it('affiche \'Titre non renseigné\' si le titre de l‘offre d‘emploi est indisponible, sans l‘attribut langue', () => {
			const offreEmploiEurope = anEmploiEurope({ titre: undefined });

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			const titreDeLOffre = screen.getByRole('heading', { level: 1, name: 'Offre d’emploi sans titre' });


			expect(titreDeLOffre).toBeVisible();
			expect(titreDeLOffre).not.toHaveAttribute('lang');
		});

		it('affiche \'Titre non renseigné\' si le titre de l‘offre d‘emploi est une chaine de caractères vides, sans l‘attribut langue', () => {
			const offreEmploiEurope = anEmploiEurope({ titre: '' });

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			const titreDeLOffre = screen.getByRole('heading', { level: 1, name: 'Offre d’emploi sans titre' });


			expect(titreDeLOffre).toBeVisible();
			expect(titreDeLOffre).not.toHaveAttribute('lang');
		});
	});

	describe('lorsque je souhaite postuler a une offre', () => {
		it('affiche le bouton pour postuler à une offre si le lien est donné', () => {
			const offreEmploiEurope = anEmploiEurope({ urlCandidature: 'https://urlDeCandidature.com' });

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);


			const linkCandidature = screen.getByRole('link', { name: 'Postuler sur Eures - nouvelle fenêtre' });

			expect(linkCandidature).toHaveAttribute('href', 'https://urlDeCandidature.com');
			expect(linkCandidature).toBeVisible();
		});

		it('n‘affiche pas le bouton pour postuler à une offre si le lien n‘est pas donné', () => {

			const offreEmploiEurope = anEmploiEurope({ urlCandidature: undefined });

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);


			const linkCandidature = screen.queryByRole('link', { name: 'Postuler sur Eures' });

			expect(linkCandidature).not.toBeInTheDocument();
		});
	});

	it('affiche le nom de l‘entreprise si il est disponible', () => {
		const offreEmploiEurope = anEmploiEurope({ nomEntreprise: 'Ma Mie d‘amour' });

		render(
			<DependenciesProvider sessionStorageService={aStorageService()}>
				<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
			</DependenciesProvider>,
		);

		const nomDeLEntreprise = screen.getByText('Ma Mie d‘amour');


		expect(nomDeLEntreprise).toBeVisible();
	});

	describe('Tags', () => {
		it('si le type de contrat est présent, affiche le type de contrat', () => {
			// GIVEN
			const offreEmploiEurope = anEmploiEurope({ typeContrat: 'Embauche directe' });

			// WHEN
			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			// THEN
			const listTags = screen.getByRole('list', { name: 'Caractéristiques de l‘offre d‘emploi' });
			const tagTypeContrat = within(listTags).getByText('Embauche directe');
			expect(tagTypeContrat).toBeVisible();
		});

		it('si le temps de travail est présent, affiche le temps de travail', () => {
			// GIVEN
			const offreEmploiEurope = anEmploiEurope({ tempsDeTravail: 'Temps partiel' });

			// WHEN
			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			// THEN
			const listTags = screen.getByRole('list', { name: 'Caractéristiques de l‘offre d‘emploi' });
			const tagTypeContrat = within(listTags).getByText('Temps partiel');
			expect(tagTypeContrat).toBeVisible();
		});

		it('si le niveau d‘etudes est présent, affiche le niveau d‘etudes', () => {
			// GIVEN
			const offreEmploiEurope = anEmploiEurope({ niveauEtudes: NiveauDEtudesLibelle.MASTER });

			// WHEN
			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			// THEN
			const listTags = screen.getByRole('list', { name: 'Caractéristiques de l‘offre d‘emploi' });
			const tagTypeContrat = within(listTags).getByText('Master (Bac+5)');
			expect(tagTypeContrat).toBeVisible();
		});

		it('si le niveau d‘etudes est "Niveau d‘études non spécifié", n‘affiche pas le niveau d‘etudes', () => {
			// GIVEN
			const offreEmploiEurope = anEmploiEurope({ niveauEtudes: NiveauDEtudesLibelle.NON_SPECIFIE });

			// WHEN
			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			// THEN
			const listTags = screen.getByRole('list', { name: 'Caractéristiques de l‘offre d‘emploi' });
			const tagTypeContrat = within(listTags).queryByText('Niveau d‘études non spécifié');
			expect(tagTypeContrat).not.toBeInTheDocument();
		});

		describe('quand un résultat contient un pays et une ville', () => {
			it('affiche le résultat avec le pays et la ville', () => {
				// GIVEN
				const offreEmploiEurope = anEmploiEurope({ localisations: [{ pays: 'France', ville: 'Paris' }] });

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				// THEN
				const listTags = screen.getByRole('list', { name: 'Caractéristiques de l‘offre d‘emploi' });
				const tagLocalisation = within(listTags).getByText('France/Paris');
				expect(tagLocalisation).toBeVisible();
			});
		});

		describe('quand un résultat contient un pays mais pas de ville', () => {
			it('affiche le résultat avec le pays', () => {
				// GIVEN
				const offreEmploiEurope = anEmploiEurope({ localisations: [{ pays: 'France', ville: undefined }] });

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				// THEN
				const listTags = screen.getByRole('list', { name: 'Caractéristiques de l‘offre d‘emploi' });
				const tagLocalisation = within(listTags).getByText('France');
				expect(tagLocalisation).toBeVisible();
			});
		});

		describe('quand un résultat contient une ville mais pas de pays', () => {
			it('affiche le résultat avec la ville', () => {
				// GIVEN
				const offreEmploiEurope = anEmploiEurope({ localisations: [{ pays: undefined, ville: 'Paris' }] });

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				// THEN
				const listTags = screen.getByRole('list', { name: 'Caractéristiques de l‘offre d‘emploi' });
				const tagLocalisation = within(listTags).getByText('Paris');
				expect(tagLocalisation).toBeVisible();
			});
		});

		describe('quand un résultat contient plusieurs localisations', () => {
			it('affiche un tag indiquant la multi-localisation', () => {
				// GIVEN
				const offreEmploiEurope = anEmploiEurope({ localisations: [
					{ pays: 'Suède', ville: undefined },
					{ pays: 'Allemagne', ville: undefined },
				],
				});

				// WHEN
				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				// THEN
				const listTags = screen.getByRole('list', { name: 'Caractéristiques de l‘offre d‘emploi' });
				const tagLocalisation = within(listTags).getByText('Multi-localisation');
				expect(tagLocalisation).toBeVisible();
			});
		});
	});

	describe('affiche la description de l‘offre', () => {
		describe('description disponible', () => {
			it('affiche la description de l‘offre si elle est disponible avec l‘attribut langue associée', () => {
				const offreEmploiEurope = anEmploiEurope({ codeLangueDeLOffre: 'lb', description: 'Je suis la description' });

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(getSection('Description du poste')).toHaveTextContent('Je suis la description');
				expect(screen.getByText('Je suis la description')).toHaveAttribute('lang', 'lb');
			});

			it('si la langue n‘est pas présente, affiche la description avec l‘attribut langue inconnue', () => {
				const offreEmploiEurope = anEmploiEurope({
					codeLangueDeLOffre: undefined,
					description: 'Je suis la description',
				});

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(screen.getByText('Je suis la description')).toHaveAttribute('lang', '');
			});

			it('sanitize la description de l‘offre', () => {
				const offreEmploiEurope = anEmploiEurope({ description: '<a href=\'javascript:alert(1)\'>Je suis la description</a>' });

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(within(getSection('Description du poste')).getByText('Je suis la description')).not.toHaveAttribute('href');
			});
		});

		it('n‘affiche pas la description de l‘offre si elle n‘est pas disponible', () => {
			const offreEmploiEurope = anEmploiEurope({ description: undefined });

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			expect(querySection('Description du poste')).not.toBeInTheDocument();
		});
	});

	describe('affiche le permis requis', () => {
		it('affiche les permis requis si ils sont disponibles', () => {
			const offreEmploiEurope = anEmploiEurope({ listePermis: ['B', 'C'] });

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			expect(getSection('Type de permis requis')).toHaveTextContent('B, C');
		});

		it('n‘affiche pas le permis requis si il n‘est pas disponible', () => {
			const offreEmploiEurope = anEmploiEurope({ listePermis: [] });

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			expect(querySection('Type de permis requis')).not.toBeInTheDocument();
		});
	});

	describe('localisations', () => {
		
		describe('si il y a une seule localisation', () => {
			it('affiche la ville et le pays si ils sont présents', () => {
				const offreEmploiEurope = anEmploiEurope({ localisations: [{ pays: 'France', ville: 'La Rochelle' }] });

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(getSection('Localisation')).toHaveTextContent('France, La Rochelle');
			});

			it('affiche seulement la ville si le pays n‘est pas renseigné' , () => {
				const offreEmploiEurope = anEmploiEurope({ localisations: [{ ville: 'La Rochelle' }] });

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(getSection('Localisation')).toHaveTextContent('La Rochelle');
			});

			it('affiche seulement le pays si la ville n‘est pas renseignée' , () => {
				const offreEmploiEurope = anEmploiEurope({ localisations: [{ pays: 'France' }] });

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(getSection('Localisation')).toHaveTextContent('France');
			});

		});

		describe('si il y a plusieurs localisations', () => {
			it('affiche les localisations dans une liste', () => {
				// Given
				const offreEmploiEurope = anEmploiEurope({ localisations: [
					{ pays: 'France', ville: 'La Rochelle' },
					{ pays: 'Belgique', ville: 'Charleroi' },
				],
				});

				// When
				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);


				// Then
				const localisations = getSection('Localisations');
				const listeLocalisation = within(localisations).getByRole('list');

				const LaRochelle = within(listeLocalisation).getByText('France, La Rochelle');
				const Charleroi = within(listeLocalisation).getByText('Belgique, Charleroi');

				expect(LaRochelle).toBeVisible();
				expect(Charleroi).toBeVisible();
			});
		});
		

		it('n‘affiche pas la localisation si elle n‘est pas disponible', () => {
			const offreEmploiEurope = anEmploiEurope({ localisations: [] });

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			expect(querySection('Localisation')).not.toBeInTheDocument();
			expect(querySection('Localisations')).not.toBeInTheDocument();
		});
	});

	describe('langue de travail', () => {
		it('affiche les langues si elles sont disponibles', () => {
			const offreEmploiEurope = anEmploiEurope({ langueDeTravail: ['Anglais', 'Français'] });

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			expect(getSection('Langue de travail')).toHaveTextContent('Anglais, Français');
		});

		it('n‘affiche pas la langue si elle n‘est pas disponible', () => {
			const offreEmploiEurope = anEmploiEurope({ langueDeTravail: [] });

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			expect(querySection('Langue de travail')).not.toBeInTheDocument();
		});
	});

	describe('les compétences linguistiques', () => {
		it('affiche les compétences demandées', () => {
			const offreEmploiEurope = anEmploiEurope({
				competencesLinguistiques: [{
					codeDuNiveauDeLangue: LEVEL_CODE.B2,
					detailCompetenceLanguistique: [
						{
							codeDuNiveauDeLaCompetence: LEVEL_CODE.A1,
							nomCompetence: 'competence 1',
							nomDuNiveauDeLaCompetence: LEVEL_NAME.ELEMENTAIRE,
						},
						{
							codeDuNiveauDeLaCompetence: LEVEL_CODE.C2,
							nomCompetence: 'competence 2',
							nomDuNiveauDeLaCompetence: LEVEL_NAME.MAITRISE,
						},
					],
					langage: 'français',
					nomDuNiveauDeLangue: LEVEL_NAME.AVANCE,
				}],
			});

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			const competencesLinguistiquesDescription = getSection('Compétences linguistiques requises');
			expect(competencesLinguistiquesDescription).toHaveTextContent('Français (B2 - avancé)');
			expect(competencesLinguistiquesDescription).toHaveTextContent('Competence 1 (A1 - élémentaire)');
			expect(competencesLinguistiquesDescription).toHaveTextContent('Competence 2 (C2 - maitrise)');
		});

		it('n‘affiche pas les compétences s‘il n‘y en a pas', () => {
			const offreEmploiEurope = anEmploiEurope({ competencesLinguistiques: [] });

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			expect(querySection('Compétences linguistiques requises')).not.toBeInTheDocument();
		});
	});

	describe('niveau d‘expérience', () => {
		it('lorsque le niveau d‘expérience n‘est pas fourni, n‘affiche pas de message', () => {
			const offreEmploiEurope = anEmploiEurope({ laPlusLongueExperienceNecessaire: undefined });

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			expect(querySection('Expérience')).not.toBeInTheDocument();
		});

		it('lorsque qu‘aucune expérience est requise', () => {
			const offreEmploiEurope = anEmploiEurope({
				laPlusLongueExperienceNecessaire: {
					duree: 0,
				},
			});

			render(
				<DependenciesProvider sessionStorageService={aStorageService()}>
					<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
				</DependenciesProvider>,
			);

			expect(getSection('Expérience')).toHaveTextContent('Aucune expérience requise');
		});

		describe('lorsque l‘unité est en mois', () => {
			it('lorsque qu‘un mois est demandé', () => {
				const offreEmploiEurope = anEmploiEurope({
					laPlusLongueExperienceNecessaire: {
						duree: 1, unite: UNITE_EXPERIENCE_NECESSAIRE.MONTH,
					},
				});

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(getSection('Expérience')).toHaveTextContent('1 mois');
			});

			it('lorsque plusieurs mois sont demandés', () => {
				const offreEmploiEurope = anEmploiEurope({
					laPlusLongueExperienceNecessaire: {
						duree: 5, unite: UNITE_EXPERIENCE_NECESSAIRE.MONTH,
					},
				});

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(getSection('Expérience')).toHaveTextContent('5 mois');
			});
		});

		describe('lorsque l‘unité est en années', () => {
			it('lorsque qu‘un an est demandé', () => {
				const offreEmploiEurope = anEmploiEurope({
					laPlusLongueExperienceNecessaire: {
						duree: 1,
						unite: UNITE_EXPERIENCE_NECESSAIRE.YEAR,
					},
				});

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(getSection('Expérience')).toHaveTextContent('1 an');
			});

			it('lorsque plusieurs mois sont demandées', () => {
				const offreEmploiEurope = anEmploiEurope({
					laPlusLongueExperienceNecessaire: {
						duree: 5,
						unite: UNITE_EXPERIENCE_NECESSAIRE.YEAR,
					},
				});

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(getSection('Expérience')).toHaveTextContent('5 ans');
			});
		});

		describe('lorsque l‘unité est en semaine', () => {
			it('lorsque qu‘une semaine est demandée', () => {
				const offreEmploiEurope = anEmploiEurope({
					laPlusLongueExperienceNecessaire: {
						duree: 1,
						unite: UNITE_EXPERIENCE_NECESSAIRE.WEEK,
					},
				});

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(getSection('Expérience')).toHaveTextContent('1 semaine');
			});

			it('lorsque plusieurs semaines sont demandées', () => {
				const offreEmploiEurope = anEmploiEurope({
					laPlusLongueExperienceNecessaire: {
						duree: 5,
						unite: UNITE_EXPERIENCE_NECESSAIRE.WEEK,
					},
				});

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(getSection('Expérience')).toHaveTextContent('5 semaines');
			});
		});

		describe('lorsque l‘unité est en jour', () => {
			it('lorsque qu‘un jour est demandée', () => {
				const offreEmploiEurope = anEmploiEurope({
					laPlusLongueExperienceNecessaire: {
						duree: 1,
						unite: UNITE_EXPERIENCE_NECESSAIRE.DAY,
					},
				});

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(getSection('Expérience')).toHaveTextContent('1 jour');
			});

			it('lorsque plusieurs jours sont demandées', () => {
				const offreEmploiEurope = anEmploiEurope({
					laPlusLongueExperienceNecessaire: {
						duree: 5,
						unite: UNITE_EXPERIENCE_NECESSAIRE.DAY,
					},
				});

				render(
					<DependenciesProvider sessionStorageService={aStorageService()}>
						<DetailEmploiEurope annonceEmploiEurope={offreEmploiEurope} />
					</DependenciesProvider>,
				);

				expect(getSection('Expérience')).toHaveTextContent('5 jours');
			});
		});
	});
});
