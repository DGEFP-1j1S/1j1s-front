import {
	Mission,
	RésultatsRechercheMission,
} from '~/server/engagement/domain/engagement';
import {
	MissionEngagementResponse,
	RésultatsMissionEngagementResponse,
	RésultatsRechercheMissionEngagementResponse,
} from '~/server/engagement/infra/repositories/apiEngagement.response';

export function mapRésultatsRechercheMission(response: RésultatsRechercheMissionEngagementResponse): RésultatsRechercheMission {
	return {
		nombreRésultats: response.total,
		résultats: mapMissionList(response.hits),
	};
}

const accessibleAuxMineurs = 'Dès 16 ans';
const estAccessibleAuxMineurs = 'yes';

function mapDateDébutContrat(débutContrat: string | undefined): string | undefined {
	if (!débutContrat) return undefined;
	const date = new Date(débutContrat);
	return date.toLocaleDateString('fr-FR');
}

function mapDateDébutContratLong(débutContrat: string | undefined): string | undefined {
	if (!débutContrat) return undefined;
	const date = new Date(débutContrat);
	return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function mapDateDébutContratEtiquette(débutContrat: string | undefined): string | undefined {
	if (!débutContrat) return undefined;
	const date = new Date(débutContrat);
	return `Dès le ${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

export function mapMission(mission: RésultatsMissionEngagementResponse): Mission {
	const { data } = mission;
	const accessibleAuxJeunes = data.openToMinors === estAccessibleAuxMineurs ? accessibleAuxMineurs : undefined;
	const city = data.city || '';
	const departmentName = data.departmentName || '';
	const departmentCode = data.departmentCode || '';
	const region = data.region || '';
	const postalCode = data.postalCode ? `(${data.postalCode})` : '';
	const fullLocalisation = mapFullLocalisation(city, departmentName, departmentCode, region);
	const localisation = city.length > 0 || postalCode.length > 0 ? `${city} ${postalCode}` : undefined;
	const étiquetteList = [accessibleAuxJeunes, localisation, mapDateDébutContratEtiquette(data.startAt)].filter((tag) => tag !== undefined);

	return {
		description: data.description,
		duréeContrat: data.duration,
		débutContrat: mapDateDébutContratLong(data.startAt),
		id: data._id,
		localisation: fullLocalisation,
		nomEntreprise: data.associationName || data.organizationName,
		titre: data.title,
		url: data.applicationUrl,
		étiquetteList,
	};
}

export function mapFullLocalisation(city: string, departmentName: string, departmentCode: string, region: string){
	const cityNotEmpty = city.length > 0;
	const departmentCodeNotEmpty = departmentCode.length > 0;
	const departmentNameNotEmpty = departmentName.length > 0;
	const regionNotEmpty = region.length > 0;

	switch(true) {
		case cityNotEmpty && departmentCodeNotEmpty && departmentNameNotEmpty && (departmentName === region):
			return `${city} (${departmentCode} - ${departmentName})`;
		case (city === departmentName) && departmentCodeNotEmpty && regionNotEmpty:
			return `${city} (${departmentCode} - ${region})`;
		case cityNotEmpty && departmentCodeNotEmpty && departmentNameNotEmpty && regionNotEmpty:
			return `${city} (${departmentCode} - ${departmentName} - ${region})`;
		case cityNotEmpty && departmentCodeNotEmpty && departmentNameNotEmpty:
			return `${city} (${departmentCode} - ${departmentName})`;
		case cityNotEmpty && departmentCodeNotEmpty:
			return `${city} (${departmentCode})`;
		default:
			return `${city}`;
	}
}

export function mapMissionList(missionList: Array<MissionEngagementResponse>): Array<Mission> {
	return missionList.map((mission: MissionEngagementResponse) => {
		const accessibleAuxJeunes = mission.openToMinors === estAccessibleAuxMineurs ? accessibleAuxMineurs : undefined;
		const city = mission.city || '';
		const postalCode = mission.postalCode ? `(${mission.postalCode})` : '';
		const localisation = city.length > 0 || postalCode.length > 0 ? `${city} ${postalCode}` : undefined;
		const étiquetteList = [accessibleAuxJeunes, localisation, mapDateDébutContrat(mission.startAt)].filter((tag) => tag !== undefined);

		return {
			description: mission.description,
			débutContrat: mapDateDébutContrat(mission.startAt),
			id: mission._id,
			logoUrl: mission.organizationLogo,
			nomEntreprise: mission.associationName || mission.organizationName,
			titre: mission.title,
			étiquetteList,
		};
	});
}
