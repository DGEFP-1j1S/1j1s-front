import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { BanniereApprentissage } from '~/client/components/features/Alternance/Rechercher/BanniereApprentissage';
import {
	FormulaireRechercheAlternance,
} from '~/client/components/features/Alternance/Rechercher/FormulaireRecherche/FormulaireRechercheAlternance';
import { ServiceCardList } from '~/client/components/features/ServiceCard/Card/ServiceCard';
import { Carte } from '~/client/dsfr';
import { DecouvrirApprentissage } from '~/client/components/features/ServiceCard/DecouvrirApprentissage';
import { OnisepMetierPartner } from '~/client/components/features/ServiceCard/OnisepMetierPartner';
import { PassPartner } from '~/client/components/features/ServiceCard/PassPartner';
import { Head } from '~/client/components/head/Head';
import {
	RechercherSolutionLayoutWithTabs,
} from '~/client/components/layouts/RechercherSolution/RechercherSolutionLayoutWithTabs';
import { NoResultErrorMessage } from '~/client/components/ui/ErrorMessage/NoResultErrorMessage';
import { TagList } from '~/client/components/ui/Tag/TagList';
import { useAlternanceQuery } from '~/client/hooks/useAlternanceQuery';
import { formatRechercherSolutionDocumentTitle } from '~/client/utils/formatRechercherSolutionDocumentTitle.util';
import {
	AlternanceContrat,
	AlternanceSource,
	ResultatRechercheAlternance,
	ResultatRechercheAlternanceEntreprise,
	ResultatRechercheAlternanceOffre,
} from '~/server/alternances/domain/alternance';
import { Erreur } from '~/server/errors/erreur.types';

const PREFIX_TITRE_PAGE = 'Rechercher une alternance';

export type RechercherAlternanceProps = {
	erreurRecherche?: Erreur
	resultats?: ResultatRechercheAlternance
}


export default function RechercherAlternance(props: RechercherAlternanceProps) {
	const alternanceQuery = useAlternanceQuery();
	const router = useRouter();

	const nombreResultatsEntreprises = props.resultats?.entrepriseList?.length || 0;
	const nombreResultatsOffres = props.resultats?.offreList?.length || 0;
	const nombreResultats = nombreResultatsEntreprises + nombreResultatsOffres;
	const title = formatRechercherSolutionDocumentTitle(`${PREFIX_TITRE_PAGE}${nombreResultats === 0 ? ' - Aucun résultat' : ''}`);
	const alternanceList = {
		entrepriseList: props.resultats?.entrepriseList || [],
		offreList: props.resultats?.offreList || [],
	};
	const erreurRecherche = props.erreurRecherche;

	function getMessageResultatRecherche(nombreResultats: number) {
		const messageResultatRechercheSplit: string[] = [`${nombreResultats}`];
		if (nombreResultats > 1) {
			messageResultatRechercheSplit.push('résultats');
		} else if (nombreResultats === 1) {
			messageResultatRechercheSplit.push('résultat');
		} else {
			return '';
		}
		if (alternanceQuery.libelleMetier) {
			messageResultatRechercheSplit.push(`pour ${alternanceQuery.libelleMetier}`);
		}
		return messageResultatRechercheSplit.join(' ');
	}

	const étiquettesRecherche = useMemo(() => {
		if (alternanceQuery.ville && alternanceQuery.codePostal) {
			return <TagList list={[`${alternanceQuery.ville} (${alternanceQuery.codePostal})`]} aria-label="Filtres de la recherche" />;
		} else {
			return undefined;
		}
	}, [alternanceQuery.ville, alternanceQuery.codePostal]);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!router.events) {
			return;
		}

		const handleRouteChangeEnd = () => setIsLoading(false);

		router.events.on('routeChangeComplete', handleRouteChangeEnd);
		router.events.on('routeChangeError', handleRouteChangeEnd);

		return () => {
			router.events.off('routeChangeComplete', handleRouteChangeEnd);
			router.events.off('routeChangeError', handleRouteChangeEnd);
		};
	}, [router.events]);

	function onSubmit() {
		setIsLoading(true);
	}

	return (
		<>
			<Head
				title={title}
				description="Des milliers d’alternances sélectionnées pour vous"
				robots="index,follow" />
			<main id="contenu">
				<RechercherSolutionLayoutWithTabs
					bannière={<BanniereApprentissage />}
					erreurRecherche={erreurRecherche}
					étiquettesRecherche={étiquettesRecherche}
					formulaireRecherche={<FormulaireRechercheAlternance onSubmit={onSubmit} />}
					isLoading={isLoading}
					listeSolutionElementTab={[{
						label: 'Contrats d‘alternance',
						listeSolutionElement: <ListeSolutionAlternance alternanceList={alternanceList.offreList} />,
						messageNoResult: <NoResultErrorMessage
							explanationText="Aucun contrat d‘alternance ne correspond à votre recherche."
							solutionText="Vous pouvez consulter les entreprises ou modifier votre recherche." />,
						messageResultatRecherche: getMessageResultatRecherche(alternanceList.offreList.length),
						nombreDeSolutions: alternanceList.offreList.length,
					},
					{
						label: 'Entreprises',
						listeSolutionElement: <ListeSolutionAlternanceEntreprise
							entrepriseList={alternanceList.entrepriseList} />,
						messageNoResult: <NoResultErrorMessage
							explanationText="Aucune entreprise ne correspond à votre recherche."
							solutionText="Vous pouvez consulter les contrats d‘alternance ou modifier votre recherche." />,
						messageResultatRecherche: getMessageResultatRecherche(alternanceList.entrepriseList.length),
						nombreDeSolutions: alternanceList.entrepriseList.length,
					}]} />
					<ServiceCardList heading="Consultez nos articles" aria-label="Liste de nos articles">
						<Carte
							horizontal
							imageSrc="/images/articles/aide-exceptionnelle-apprentissage.svg"
							lien="/articles/l-aide-a-l-apprentissage-l-atout-qu-il-faut-pour-vos-candidatures"
							titre="Une aide exceptionnelle pour l’apprentissage : l’atout qu’il vous faut pour vos candidatures !">
						Découvrez un argument supplémentaire à avancer pour vous faire embaucher
						</Carte>
					</ServiceCardList>

				<ServiceCardList>
					<DecouvrirApprentissage />
					<PassPartner />
					<OnisepMetierPartner />
				</ServiceCardList>
			</main>
		</>
	);
}

