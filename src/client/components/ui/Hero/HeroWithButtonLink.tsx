import React from 'react';

import { Image } from '~/client/components/ui/Img';

import { Link } from '../Link/Link';

interface HeroWithButtonLinkProps {
  title: React.ReactNode
  content: React.ReactNode
  buttonLabel: string
  buttonLabelSecondary?: string
  buttonHref: string
  buttonHrefSecondary?: string
  imgSrc: string
	imgAlt?: string
	imgContain?: boolean
  additionalInformation?: React.ReactNode
}

export function HeroWithButtonLink(props: HeroWithButtonLinkProps) {
	const { title, content, buttonLabel, buttonLabelSecondary, buttonHref, buttonHrefSecondary, imgSrc, imgAlt, imgContain = false, additionalInformation } = props;

	return (
		<div className="fr-container">
			<div className="fr-grid-row fr-grid-row--gutters">
				<div className="fr-col-lg-6 fr-col-12">
					<div className="fr-pb-4w">
						<h1 className="fr-mb-4w">
							{title}
						</h1>
						<p className="fr-text--lead fr-mb-4w">
							{content}
						</p>
						{ (buttonLabelSecondary && buttonHrefSecondary) ?
							(<ul className="fr-btns-group fr-btns-group--lg fr-btns-group--equisized">
								<li>
									<Link className="fr-btn fr-btn--lg" href={buttonHref}>{buttonLabel}</Link>
								</li>
								<li>
									<Link className="fr-btn fr-btn--lg fr-btn--secondary" href={buttonHrefSecondary}>{buttonLabelSecondary}</Link>	
								</li>
							</ul>) : (
								<Link className="fr-btn fr-btn--lg" href={buttonHref}>{buttonLabel}</Link>
							)
						}
						{additionalInformation}
					</div>
				</div>
				<div className="fr-col-lg-6 fr-col-12 fr-hidden fr-unhidden-lg">
					<Image className={imgContain ? "img-contain" : "img-cover height--full"} src={imgSrc} alt={imgAlt ?? ""} width="810" height="540" priority />
				</div>
			</div>
		</div>
	);
}
