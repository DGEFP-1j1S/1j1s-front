import { Head } from '~/client/components/head/Head';
import { Banner } from "~/client/components/ui/Hero/Hero";
import { Link } from "~/client/components/ui/Link/Link";
import { URL_DEPOSER_OFFRE } from "~/pages/stages/deposer-offre/index.page";

export default function DeposerOffreStageEnvoyePage() {
    return (
        <>
            <Head
                title="Dépôt d’offre de stage - Formulaire envoyé | 1jeune1solution"
                robots="index,follow"
            />
            <main id="contenu">
                <Banner>
                    <h1>Merci, votre offre de stage a bien été envoyée</h1>
                </Banner>
                <div className="fr-container fr-mb-5w">
                    <p className="fr-text--lead">Cette offre est soumise à une validation avant sa mise en ligne.</p>
                    <ul className="fr-btns-group fr-btns-group--inline-md">
                        <li>
                            <Link href={URL_DEPOSER_OFFRE} className="fr-btn">
                                Déposer une offre de stage
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="fr-btn fr-btn--secondary">
                                Retourner à l’accueil
                            </Link>
                        </li>
                    </ul>
                </div>
            </main>
        </>
    );
}
