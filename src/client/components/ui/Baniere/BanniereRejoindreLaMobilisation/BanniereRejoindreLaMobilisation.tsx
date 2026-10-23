import { Link } from '~/client/components/ui/Link/Link';

export default function BanniereRejoindreLaMobilisation() {

	return (
		<section className="fr-container fr-my-4w">
			<div className="fr-grid-row fr-grid-row--center">
				<h2>Les entreprises s’engagent, une mobilisation des entreprises pour l’emploi des jeunes</h2>
				<Link className="fr-btn fr-btn--lg fr-btn--secondary" href="/les-entreprises-s-engagent">Rejoindre la mobilisation</Link>
			</div>
		</section>
	);
}
