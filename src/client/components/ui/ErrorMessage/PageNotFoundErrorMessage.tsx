import { ErrorMessageComponent } from '~/client/components/ui/ErrorMessage/ErrorMessageComponent/ErrorMessageComponent';

export const PageNotFoundErrorMessage = () => {
	return (
		<ErrorMessageComponent
			title="Page non trouvée"
			explanationText="La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée."
			solutionText="Si vous avez tapé l’adresse web dans le navigateur, vérifiez qu’elle est correcte. La page n’est peut-être plus disponible. Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d’accueil, ou effectuer une recherche avec notre moteur de recherche en haut de page. Sinon contactez-nous pour que l’on puisse vous rediriger vers la bonne information." />
	);
};


