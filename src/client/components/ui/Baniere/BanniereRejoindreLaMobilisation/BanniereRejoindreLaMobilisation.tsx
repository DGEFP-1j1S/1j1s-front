import { Link } from '~/client/components/ui/Link/Link';

export default function BanniereRejoindreLaMobilisation() {

	return (
		<section className="fr-container fr-py-6w">
			<h2>Les entreprises s’engagent, une mobilisation des entreprises pour l’emploi des
				jeunes</h2>
			<p>Rejoignez les entreprises déjà engagées, et bénéficiez de services inédits : un accompagnement personnalisé si
				vous le souhaitez et des aides pour communiquer, </p>
			<Link className="fr-btn fr-btn--lg fr-btn--secondary" href="/les-entreprises-s-engagent">Rejoindre la
				mobilisation</Link>
		</section>
	);
}
