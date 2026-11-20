import { Image } from "~/client/components/ui/Img";
import React from "react";
import { Callout } from "~/client/dsfr/Callout";
import useBreakpoint from "~/client/hooks/useBreakpoint";
import classNames from "classnames";

export function JeDonneMonAvis() {
	return (
		<Callout
			accent="pink-macaron"
			title="Je donne mon avis général sur 1jeune1solution"
			text="Aidez- nous à améliorer le service numérique 1J1S en répondant à quelques questions"
			link={{ href: "https://jedonnemonavis.numerique.gouv.fr/Demarches/4085?preview=true&form=2090", text: "Je donne mon avis"}}
			className="position--relative"
		>
			<ServicesPublicsPlus/>
		</Callout>
	);
}

function ServicesPublicsPlus() {
	const { isSmallScreen } = useBreakpoint();
	const style = isSmallScreen ? {} : { bottom: '2rem', right: '3rem'}

	return (
		<div className={classNames("flex align-items--center", (isSmallScreen ? "fr-mb-1w" : "position--absolute"))} style={style}>
			<p className="fr-h6 fr-mr-1w fr-mb-0 whitespace--pre-line line-height--small">{"SERVICES \nPUBLICS+"}</p>
			<Image alt="" src={"/images/logos/services-publics-plus.svg"} width="38" height="38"/>
		</div>
	)
}
