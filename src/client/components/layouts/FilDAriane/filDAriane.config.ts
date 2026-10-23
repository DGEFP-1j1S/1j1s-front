import { type BreadcrumbItem } from "~/client/dsfr";

export type FilDArianePageProps = Record<string, unknown>;

type LabelResolver = string | ((pageProps: FilDArianePageProps) => string | undefined);

export interface FilDArianeEntry {
	parents: BreadcrumbItem[];
	label: LabelResolver;
}

function fromProp(objectKey: string, fieldKey: string, fallback?: string) {
	return (pageProps: FilDArianePageProps): string | undefined => {
		const object = pageProps[objectKey] as Record<string, unknown> | undefined;
		const value = object?.[fieldKey];
		return typeof value === "string" && value.length > 0 ? value : fallback;
	};
}

function capitalize(value?: string) {
	return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : undefined;
}

const emplois: BreadcrumbItem = { href: "/emplois", label: "Emplois" };
const emploisEurope: BreadcrumbItem = { href: "/emplois-europe", label: "Emplois en Europe" };
const stages: BreadcrumbItem = { href: "/stages", label: "Stages d'études" };
const jeRecrute: BreadcrumbItem = { href: "/je-recrute", label: "Je recrute" };
const etape1DeposerOffreStage: BreadcrumbItem = { href: "/stages/deposer-offre", label: "Votre entreprise" };
const etape2DeposerOffreStage: BreadcrumbItem = { href: "/stages/deposer-offre/votre-offre-de-stage", label: "Votre offre de stage" };
const stages3eEt2de: BreadcrumbItem = { href: "/stages-3e-et-2de", label: "Stages de 3e et 2de" };
const alternance: BreadcrumbItem = { href: "/apprentissage", label: "Contrats d'alternance" };
const jobsEte: BreadcrumbItem = { href: "/jobs-ete", label: "Jobs d'été" };
const jobsEtudiants: BreadcrumbItem = { href: "/jobs-etudiants", label: "Jobs étudiants" };
const formationsInitiales: BreadcrumbItem = { href: "/formations-initiales", label: "Formations initiales" };
const formationsApprentissage: BreadcrumbItem = { href: "/formations/apprentissage", label: "Formations en apprentissage" };
const decouvrirLesMetiers: BreadcrumbItem = { href: "/decouvrir-les-metiers", label: "Découvrir les métiers" };
const benevolat: BreadcrumbItem = { href: "/benevolat", label: "Bénévolat" };
const serviceCivique: BreadcrumbItem = { href: "/service-civique", label: "Service civique" };
const annoncesLogement: BreadcrumbItem = { href: "/logements/annonces", label: "Annonces de logement" };
const immersions: BreadcrumbItem = { href: "/immersions", label: "Je propose des immersions" };
const faq: BreadcrumbItem = { href: "/faq", label: "FAQ" };
const actualites: BreadcrumbItem = { href: "/actualites", label: "Actualités" };

