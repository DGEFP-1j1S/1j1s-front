import Joi from 'joi';

export interface ApiAlternanceLieuFormation {
	adresse: {
		code_postal: string | null
		commune: { nom: string }
		label: string | null
	};
	geolocalisation: { coordinates: [longitude: number, latitude: number] };
}

export interface ApiAlternanceFormationResponse {
	certification: {
		valeur: {
			identifiant: { cfd: string | null }
			intitule: {
				cfd: { long: string } | null
				niveau: {
					cfd: { europeen: string | null } | null
					rncp: { europeen: string | null } | null
				}
				rncp: string | null
			}
		}
	}
	contenu_educatif: {
		contenu: string
		objectif: string
	}
	formateur: {
		organisme: {
			etablissement: { enseigne: string | null }
			unite_legale: { raison_sociale: string }
		} | null
	}
	identifiant: { cle_ministere_educatif: string }
	lieu: ApiAlternanceLieuFormation
	modalite: { duree_indicative: number }
}

export interface ApiAlternanceFormationRechercheResponse {
	data: Array<ApiAlternanceFormationResponse>
}

const formationSchema = Joi.object({
	certification: Joi.object({
		valeur: Joi.object({
			identifiant: Joi.object({
				cfd: Joi.string().allow(null),
			}),
			intitule: Joi.object({
				cfd: Joi.object({
					long: Joi.string(),
				}).allow(null),
				niveau: Joi.object({
					cfd: Joi.object({
						europeen: Joi.string().allow(null),
					}).allow(null),
					rncp: Joi.object({
						europeen: Joi.string().allow(null),
					}).allow(null),
				}),
				rncp: Joi.string().allow(null),
			}),
		}),
	}),
	contenu_educatif: Joi.object({
		contenu: Joi.string().allow(''),
		objectif: Joi.string().allow(''),
	}),
	formateur: Joi.object({
		organisme: Joi.object({
			etablissement: Joi.object({
				enseigne: Joi.string().allow(null),
			}),
			unite_legale: Joi.object({
				raison_sociale: Joi.string(),
			}),
		}).allow(null),
	}),
	identifiant: Joi.object({
		cle_ministere_educatif: Joi.string(),
	}),
	lieu: Joi.object({
		adresse: Joi.object({
			code_postal: Joi.string().allow(null),
			commune: Joi.object({
				nom: Joi.string(),
			}),
			label: Joi.string().allow(null),
		}),
		geolocalisation: Joi.object({
			coordinates: Joi.array().items(Joi.number()).length(2),
		}),
	}),
	modalite: Joi.object({
		duree_indicative: Joi.number(),
	}),
}).options({ allowUnknown: true, presence: 'required' });

export const apiAlternanceFormationValidationSchemas = {
	get: formationSchema.required(),
	search: Joi.object({
		data: Joi.array().items(formationSchema),
	}).options({ allowUnknown: true, presence: 'required' }).required(),
};
