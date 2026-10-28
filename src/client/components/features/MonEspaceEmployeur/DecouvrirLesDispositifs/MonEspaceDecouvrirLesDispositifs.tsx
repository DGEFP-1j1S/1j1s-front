import React from 'react';

import { FoldingSection } from '~/client/components/ui/FoldingSection/FoldingSection';
import { Image } from '~/client/components/ui/Img';

export function MonEspaceDecouvrirLesDispositifs() {
	return (
		<section className="fr-container fr-mb-6w">
			<h2>Découvrir les dispositifs</h2>
			<div className="fr-grid-row fr-grid-row--gutters fr-mb-4w">
				<div className="fr-col-2 fr-hidden fr-unhidden-lg align-items--center">
					<Image src="/images/logos/les-entreprises-s-engagent.svg" alt="" width={150} height={150}
								 className='img-contain'/>
				</div>
				<div className="fr-col-12 fr-col-lg-10">
					<p>
						Rejoignez une communauté d’entreprises mobilisées pour favoriser l’insertion des jeunes La communauté "Les
						entreprises s’engagent" a été lancée par le Président de la République en juillet 2018 dans l’objectif de
						renforcer et de pérenniser le lien entre l’Etat et l’Entreprise en faveur de l’emploi de tous les publics.
					</p>
					<ul>
						<li>
							Fédérer, sur l’ensemble du territoire, les entreprises - ainsi que les grands réseaux d’entreprises et
							partenaires - qui oeuvrent pour une société plus durable et solidaire.
						</li>
						<li>
							Simplifier l’accès à l’information, aux dispositifs et aux aides.
						</li>
						<li>
							Créer des espaces de coopération entre l’Etat et les entreprises pour accompagner le passage à l’action en
							offrant les outils et les moyens permettant à chacun d’agir à son échelle.
						</li>
						<li>
							Valoriser les entreprises qui s’engagent, leurs bonnes pratiques et les actions innovantes qu’elles
							développent.
						</li>
					</ul>
				</div>
			</div>

			<div className={"fr-grid-row fr-grid-row--gutters"}>
				<div className="fr-col-2 fr-hidden fr-unhidden-lg align-items--center">
					<Image src="/images/logos/la-bonne-alternance.svg" alt="" width={150} height={150}
								 className='img-contain'/>
				</div>
				<div className="fr-col-12 fr-col-lg-10">
					<p>
						La plateforme "La bonne alternance" a été créée pour simplifier la mise en relation entre jeunes,
						entreprises et centres de formation dans l’objectif de faciliter les entrées en alternance.
					</p>
					<ul>
						<li>
							Simplifier le dépôt d’offres pour les recruteurs, et leur permettre de publier leurs offres rapidement.
						</li>
						<li>
							Aider les jeunes candidats à trouver des formations et des contrats en alternance.
						</li>
						<li>
							Faciliter les contacts entre candidats, centres de formation et entreprises.
						</li>
						<li>
							Soutenir les PME et TPE dans leurs démarches de recrutement en alternance.
						</li>
					</ul>
				</div>
			</div>
		</section>
	);
}
