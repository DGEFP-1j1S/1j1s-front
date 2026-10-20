export interface Commune {
  ville: string;
  code: string;
  codePostal: string;
  coordonnées: {
    longitude: number
    latitude: number
  }
}

export interface ResultatsRechercheCommune {
  résultats: Commune[]
}
