import React from 'react';

import { BilanEnergetiqueLogement } from '~/client/components/features/Logement/Consulter/BilanEnergetiqueLogement';
import { Image } from "~/client/components/ui/Img";
import { Link } from '~/client/components/ui/Link/Link';
import { SquareMeter } from "~/client/components/ui/SquareMeter/SquareMeter";
import { useDependency } from "~/client/context/dependenciesContainer.context";
import { DateService } from "~/client/services/date/date.service";
import formatLocalisation from "~/client/utils/formatLocalisation.util";
import { AnnonceDeLogement, AnnonceDeLogementService, NOMS_DES_SOURCES } from "~/server/logements/domain/annonceDeLogement";

interface ConsulterAnnonceDeLogementProps {
	annonceDeLogement: AnnonceDeLogement
	slug: string
}

function formatterEtage(etage: number) {
	if (etage === 0) return "Rez-de-chaussée";
	if (etage === 1) return "1er";
	return `${etage}ème`;
}

function formatterNombreDePieces(nombreDePieces: number) {
	return nombreDePieces || "non renseigné";
}

type ServiceAffichable = Exclude<AnnonceDeLogementService, AnnonceDeLogementService.NON_RENSEIGNE>

function ListeDeServices({ services, messageSiVide }: { services: Array<AnnonceDeLogementService>, messageSiVide: string }) {
	const servicesAffichables = services.filter(
		(service): service is ServiceAffichable => service !== AnnonceDeLogementService.NON_RENSEIGNE,
	);
	if (servicesAffichables.length === 0) {
		return <p className="fr-mb-0">{messageSiVide}</p>;
	}
	return (
		<ul className="fr-grid-row fr-p-0 fr-m-0 list-style-none">
			{servicesAffichables.map((service) => (
				<li key={service} className="fr-col-6 fr-pb-2w">
					{service.charAt(0).toUpperCase() + service.slice(1)}
				</li>
			))}
		</ul>
	);
}

