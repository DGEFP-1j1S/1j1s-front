import classNames from 'classnames';
import React, { useState } from 'react';

import { VideoFrame } from '~/client/components/features/CampagneApprentissage/VideosCampagneApprentissage/VideoFrame';
import { Container } from '~/client/components/layouts/Container/Container';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { Link } from '~/client/components/ui/Link/Link';
import { VideoCampagneApprentissage } from '~/server/campagne-apprentissage/domain/videoCampagneApprentissage';

import styles from './VideosCampagneApprentissage.module.scss';

interface VideosCampagneApprentissageProps extends React.HTMLAttributes<HTMLDivElement> {
	titre: React.ReactNode;
	description: string
	videos: Array<VideoCampagneApprentissage>
}

export default function VideosCampagneApprentissage({
	videos,
	titre,
	description,
	className,
}: VideosCampagneApprentissageProps) {
	const [videoToDisplay, setVideoToDisplay] = useState(videos[0]);

	function selectVideo(video: VideoCampagneApprentissage) {
		setVideoToDisplay(video);
		document.getElementById('titre-section-video')?.focus();
	}

	function getVideoButtonIcon(video: VideoCampagneApprentissage) {
		return videoToDisplay === video ?
			<Icon name="arrow-left" /> :
			<Icon name="play-circle" />;
	}

	return (
		<section className={classNames(styles.sectionVideos, className)}>
			<Container className={styles.container}>
				<h2 className={styles.titreSection} id="titre-section-video" tabIndex={-1}>{titre}</h2>
				<VideoFrame videoToDisplay={videoToDisplay} className={styles.video} />
				<details className={styles.transcription}>
					<summary>Lire la transcription</summary>
					<p className={styles.content}>{videoToDisplay.transcription}</p>
				</details>
				<section className={styles.temoignage} aria-labelledby="description-video">
					<p className={styles.titreTemoignage} id="description-video">{description}</p>
					<ul className={styles.boutonsVideosList}>
						{
							videos.map((video, index) => (
								<li key={index}>
									<ButtonComponent
										label={video.titre}
										appearance={'quaternary'}
										onClick={() => {
											selectVideo(video);
										}}
										aria-current={videoToDisplay === video ? true : undefined}
										className={styles.titreVideoButton}
										icon={
											getVideoButtonIcon(video)
										}
										iconPosition="left" />
								</li>
							))
						}
					</ul>
					<div className={styles.lienPlaylistContainer}>
						<Link
							appearance={'asQuaternaryButton'}
							href={'https://www.youtube.com/playlist?list=PL380KraUhZWX2ZY_qMbydLn5lqIXpUvw1'}
							className={styles.lienPlaylist}>
							Découvrir tous les témoignages
							<Link.Icon />
						</Link>
					</div>
				</section>
			</Container>
		</section>
	);
}
