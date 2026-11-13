import NextImage from 'next/image';
import React, { useState } from 'react';

const PLACEHOLDER_SRC = '/images/placeholder.webp';

type StaticSrc = Exclude<React.ComponentPropsWithoutRef<typeof NextImage>['src'], string>
type RemoteSrc = string
type ImplicitDimensions = {
	fill?: React.ComponentPropsWithoutRef<typeof NextImage>['fill']
	width?: React.ComponentPropsWithoutRef<typeof NextImage>['width']
	height?: React.ComponentPropsWithoutRef<typeof NextImage>['height']
}
type Fill = {
	fill: Required<React.ComponentPropsWithoutRef<typeof NextImage>['fill']>
	width?: React.ComponentPropsWithoutRef<typeof NextImage>['width']
	height?: React.ComponentPropsWithoutRef<typeof NextImage>['height']
};
type Dimensions = {
	fill?: React.ComponentPropsWithoutRef<typeof NextImage>['fill']
	width: Required<React.ComponentPropsWithoutRef<typeof NextImage>['width']>
	height: Required<React.ComponentPropsWithoutRef<typeof NextImage>['height']>
};

// NOTE (GAFI 05-12-2024): Next impose d'avoir soit `fill`, soit `width` et `height` au runtime, mais pas dans le typage
export type ImageProps = Omit<React.ComponentPropsWithoutRef<typeof NextImage>, 'width' | 'height' | 'fill' | 'src'>
	& (({ src: StaticSrc } & ImplicitDimensions) | ({ src: RemoteSrc } & (Fill | Dimensions)));
type ImageRef = React.ComponentRef<typeof NextImage>;

export const Image = React.forwardRef<ImageRef, ImageProps>(function Image({
	src,
	onError: onErrorProps = doNothing,
	...props
}, ref) {
	const [error, setError] = useState(false);

	return (
		<NextImage
			{...props}
			src={error ? PLACEHOLDER_SRC : src}
			onError={(...args) => {
				setError(true);
				onErrorProps(...args);
			}}
			ref={ref} />
	);
});

function doNothing() {}