export function ConsulterAnnonce({ annonceDeLogement, slug }: ConsulterAnnonceDeLogementProps) {
	const {
		dateDeMiseAJour,
		typeBien,
		titre,
		description,
		source,
		urlDeCandidature,
		bilanEnergetique,
		nombreDePièces,
		surface,
		surfaceMax,
		étage,
		meublé,
		localisation,
		prix,
		devise,
		garantie,
		charge,
		dateDeDisponibilité,
		imageList,
	} = annonceDeLogement;

	const nomDeLaSource: string | undefined = NOMS_DES_SOURCES[source];
	const localisationAffichable = formatLocalisation(localisation);
	const dateService = useDependency<DateService>("dateService");
	const lienVersLesPhotos = `/logements/annonces/${slug}/photos`;
	const imageApercu = imageList[0];

	return (
		<div className="fr-container">
			<h1>{titre}</h1>
			<div className="fr-grid-row fr-grid-row--gutters align-items--center fr-mb-2w">
				<div className="fr-col-auto">
					<p className="fr-mb-0">
						{nomDeLaSource && <>Ce bien est diffusé par {nomDeLaSource} : </>}Annonce mise à jour le <time dateTime={dateDeMiseAJour.toISOString()}>{dateService.formatToHumanReadableDate(dateDeMiseAJour)}</time>
					</p>
				</div>
				<div className="fr-col-auto fr-ml-auto">
					<Link
						className="fr-btn fr-btn--lg"
						href={urlDeCandidature}>
						Voir l‘annonce
					</Link>
				</div>
			</div>
			{imageApercu && (
				<div className="fr-grid-row fr-grid-row--center background--blue-france fr-mb-4w">
					<div className="fr-col-12 fr-col-md-8" style={{ position: "relative" }}>
						<Image
							src={imageApercu.src}
							alt={imageApercu.alt || ""}
							width={800}
							height={400}
							className="img-contain"
							style={{ display: "block" }} />
						{imageList.length > 1 && (
							<div style={{ backgroundColor: "var(--background-default-grey)", bottom: "0.75rem", position: "absolute", right: "0.75rem" }}>
								<Link
									href={lienVersLesPhotos}
									className="fr-btn fr-btn--secondary fr-btn--icon-right fr-icon-image-line">
									Voir les photos<span className="sr-only"> ({imageList.length})</span>
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
			<div className="fr-grid-row fr-grid-row--gutters">
				<div className="fr-col-12 fr-col-md-4">
					<div className="border--blue fr-p-3w">
						<h2 className="fr-h4">Informations générales</h2>
						<div className="background--blue-ecume fr-p-3v fr-mb-3w">
							<h3 className="fr-text--md">Type de bien</h3>
							<dl className="fr-p-0 fr-m-0">
								<div className="fr-grid-row">
									<dt>Nombre de pièces</dt>
									<dd className="fr-ml-auto fr-text--bold">{formatterNombreDePieces(nombreDePièces)}</dd>
								</div>
								<div className="fr-grid-row">
									<dt>Surface</dt>
									{(surfaceMax != null && surfaceMax !== 0)
										? <dd className="fr-ml-auto fr-text--bold">{surface} à {surfaceMax} <SquareMeter /></dd>
										: <dd className="fr-ml-auto fr-text--bold">{surface} <SquareMeter /></dd>}
								</div>
								{étage != null && (
									<div className="fr-grid-row">
										<dt>Étage</dt>
										<dd className="fr-ml-auto fr-text--bold">{formatterEtage(étage)}</dd>
									</div>
								)}
								<div className="fr-grid-row">
									<dt>Type de bien</dt>
									<dd className="fr-ml-auto fr-text--bold">{typeBien}</dd>
								</div>
								<div className="fr-grid-row">
									<dt>Meublé</dt>
									<dd className="fr-ml-auto fr-text--bold">{meublé ? "Oui" : "Non"}</dd>
								</div>
							</dl>
						</div>
						{localisationAffichable && (
							<div className="background--blue-ecume fr-p-3v fr-mb-3w">
								<h3 className="fr-text--md">Localisation</h3>
								<p className="fr-mb-0">{localisationAffichable}</p>
							</div>
						)}
						<div className="background--blue-ecume fr-p-3v fr-mb-3w">
							<h3 className="fr-text--md">Coûts</h3>
							<dl className="fr-p-0 fr-m-0">
								<div className="fr-grid-row">
									<dt>Prix</dt>
									<dd className="fr-ml-auto fr-text--bold">{prix} {devise} <abbr title="Charges Comprises">CC</abbr>/mois</dd>
								</div>
								{garantie != null && (
									<div className="fr-grid-row">
										<dt>Caution</dt>
										<dd className="fr-ml-auto fr-text--bold">{garantie} {devise}</dd>
									</div>
								)}
								{charge != null && (
									<div className="fr-grid-row">
										<dt>Charges</dt>
										<dd className="fr-ml-auto fr-text--bold">{charge} {devise}</dd>
									</div>
								)}
							</dl>
						</div>
						<div className="background--blue-ecume fr-p-3v">
							<h3 className="fr-text--md">Disponibilité</h3>
							<p className="fr-mb-0">
								Disponible le <time dateTime={dateDeDisponibilité.toISOString()}>
									{dateService.formatToHumanReadableDate(dateDeDisponibilité)}
								</time>
							</p>
						</div>
					</div>
				</div>
				<div className="fr-col-12 fr-col-md-8">
					<div className="border--blue fr-p-3w fr-mb-4w">
						<h2 className="fr-h4">Description du logement</h2>
						<p className="fr-mb-0">{description}</p>
					</div>
					<div className="border--blue fr-p-3w fr-mb-4w">
						<h2 className="fr-h4">Équipements et services inclus</h2>
						<ListeDeServices services={annonceDeLogement.servicesInclus} messageSiVide="Aucun service inclus" />
					</div>
					<div className="border--blue fr-p-3w fr-mb-4w">
						<h2 className="fr-h4">Équipements et services optionnels</h2>
						<ListeDeServices services={annonceDeLogement.servicesOptionnels} messageSiVide="Aucun service optionnel" />
					</div>
					<BilanEnergetiqueLogement
						consommationEnergetique={bilanEnergetique.consommationEnergetique}
						emissionDeGaz={bilanEnergetique.emissionDeGaz} />
				</div>
			</div>
		</div>
	);
}
