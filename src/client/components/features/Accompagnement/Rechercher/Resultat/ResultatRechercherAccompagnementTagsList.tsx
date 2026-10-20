import styles
	from '~/client/components/features/Accompagnement/Rechercher/Resultat/ResultatRechercherAccompagnement.module.scss';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { Link } from '~/client/components/ui/Link/Link';
import { Tag } from '~/client/dsfr';
import {
	EtablissementAccompagnement,
	TypeEtablissement,
} from '~/server/etablissement-accompagnement/domain/etablissementAccompagnement';

interface tagsListProps {
	etablissement: EtablissementAccompagnement
}

export function RésultatRechercherAccompagnementTagsList({ etablissement }: tagsListProps) {
	const isMissionLocale = etablissement.type === TypeEtablissement.MISSION_LOCALE;

	return (
		<ul className={styles.tags}>
			{etablissement.telephone && (
				<li key="téléphone" aria-label="téléphone de l‘établissement">
					<Tag>
						<Link href={`tel:${etablissement.telephone}`}>
							<Icon name="phone" />{etablissement.telephone}
						</Link>
					</Tag>
				</li>
			)}
			{!isMissionLocale && etablissement.email && (
				<li key="mail" aria-label="email de l‘établissement">
					<Tag>
						<Link href={`mailto:${etablissement.email}`}>
							<Icon name="mail" />{etablissement.email}
						</Link>
					</Tag>
				</li>
			)}
		</ul>
	);
}
