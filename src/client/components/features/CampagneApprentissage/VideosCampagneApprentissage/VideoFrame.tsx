import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import styles
	from '~/client/components/features/CampagneApprentissage/VideosCampagneApprentissage/VideoFrame.module.scss';
import { ButtonComponent } from '~/client/components/ui/Button/ButtonComponent';
import { Icon } from '~/client/components/ui/Icon/Icon';
import { Image } from '~/client/components/ui/Img';
import { Link } from '~/client/components/ui/Link/Link';
import { useDependency } from '~/client/context/dependenciesContainer.context';
import { VideoService } from '~/client/services/video/video.service';
import { VideoCampagneApprentissage } from '~/server/campagne-apprentissage/domain/videoCampagneApprentissage';

const YOUTUBE_THUMBNAIL_URL = 'https://img.youtube.com/vi/';

interface VideoFrameProps extends React.ComponentPropsWithoutRef<'div'> {
	videoToDisplay: VideoCampagneApprentissage,
}

function useYoutubeService(): [boolean, VideoService['allow']] {
	const youtubeService = useDependency<VideoService>('youtubeService');
	const [isAllowed, setIsAllowed] = useState(youtubeService.isAllowed());

	useEffect(function listenToCookieConsentChanges() {
		function updateCookieSettings() {
			setIsAllowed(youtubeService.isAllowed());
		}

		document.addEventListener('youtube_loaded', updateCookieSettings);
		document.addEventListener('youtube_added', updateCookieSettings);
		document.addEventListener('youtube_allowed', updateCookieSettings);
		document.addEventListener('youtube_disallowed', updateCookieSettings);
		return () => {
			document.removeEventListener('youtube_loaded', updateCookieSettings);
			document.removeEventListener('youtube_added', updateCookieSettings);
			document.removeEventListener('youtube_allowed', updateCookieSettings);
			document.removeEventListener('youtube_disallowed', updateCookieSettings);
		};
	}, [youtubeService]);

	return [isAllowed, () => youtubeService.allow()];
}

export function VideoFrame({ videoToDisplay, className }: VideoFrameProps) {
	const [youtubeAllowed, allowYoutube] = useYoutubeService();

	return (
		<div className={classNames(styles.video, className)}>
			{youtubeAllowed ? (
				<iframe
					width="326"
					height="180"
					src={`https://www.youtube-nocookie.com/embed/${videoToDisplay.videoId}`}
					title={videoToDisplay.titre}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
					className={styles.iframe} />
			) : (
				<>
					<Image
						src={`${YOUTUBE_THUMBNAIL_URL}${videoToDisplay.videoId}/0.jpg`}
						alt={''}
						width="326"
						height="180"
						className={styles.placeholderThumbnail} />
					<div className={styles.placeholderContainer}>
						<div className={styles.placeholderContent}>
							<p>
							Cette vidéo est hébergée par <Link href="https://www.youtube.com/t/terms" className={styles.linkToYoutubeTerms}>
							youtube.com
									<Link.Icon />
								</Link>
							</p>
							<p>
							En l’affichant, vous acceptez ses conditions d’utilisation et les potentiels cookies déposés
							par ce site.
							</p>
							<ButtonComponent
								label={'Accepter les cookies'}
								onClick={allowYoutube}
								appearance={'secondary'}
								className={styles.buttonAcceptCookies}
								icon={<Icon name="check-line" />}
								iconPosition="right" />
						</div>
					</div>
				</>
			)
			}
		</div>
	);
}
