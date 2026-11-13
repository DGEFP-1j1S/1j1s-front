import React from "react";

interface ModalProps {
	id: string
	titre: React.ReactNode
}

export function Modal({ id, titre, children }: React.PropsWithChildren<ModalProps>) {
	const titreId = `${id}-title`;

	return (
		<dialog id={id} className="fr-modal" aria-labelledby={titreId}>
			<div className="fr-container fr-container--fluid fr-container-md">
				<div className="fr-grid-row fr-grid-row--center">
					<div className="fr-col-12 fr-col-md-10">
						<div className="fr-modal__body">
							<div className="fr-modal__header">
								<button type="button" className="fr-btn--close fr-btn" aria-controls={id} title="Fermer la modale">
									Fermer
								</button>
							</div>
							<div className="fr-modal__content">
								<h2 id={titreId} className="fr-modal__title">{titre}</h2>
								{children}
							</div>
						</div>
					</div>
				</div>
			</div>
		</dialog>
	);
}
