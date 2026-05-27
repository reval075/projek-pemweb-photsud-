/**
 * Memoforia motion design tokens — Maggie-inspired rhythm, Memoforia identity.
 * Use across guest pages for consistent cinematic feel.
 */

export const motionTokens = {
    duration: {
        fast: 0.4,
        base: 0.75,
        slow: 1.05,
        cinematic: 1.35,
        section: 1.1,
    },
    delay: {
        hero: 0.16,
        section: 0.1,
        child: 0.07,
    },
    ease: {
        /** Editorial ease-out — primary entrance curve */
        out: [0.22, 1, 0.36, 1],
        inOut: [0.4, 0, 0.2, 1],
        soft: [0.25, 0.46, 0.45, 0.94],
    },
    spring: {
        /** Subtle hover / tap — not bouncy */
        soft: { type: 'spring', stiffness: 260, damping: 28 },
        gentle: { type: 'spring', stiffness: 180, damping: 24 },
    },
    stagger: {
        container: 0.08,
        children: 0.06,
        hero: 0.14,
        gallery: 0.07,
    },
    viewport: {
        once: true,
        margin: '-80px 0px -100px 0px',
    },
    distance: {
        fadeUp: 48,
        fadeIn: 24,
        slide: 40,
    },
    float: {
        durationMin: 4,
        durationMax: 6,
        amplitude: 18,
    },
};

export const transition = {
    fadeUp: (delay = 0) => ({
        duration: motionTokens.duration.base,
        delay,
        ease: motionTokens.ease.out,
    }),
    cinematic: (delay = 0) => ({
        duration: motionTokens.duration.cinematic,
        delay,
        ease: motionTokens.ease.out,
    }),
    fast: (delay = 0) => ({
        duration: motionTokens.duration.fast,
        delay,
        ease: motionTokens.ease.out,
    }),
};
