import { createFailure, createSuccess, Either, isSuccess } from '~/server/errors/either';
import { ErreurMetier } from '~/server/errors/erreurMetier.types';
import { RechercheLocalisation } from '~/server/localisations/domain/localisation';
import { LocalisationRepository } from '~/server/localisations/domain/localisation.repository';
import {
	LocalisationAvecCoordonnéesRepository,
} from '~/server/localisations/domain/localisationAvecCoordonnées.repository';
import RechercheLocalisationUtils from '~/server/localisations/domain/rechercheLocalisationUtils';

const MIN_CHAR_LENGTH_FOR_SEARCH = 3;

export class RechercherLocalisationUseCase {
	constructor(
		private localisationRepository: LocalisationRepository,
		private localisationAvecCoordonnéesRepository: LocalisationAvecCoordonnéesRepository) {
	}

	async handle(recherche: string): Promise<Either<RechercheLocalisation>> {
		if (RechercheLocalisationUtils.isRechercheByNumeroDepartement(recherche)) {
			return this.getLocalisationByNumeroDepartement(recherche);
		} else if (RechercheLocalisationUtils.isRechercheByNumeroCodePostal(recherche)) {
			return this.getLocalisationByNumeroCodePostal(recherche);
		} else {
			return this.getLocalisationByNom(recherche);
		}
	}

	private async getLocalisationByNumeroDepartement(recherche: string): Promise<Either<RechercheLocalisation>> {
		const response = await this.localisationRepository.getDépartementListByNuméroDépartement(recherche);

		if (isSuccess(response)) {
			return createSuccess({
				communeList: [],
				departementList: response.result,
				regionList: [],
			});
		}
		return response;
	}

	private async getLocalisationByNumeroCodePostal(recherche: string): Promise<Either<RechercheLocalisation>> {
		const responseCommuneList = await this.localisationAvecCoordonnéesRepository.getCommuneList(recherche);

		if (isSuccess(responseCommuneList)) {
			return createSuccess({
				communeList: responseCommuneList.result.résultats,
				departementList: [],
				regionList: [],
			});
		}
		return responseCommuneList;
	}

	private async getLocalisationByNom(recherche: string): Promise<Either<RechercheLocalisation>> {
		if (recherche.length < MIN_CHAR_LENGTH_FOR_SEARCH) {
			return createFailure(ErreurMetier.DEMANDE_INCORRECTE);
		}

		const [responseCommuneList, responseDépartementList, responseRégionList] = await Promise.all([
			this.localisationAvecCoordonnéesRepository.getCommuneList(recherche),
			this.localisationRepository.getDépartementListByNom(recherche),
			this.localisationRepository.getRégionListByNom(recherche),
		]);

		if (isSuccess(responseCommuneList) && isSuccess(responseDépartementList) && isSuccess(responseRégionList)) {
			responseCommuneList.result.résultats.sort((a, b) => a.ville.toLowerCase().localeCompare(b.ville.toLowerCase()));

			return createSuccess({
				communeList: responseCommuneList.result.résultats,
				departementList: responseDépartementList.result,
				regionList: responseRégionList.result,
			});
		} else {
			return createFailure(ErreurMetier.SERVICE_INDISPONIBLE);
		}
	}
}
