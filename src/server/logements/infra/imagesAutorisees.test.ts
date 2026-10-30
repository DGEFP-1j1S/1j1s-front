import { filtrerImagesAutorisees, listeDesHotesAutorises } from '~/server/logements/infra/imagesAutorisees';

describe('filtrerImagesAutorisees', () => {
	it('ne garde que les images en https des hôtes autorisés', () => {
		const images = [
			'https://www.studapart.com/a.jpg',
			'https://media.studapart.com/b.jpg',
			'http://www.studapart.com/c.jpg',
			'pas une url',
		];

		expect(filtrerImagesAutorisees(images, ['www.studapart.com'])).toStrictEqual(['https://www.studapart.com/a.jpg']);
	});

	it('accepte les jokers des remotePatterns de next/image', () => {
		const images = ['https://a.amazonaws.com/1.jpg', 'https://a.b.amazonaws.com/2.jpg', 'https://x.y.clever-cloud.com/3.jpg'];

		expect(filtrerImagesAutorisees(images, ['*.amazonaws.com', '**.clever-cloud.com'])).toStrictEqual([
			'https://a.amazonaws.com/1.jpg',
			'https://x.y.clever-cloud.com/3.jpg',
		]);
	});
});

describe('listeDesHotesAutorises', () => {
	it('découpe la configuration en hôtes', () => {
		expect(listeDesHotesAutorises('www.immojeune.com, res.cloudinary.com,')).toStrictEqual(['www.immojeune.com', 'res.cloudinary.com']);
	});
});
