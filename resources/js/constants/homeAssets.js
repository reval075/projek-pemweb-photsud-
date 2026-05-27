/**
 * Homepage image paths — replace files under public/images/ with real Memoforia photos.
 * Gallery entries prefer real booth URLs; local SVG is fallback on error.
 */

export const homeImages = {
    hero: '/images/hero/hero-main.svg',
    philosophy: '/images/events/event-studio.svg',
    photobooth: '/images/events/event-booth.svg',
    rental: '/images/events/event-rental.svg',
    strips: [
        { src: '/images/strips/strip-01.svg', alt: 'Photostrip moment 1', rotate: -8 },
        { src: '/images/strips/strip-02.svg', alt: 'Photostrip moment 2', rotate: 6 },
        { src: '/images/strips/strip-03.svg', alt: 'Photostrip moment 3', rotate: -4 },
        { src: '/images/strips/strip-04.svg', alt: 'Photostrip moment 4', rotate: 10 },
    ],
};

/** Real client booth outputs — keep external URLs; fallback to local placeholders */
export const galleryPhotos = [
    {
        src: 'https://fotoshare.co/i/2wxtc51',
        fallback: '/images/gallery/gallery-01.svg',
        alt: 'Memoforia session 1',
    },
    {
        src: 'https://jepreto.com/booth-photo/view/605d9dda-79af-4ccc-9f68-9e7a437ca7d2',
        fallback: '/images/gallery/gallery-02.svg',
        alt: 'Memoforia session 2',
    },
    {
        src: 'https://jepreto.com/booth-photo/view/d66e8462-7349-48eb-8df8-f094c27b5e55',
        fallback: '/images/gallery/gallery-03.svg',
        alt: 'Memoforia session 3',
    },
    {
        src: 'https://jepreto.com/booth-photo/view/57f8ff46-488e-47c1-b85f-1408d84cf62f',
        fallback: '/images/gallery/gallery-04.svg',
        alt: 'Memoforia session 4',
    },
    {
        src: 'https://jepreto.com/booth-photo/view/16bc3e17-c4df-478c-8a22-0c8febf9f022',
        fallback: '/images/gallery/gallery-05.svg',
        alt: 'Memoforia session 5',
    },
];
