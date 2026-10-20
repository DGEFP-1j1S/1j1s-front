import { OffreFiltre } from '~/server/offres/domain/offre';

export interface JobEtudiantFiltre extends OffreFiltre {
  grandDomaineList?: string[];
}
