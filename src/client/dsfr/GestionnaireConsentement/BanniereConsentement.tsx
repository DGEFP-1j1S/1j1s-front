import Link from 'next/link';

import { Button } from '../Button';

type BanniereConsentementProps = {
	onAccepterTout: () => void
	onRefuserTout: () => void
	onPersonnaliser: () => void
};

export function BanniereConsentement({ onAccepterTout, onRefuserTout, onPersonnaliser }: BanniereConsentementProps) {
	return (
		<div className="fr-consent-banner">
			<h2 className="fr-h6">À propos des cookies sur 1jeune1solution.gouv.fr</h2>
			<div className="fr-consent-banner__content">
				<p className="fr-text--sm">
					Bienvenue ! Nous utilisons des cookies pour améliorer votre expérience et les services disponibles sur ce site.
					Pour en savoir plus, visitez la page <Link href="/confidentialite" prefetch={false}>Politique de confidentialité</Link>.
					Vous pouvez, à tout moment, avoir le contrôle sur les cookies que vous souhaitez activer.
				</p>
			</div>
			<ul className="fr-consent-banner__buttons fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-sm">
				<li>
					<Button type="button" title="Autoriser tous les cookies" label="Tout accepter" onClick={onAccepterTout} />
				</li>
				<li>
					<Button type="button" title="Refuser tous les cookies" label="Tout refuser" onClick={onRefuserTout} />
				</li>
				<li>
					<Button
						type="button"
						appearance="secondary"
						title="Personnaliser les cookies"
						label="Personnaliser"
						onClick={onPersonnaliser} />
				</li>
			</ul>
		</div>
	);
}
