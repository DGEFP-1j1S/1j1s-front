import { createFailure, createSuccess, Failure, Success } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { RechercheLocalisation } from '~/server/localisations/domain/localisation';
import {
	aDépartementList,
	aLocalisationRepository,
	aRégionList,
} from '~/server/localisations/domain/localisation.fixture';
import { LocalisationRepository } from '~/server/localisations/domain/localisation.repository';
import {
	aCommuneList,
	aLocalisationAvecCoordonnéesRepository,
	aRésultatsRechercheCommune,
} from '~/server/localisations/domain/localisationAvecCoordonnées.fixture';
import {
	LocalisationAvecCoordonnéesRepository,
} from '~/server/localisations/domain/localisationAvecCoordonnées.repository';
import { RechercherLocalisationUseCase } from '~/server/localisations/useCases/rechercherLocalisation.useCase';

describe('RechercherLocalisationUseCase', () => {
	let localisationRepository: LocalisationRepository;
	let localisationAvecCoordonneesRepository: LocalisationAvecCoordonnéesRepository;

	beforeEach(() => {
		localisationRepository = aLocalisationRepository();
		localisationAvecCoordonneesRepository = aLocalisationAvecCoordonnéesRepository();
	});

	describe('Lorsque la recherche ne contient que 2 chiffres (département)', () => {
		describe('Lorsque la récupération de la liste de départements fonctionne', () => {
			it('renvoie une liste avec le département correspondant à la recherche', async () => {
				const listeLocalisationUseCase = new RechercherLocalisationUseCase(localisationRepository, localisationAvecCoordonneesRepository);
				vi.spyOn(localisationRepository, 'getDépartementListByNuméroDépartement').mockResolvedValue(createSuccess(aDépartementList()));

				const expected: RechercheLocalisation = {
					communeList: [],
					departementList: aDépartementList(),
					regionList: [],
				};
				const { result } = await listeLocalisationUseCase.handle('78') as Success<RechercheLocalisation>;

				expect(result).toEqual(expected);
			});
		});
	});
	describe('Lorsque la recherche ne contient que 5 chiffres (code postal)', () => {
		describe('Lorsque la récupération de la liste des communes fonctionne', () => {
			it('renvoie la liste de communes correspondant à la recherche', async () => {
				const listeLocalisationUseCase = new RechercherLocalisationUseCase(localisationRepository, localisationAvecCoordonneesRepository);
				vi.spyOn(localisationAvecCoordonneesRepository, 'getCommuneList').mockResolvedValue(createSuccess(aRésultatsRechercheCommune()));
				const expected: RechercheLocalisation = {
					communeList: aCommuneList(),
					departementList: [],
					regionList: [],
				};
				const { result } = await listeLocalisationUseCase.handle('95100') as Success<RechercheLocalisation>;

				expect(result).toEqual(expected);
			});
		});
		describe('Lorsque la récupération de la liste des communes échoue', () => {
			it('renvoie une erreur', async () => {
				const listeLocalisationUseCase = new RechercherLocalisationUseCase(localisationRepository, localisationAvecCoordonneesRepository);
				vi.spyOn(localisationAvecCoordonneesRepository, 'getCommuneList').mockResolvedValue(createFailure(ErreurMetier.CONTENU_INDISPONIBLE));

				const result = await listeLocalisationUseCase.handle('95100') as Failure;

				expect(result.instance).toEqual('failure');
				expect(result.errorType).toEqual(ErreurMetier.CONTENU_INDISPONIBLE);
			});
		});
	});
	describe('quand la recherche contient des lettres (nom de commune, département ou région)', () => {
		describe('lorsque la recherche contient moins de 3 lettres', () => {
			it('renvoie une erreur', async () => {
				const listeLocalisationUseCase = new RechercherLocalisationUseCase(localisationRepository, localisationAvecCoordonneesRepository);
				vi.spyOn(localisationAvecCoordonneesRepository, 'getCommuneList');
				vi.spyOn(localisationRepository, 'getDépartementListByNom');
				vi.spyOn(localisationRepository, 'getRégionListByNom');

				const result = await listeLocalisationUseCase.handle('Pa') as Failure;

				expect(result.instance).toEqual('failure');
				expect(result.errorType).toEqual(ErreurMetier.DEMANDE_INCORRECTE);
				expect(localisationAvecCoordonneesRepository.getCommuneList).not.toHaveBeenCalled();
				expect(localisationRepository.getDépartementListByNom).not.toHaveBeenCalled();
				expect(localisationRepository.getRégionListByNom).not.toHaveBeenCalled();

			});
		});
		it('renvoie la liste des communes, départements et régions correspondants à la recherche', async () => {
			const listeLocalisationUseCase = new RechercherLocalisationUseCase(localisationRepository, localisationAvecCoordonneesRepository);
			vi.spyOn(localisationAvecCoordonneesRepository, 'getCommuneList').mockResolvedValue(createSuccess(aRésultatsRechercheCommune()));
			vi.spyOn(localisationRepository, 'getDépartementListByNom').mockResolvedValue(createSuccess(aDépartementList()));
			vi.spyOn(localisationRepository, 'getRégionListByNom').mockResolvedValue(createSuccess(aRégionList()));

			const expected: RechercheLocalisation = {
				communeList: aCommuneList(),
				departementList: aDépartementList(),
				regionList: aRégionList(),
			};
			const { result } = await listeLocalisationUseCase.handle('Haut') as Success<RechercheLocalisation>;

			expect(result).toEqual(expected);
		});
	});
	describe('Lorsque la récupération de la liste des communes échoue', () => {
		it('renvoie une erreur', async () => {
			const listeLocalisationUseCase = new RechercherLocalisationUseCase(localisationRepository, localisationAvecCoordonneesRepository);
			vi.spyOn(localisationAvecCoordonneesRepository, 'getCommuneList').mockResolvedValue(createFailure(ErreurMetier.SERVICE_INDISPONIBLE));

			const result = await listeLocalisationUseCase.handle('Haut') as Failure;

			expect(result.instance).toEqual('failure');
			expect(result.errorType).toEqual(ErreurMetier.SERVICE_INDISPONIBLE);
		});
	});
});