export const filDArianeConfig: Record<string, FilDArianeEntry> = {
	"/1jeune1permis": { label: "Aides au permis de conduire", parents: [] },
	"/accessibilite": { label: "Accessibilité", parents: [] },
	"/accompagnement": { label: "Trouver une structure d'accompagnement", parents: [] },
	"/actualites": { label: "Actualités", parents: [] },
	"/apprentissage": { label: "Contrats d'alternance", parents: [] },
	"/apprentissage-entreprises": { label: "Les avantages de l'apprentissage pour les entreprises", parents: [] },
	"/apprentissage/[id]": { label: fromProp("alternanceSerialized", "titre"), parents: [alternance] },
	"/apprentissage/deposer-offre": { label: "Déposer une offre d'alternance", parents: [alternance] },
	"/apprentissage/entreprise/[id]": { label: "Candidature spontanée", parents: [alternance] },
	"/articles/[id]": { label: fromProp("article", "titre"), parents: [actualites] },
	"/benevolat": { label: "Bénévolat", parents: [] },
	"/benevolat/[id]": { label: fromProp("missionEngagement", "titre"), parents: [benevolat] },
	"/cgu": { label: "Conditions générales d'utilisation", parents: [] },
	"/choisir-apprentissage": { label: "Découvrir et trouver sa voie avec l'apprentissage", parents: [] },
	"/confidentialite": { label: "Politique de confidentialité", parents: [] },
	"/contrat-engagement-jeune": { label: "Contrat Engagement Jeune", parents: [] },
	"/creer-mon-cv": { label: "Créer son CV personnalisé", parents: [] },
	"/decouvrir-les-metiers": { label: "Découvrir les métiers", parents: [] },
	"/decouvrir-les-metiers/[nomMetier]": {
		label: (pageProps) => capitalize(fromProp("ficheMetier", "nomMetier")(pageProps)),
		parents: [decouvrirLesMetiers],
	},
	"/emplois": { label: "Emplois", parents: [] },
	"/emplois-europe": { label: "Emplois en Europe", parents: [] },
	"/emplois-europe/[id]": { label: fromProp("annonceEmploiEurope", "titre", "Offre d'emploi sans titre"), parents: [emploisEurope] },
	"/emplois/[id]": { label: fromProp("offreEmploi", "intitulé"), parents: [emplois] },
	"/emplois/deposer-offre": { label: "Déposer une offre d'emploi", parents: [emplois] },
	"/entreprendre": { label: "Entreprendre : financements, aides et accompagnement", parents: [] },
	"/espace-jeune": { label: "Actualités et services jeunes", parents: [] },
	"/evenements": { label: "Participer à des évènements", parents: [] },
	"/experience-europe": { label: "Expérience en Europe", parents: [] },
	"/faq": { label: "FAQ", parents: [] },
	"/faq/[id]": { label: fromProp("faqRéponse", "problématique"), parents: [faq] },
	"/formations-initiales": { label: "Formations initiales", parents: [] },
	"/formations-initiales/[id]": { label: fromProp("formationInitialeDetail", "libelle"), parents: [formationsInitiales] },
	"/formations/apprentissage": { label: "Formations en apprentissage", parents: [] },
	"/formations/apprentissage/[id]": { label: fromProp("formation", "titre"), parents: [formationsApprentissage] },
	"/immersions": { label: "Je propose des immersions", parents: [] },
	"/immersions/referencer-mon-entreprise": { label: "Je référence mon entreprise", parents: [immersions] },
	"/je-deviens-mentor": { label: "Je deviens mentor", parents: [] },
	"/je-recrute": { label: "Je recrute", parents: [] },
	"/je-recrute-afpr-poei": { label: "Je forme les jeunes grâce à l'emploi", parents: [] },
	"/jobs-ete": { label: "Jobs d'été", parents: [] },
	"/jobs-ete/[id]": { label: fromProp("jobEte", "intitulé"), parents: [jobsEte] },
	"/jobs-etudiants": { label: "Jobs étudiants", parents: [] },
	"/jobs-etudiants/[id]": { label: fromProp("jobÉtudiant", "intitulé"), parents: [jobsEtudiants] },
	"/les-entreprises-s-engagent": { label: "Rejoindre la mobilisation", parents: [] },
	"/logements/aides-logement": { label: "Aides financières au logement", parents: [] },
	"/logements/annonces": { label: "Annonces de logement", parents: [] },
	"/logements/annonces/[id]": { label: fromProp("annonceDeLogement", "titre"), parents: [annoncesLogement] },
	"/logements/conseils": { label: "Conseils logement", parents: [] },
	"/mentions-legales": { label: "Mentions légales", parents: [] },
	"/mentorat": { label: "Échanger avec un mentor", parents: [] },
	"/mes-aides": { label: "Simulateur d'aides financières", parents: [] },
	"/mesures-employeurs": { label: "Découvrir les mesures employeurs", parents: [] },
	"/mon-espace": { label: "Mon espace employeur", parents: [] },
	"/myjobglasses": { label: "Échanger avec des professionnels", parents: [] },
	"/plan-du-site": { label: "Plan du site", parents: [] },
	"/service-civique": { label: "Service civique", parents: [] },
	"/service-civique/[id]": { label: fromProp("missionEngagement", "titre"), parents: [serviceCivique] },
	"/services-jeunes": { label: "Services jeunes", parents: [] },
	"/stages": { label: "Stages d'études", parents: [] },
	"/stages-3e-et-2de": { label: "Stages de 3e et 2de", parents: [] },
	"/stages-3e-et-2de/candidater": { label: "Candidater", parents: [stages3eEt2de] },
	"/stages/[id]": { label: fromProp("offreDeStage", "titre"), parents: [stages] },
	"/stages/deposer-offre": { label: "Votre entreprise", parents: [jeRecrute] },
	"/stages/deposer-offre/confirmation-envoi": { label: "Déposer une offre de stage", parents: [jeRecrute] },
	"/stages/deposer-offre/localisation": { label: "Localisation du stage", parents: [jeRecrute, etape1DeposerOffreStage, etape2DeposerOffreStage] },
	"/stages/deposer-offre/votre-offre-de-stage": { label: "Votre offre de stage", parents: [jeRecrute, etape1DeposerOffreStage] },
};