function ListeSolutionAlternance({ alternanceList }: { alternanceList: ResultatRechercheAlternanceOffre[] }) {
	if (!alternanceList.length) return null;

	function getTags(alternance: ResultatRechercheAlternanceOffre) {
		const tags = [];
		if (alternance.localisation) tags.push(alternance.localisation);
		if (alternance.source === AlternanceSource.FRANCE_TRAVAIL) {
			tags.push(AlternanceContrat.ALTERNANCE);
			if (alternance.typeDeContrat?.length) tags.push(...alternance.typeDeContrat);
			return tags;
		}
		if (alternance.typeDeContrat?.length) tags.push(...alternance.typeDeContrat);
		if (alternance.niveauRequis) tags.push(alternance.niveauRequis);
		return tags;
	}

	return (
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label="Offres d'alternances">
			{alternanceList.map((alternance) => (
				<li key={alternance.id} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
					<Carte
						titre={alternance.titre}
						lien={`/apprentissage/${alternance.id}`}
						tags={getTags(alternance)}>
						{alternance.entreprise.nom}
					</Carte>
				</li>
			))}
		</ul>
	);
}

function ListeSolutionAlternanceEntreprise({ entrepriseList }: { entrepriseList: ResultatRechercheAlternanceEntreprise[] }) {
	if (!entrepriseList.length) return null;

	function getTags(entreprise: ResultatRechercheAlternanceEntreprise) {
		const tags: string[] = [];
		if (entreprise.nombreSalariés) {
			if (entreprise.nombreSalariés.min === entreprise.nombreSalariés.max && entreprise.nombreSalariés.max > 0) {
				tags.push(`${entreprise.nombreSalariés.min} salariés`);
			} else if (entreprise.nombreSalariés.min !== entreprise.nombreSalariés.max) {
				tags.push(`${entreprise.nombreSalariés.min} à ${entreprise.nombreSalariés.max} salariés`);
			}
		}
		if (entreprise.candidaturePossible) {
			tags.push('Candidature spontanée');
		} else {
			tags.push("Rencontre au sein de l'entreprise");
		}
		return tags;
	}

	function getLienEntreprise(entreprise: ResultatRechercheAlternanceEntreprise) {
		if (entreprise.candidaturePossible) {
			return `http://labonnealternance.apprentissage.beta.gouv.fr/emploi/recruteurs_lba/${entreprise.id}/job?utm_source=1jeune1solution&utm_medium=web&utm_campaign=1j1s_recherche-emploi-candidat`;
		}
		return undefined;
	}

	return (
		<ul className="fr-grid-row fr-grid-row--gutters" aria-label="Entreprises">
			{entrepriseList.map((entreprise, index) => (
				<li key={`${entreprise.id}-${index}`} className="fr-col-lg-4 fr-col-md-6 fr-col-12">
					<Carte
						titre={entreprise.nom}
						lien={getLienEntreprise(entreprise)}
						tags={getTags(entreprise)}>
						{entreprise.secteurs?.length ? entreprise.secteurs.join(', ') : null}
						{entreprise.adresse && <><br />{entreprise.adresse}</>}
					</Carte>
				</li>
			))}
		</ul>
	);
}
