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

/** Gallery photos — SVG placeholders siap diisi foto asli dari booth */
export const galleryPhotos = [
    {
        src: '/images/gallery/gallery-01.svg',
        fallback: '/images/gallery/gallery-01.svg',
        alt: 'Memoforia session 1',
    },
    {
        src: '/images/gallery/gallery-02.svg',
        fallback: '/images/gallery/gallery-02.svg',
        alt: 'Memoforia session 2',
    },
    {
        src: '/images/gallery/gallery-03.svg',
        fallback: '/images/gallery/gallery-03.svg',
        alt: 'Memoforia session 3',
    },
    {
        src: '/images/gallery/gallery-04.svg',
        fallback: '/images/gallery/gallery-04.svg',
        alt: 'Memoforia session 4',
    },
    {
        src: '/images/gallery/gallery-05.svg',
        fallback: '/images/gallery/gallery-05.svg',
        alt: 'Memoforia session 5',
    },
];
