import { GetStaticPropsResult } from 'next';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { ServicesJeunes } from '~/client/components/features/ServicesJeunes/ServicesJeunes';
import { Head } from '~/client/components/head/Head';
import { Container } from '~/client/components/layouts/Container/Container';
import { Champ } from '~/client/components/ui/Form/Champ/Champ';
import { SelectMultiple } from '~/client/components/ui/Form/Select/SelectMultiple';
import { LightHero, LightHeroPrimaryText, LightHeroSecondaryText } from '~/client/components/ui/Hero/LightHero';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { TagList } from '~/client/components/ui/Tag/TagList';
import useAnalytics from '~/client/hooks/useAnalytics';
import analytics from '~/pages/espace-jeune/index.analytics';
import { isFailure } from '~/server/errors/either';
import {
	mapCodeCategorieServiceJeuneToLibelle,
	ServiceJeune,
	ServiceJeuneCodeCategorie,
} from '~/server/services-jeunes/domain/servicesJeunes';
import { dependencies } from '~/server/start';

import styles from './index.module.scss';

interface ServicesJeunePageProps {
	serviceJeuneList: Array<ServiceJeune>
}

function isCategorieServiceJeune(filtre: string): filtre is ServiceJeuneCodeCategorie {
	return Object.values(ServiceJeuneCodeCategorie).includes(filtre as ServiceJeuneCodeCategorie);
}

export default function ServicesJeunesPage({ serviceJeuneList }: ServicesJeunePageProps) {
	useAnalytics(analytics);

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const sanitizedFiltreList = searchParams.getAll('filtre').filter(isCategorieServiceJeune);
	const [filtreList, setFiltreList] = useState(sanitizedFiltreList ?? []);
	const filtreListString = sanitizedFiltreList.toString();
	useEffect(() => {
		setFiltreList(sanitizedFiltreList ?? []);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setFiltreList, filtreListString]);

	function updateQueryParams(filtreList: ServiceJeuneCodeCategorie[]) {
		const params = new URLSearchParams();
		filtreList.map((filtre) => {
			params.append('filtre', filtre);
		});
		const pathAndQueryString = pathname + (filtreList.length > 0 ? ('?' + params.toString()) : '');
		router.push(pathAndQueryString, undefined, { shallow: true });
	}

	function toggleFiltreAndUpdateQueryParams(filtre: ServiceJeuneCodeCategorie) {
		let newFiltreList = [];
		if(filtreList.includes(filtre)) {
			newFiltreList = filtreList.filter((element) => element !== filtre);
		} else {
			newFiltreList = filtreList.concat(filtre);
		}
		setFiltreList(newFiltreList);
		updateQueryParams(newFiltreList);
	}

	const servicesJeunesVisibles = filtreList.length > 0
		? serviceJeuneList.filter((service) => { return filtreList.includes(service.categorie.code);})
		: serviceJeuneList;

	return (
		<>
			<Head
				title="Services jeunes | 1jeune1solution"
				robots="index,follow" />
			<main id="contenu">
				<Container className={styles.container}>
					<LightHero>
						<h2>
							<LightHeroPrimaryText>Retrouvez les services conçus pour vous :</LightHeroPrimaryText>
							<LightHeroSecondaryText>
								entrée dans la vie professionnelle, orientation, formation, accompagnement, logement, aides et outils
							</LightHeroSecondaryText>
						</h2>
					</LightHero>
					<SelectionTypeService filtreList={filtreList} toggle={toggleFiltreAndUpdateQueryParams} />
					<ServicesJeunes cardList={servicesJeunesVisibles} />
				</Container>
			</main>
		</>
	);
}

export async function getStaticProps(): Promise<GetStaticPropsResult<ServicesJeunePageProps>> {
	const isServicesJeunesVisible = process.env.NEXT_PUBLIC_OLD_ESPACE_JEUNE_FEATURE === '0';
	if (!isServicesJeunesVisible) {
		return { notFound: true };
	}
	
	const serviceJeuneList = await dependencies.servicesJeunesDependencies.consulterLesServicesJeunesUseCase.handle();
	if (isFailure(serviceJeuneList)) {
		return {
			props: {
				serviceJeuneList: [],
			},
			revalidate: 1,
		};
	}

	return {
		props: {
			serviceJeuneList: JSON.parse(JSON.stringify(serviceJeuneList.result)),
		},
		revalidate: dependencies.cmsDependencies.duréeDeValiditéEnSecondes(),
	};
}

interface SelectionTypeServiceProps {
	filtreList: ServiceJeuneCodeCategorie[]
	toggle: (filtre: ServiceJeuneCodeCategorie) => void
}

function SelectionTypeService({ filtreList, toggle }: SelectionTypeServiceProps) {
	return (
		<form>
			<Champ>
				<Champ.Label>
				Types de services
					<Champ.Label.Complement>Sélectionnez votre/vos choix</Champ.Label.Complement>
				</Champ.Label>
				<Champ.Input
					render={SelectMultiple}
					value={filtreList}
					name={'typeService'}
					onChange={(option) => {
						const filtre = option.dataset.value;
						toggle(filtre as ServiceJeuneCodeCategorie);
					}}
					optionsAriaLabel={'Types de services'}>
					{Object.values(ServiceJeuneCodeCategorie).map((codeCategorie: ServiceJeuneCodeCategorie, index) =>
						<SelectMultiple.Option key={index} value={codeCategorie}>{mapCodeCategorieServiceJeuneToLibelle(codeCategorie)}</SelectMultiple.Option>,
					)}
				</Champ.Input>
				<Champ.Error />
			</Champ>
			<EtiquettesFiltresCliquables filtreList={filtreList} toggle={toggle} />
		</form>
	);
}

interface EtiquettesFiltresCliquablesProps {
	filtreList: ServiceJeuneCodeCategorie[]
	toggle: (filtre: ServiceJeuneCodeCategorie) => void
}

function EtiquettesFiltresCliquables({ filtreList, toggle }: EtiquettesFiltresCliquablesProps) {
	return (
		<TagList className={styles.etiquettes}
			list={filtreList.map((codeCategorie: ServiceJeuneCodeCategorie, index) => {
				const libelle = mapCodeCategorieServiceJeuneToLibelle(codeCategorie);
				return (
					<button key={index}
						title={'Supprimer le filtre ' + libelle}
						onClick={
							(event) => {
								event.preventDefault();
								toggle(codeCategorie);
							}
						}>
						{libelle}
						<Icon name={'close'} />
					</button>
				);
			},
			)} />
	);
}
