import { Image } from '~/client/components/props';

export interface AnnonceDeLogement {
	titre: string
	type: string
	typeBien: string
	dateDeMiseAJour: Date
	surface: number
	surfaceMax?: number
	nombreDePieces: number
	etage?: number
	prix: number
	prixHT?: number
	charge?: number
	garantie?: number
	dateDeDisponibilite: Date
	meuble: boolean
	localisation: AnnonceDeLogementLocalisation
	description: string
	devise: string
	imageList: Array<Image>
	servicesInclus: Array<AnnonceDeLogementService>
	servicesOptionnels: Array<AnnonceDeLogementService>
	source: AnnonceDeLogementSource
	urlDeCandidature: string
	bilanEnergetique: AnnonceDeLogementBilanEnergetique
}

export interface AnnonceDeLogementLocalisation {
    ville?: string
    adresse?: string
    departement?: string
    codePostal?: string
    region?: string
    pays?: string
}

export interface AnnonceDeLogementBilanEnergetique {
    consommationEnergetique?: AnnonceDeLogementCategorieEnergetique,
    emissionDeGaz?: AnnonceDeLogementCategorieEnergetique
}

export type AnnonceDeLogementCategorieEnergetique = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export enum AnnonceDeLogementService {
    ASCENSEUR = 'ascenseur',
    ASPIRATEUR = 'aspirateur',
    CAVE = 'cave',
    FER_A_REPASSER = 'fer à repasser',
    FIBRE_OPTIQUE = 'fibre optique',
    FOUR = 'four',
    GARAGE = 'garage',
    GARDIEN_RESIDENCE = 'gardien résidentiel',
    INTERNET = 'internet',
    LAVE_LINGE = 'machine à laver',
    LAVE_VAISSELLE = 'lave vaisselle',
    LOCAL_A_VELO = 'local à vélo',
    MICRO_ONDE = 'micro-onde',
    NECESSAIRE_DE_NETTOYAGE = 'nécessaire de nettoyage',
    PARKING = 'parking',
    PISCINE = 'piscine',
    REFRIGERATEUR = 'réfrigérateur',
    SALLE_DE_BAIN_PRIVATIVE = 'salle de bain privative',
    SALLE_DE_SPORT = 'salle de sport',
    SECHE_LINGE = 'sèche linge',
    TERRACE = 'terrace',
    TV = 'télévision',
    NON_RENSEIGNE = 'non renseigné',
}

export type AnnonceDeLogementSource = 'immojeune' | 'studapart'

export const NOMS_DES_SOURCES: Record<AnnonceDeLogementSource, string> = {
	immojeune: "ImmoJeune",
	studapart: "Studapart",
};
