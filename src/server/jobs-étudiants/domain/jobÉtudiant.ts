import { OffreFiltre } from '~/server/offres/domain/offre';

export interface JobÉtudiantFiltre extends OffreFiltre {
  grandDomaineList?: string[];
}
