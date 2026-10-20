import classNames from 'classnames';
import React from 'react';

import { Icon } from '~/client/components/ui/Icon/Icon';
import { SquareMeter } from '~/client/components/ui/SquareMeter/SquareMeter';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { DateService } from '~/client/services/date/date.service';
import formatLocalisation from '~/client/utils/formatLocalisation.util';
import { AnnonceDeLogement } from '~/server/logements/domain/annonceDeLogement';

import styles from './ConsulterAnnonce.module.scss';

interface InformationsGénéralesProps {
	annonce: AnnonceDeLogement;
}

function formatterÉtage(étage: number) {
	return (
		étage === 0 && 'Rez-de-chaussée'
		|| étage === 1 && '1er'
		|| `${étage}ème`
	);
}

function formatterNombreDePieces(nombreDePieces: number){
	return nombreDePieces || 'non renseigné';
}

export function InformationsGénérales({
	annonce: {
		prix,
		charge,
		devise,
		surface,
		surfaceMax,
		garantie,
		nombreDePièces,
		étage,
		typeBien,
		meublé,
		localisation,
		dateDeDisponibilité,
	},
}: InformationsGénéralesProps) {
	const dateService = useDependency<DateService>('dateService');
	const localisationAffichable = formatLocalisation(localisation);
	return (
		<section className={classNames(styles.card, styles.informationsGenerales)} aria-labelledby="informations-annonce-title">
			<h2 id="informations-annonce-title">Informations générales</h2>
			<table>
				<caption><Icon name='euro' aria-hidden={false} aria-label="Prix" /></caption>
				<tbody>
					<tr>
						<th scope="row">Prix</th>
						<td>{prix} {devise}<abbr title="Charges Comprises">CC</abbr>/mois</td>
					</tr>
					{garantie != null && (
						<tr>
							<th scope="row">Caution</th>
							<td>{garantie} {devise}</td>
						</tr>
					)}
					{charge != null && (
						<tr>
							<th scope="row">Charges</th>
							<td>{charge} {devise}</td>
						</tr>
					)}
				</tbody>
			</table>
			<table>
				<caption><Icon name='community' aria-hidden={false} aria-label="Informations du logement" /></caption>
				<tbody>
					<tr>
						<th scope="row">Surface</th>
						{(surfaceMax != null && surfaceMax != 0)
							? <td>{surface} à {surfaceMax} <SquareMeter /></td>
							: <td>{surface}<SquareMeter /></td>}
					</tr>
					<tr>
						<th scope="row">Nombre de pièces</th>
						<td>{formatterNombreDePieces(nombreDePièces)}</td>
					</tr>
					{étage != null && (
						<tr>
							<th scope="row">Étage</th>
							<td>
								{formatterÉtage(étage)}
							</td>
						</tr>
					)}
					<tr>
						<th scope="row">Type de bien</th>
						<td>{typeBien}</td>
					</tr>
					<tr>
						<th scope="row">Meublé</th>
						<td>{meublé ? 'Oui' : 'Non'}</td>
					</tr>
				</tbody>
			</table>
			{localisationAffichable && (
				<table className={styles.localisation}>
					<caption><Icon name='roadmap' aria-hidden={false} aria-label="Localisation" /></caption>
					<tbody>
						<tr>
							<th scope="row">Localisation</th>
							<td>{localisationAffichable}</td>
						</tr>
					</tbody>
				</table>
			)}
			<table className={styles.disponibilite}>
				<caption><Icon name='suitcase' aria-hidden={false} aria-label="Disponibilité" /></caption>
				<tbody>
					<tr>
						<th scope="row">Disponible</th>
						<td>le <time dateTime={dateDeDisponibilité.toISOString()}>
							{dateService.formatToHumanReadableDate(dateDeDisponibilité)}
						</time>
						</td>
					</tr>
				</tbody>
			</table>
		</section>
	);
}
