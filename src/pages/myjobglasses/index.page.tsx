import React from "react";

import { Head } from "~/client/components/head/Head";
import { HeroWithButtonLink } from "~/client/components/ui/Hero/HeroWithButtonLink";

const URL_MY_JOB_GLASSES = "https://www.myjobglasses.com/search";

export default function MyJobGlassesPage() {
	return (
		<>
			<Head
				title="Échanger avec des professionnels | 1jeune1solution"
				description="Échanger avec des professionels du métier de votre choix"
				robots="index,follow" />
			<main id="contenu">
				<HeroWithButtonLink
					title="Échanger avec des professionnels"
					content={
						<strong>
							{"Un réseau professionnel à votre disposition\u00a0: 1Jeune1Solution s'est associé à My Job Glasses pour vous permettre de découvrir les métiers."}
						</strong>
					}
					description={"Grâce à un réseau de 82\u00a0000 professionnels qui se rendent disponibles pour répondre à toutes vos questions sur leur métier. Ce service est gratuit et disponible pour tous, sans condition d'âge. Rien de tel que d'échanger avec une personne qui vous présentera son métier, son environnement professionnel et son parcours pour vous aider dans votre choix d'orientation\u00a0!"}
					buttonLabel="Trouver un professionnel"
					buttonHref={URL_MY_JOB_GLASSES}
					imgSrc="/images/myjobglasses-portail.webp"
					imgContain />
			</main>
		</>
	);
}

export function getServerSideProps() {
	if (process.env.NEXT_PUBLIC_MY_JOB_GLASSES_FEATURE != "1")
		return { notFound: true };
	return { props: {} };
}
