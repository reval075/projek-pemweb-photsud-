import { motionTokens } from './tokens';

const reduced = { opacity: 1, y: 0, x: 0, scale: 1 };

/** Stagger parent — editorial section reveals */
export const staggerContainer = (staggerChildren = motionTokens.stagger.children, delayChildren = 0) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren,
            delayChildren,
            when: 'beforeChildren',
        },
    },
});

export const staggerItem = {
    hidden: { opacity: 0, y: motionTokens.distance.fadeUp },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: motionTokens.duration.base,
            ease: motionTokens.ease.out,
        },
    },
};

export const fadeUp = {
    hidden: { opacity: 0, y: motionTokens.distance.fadeUp },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: motionTokens.duration.base,
            ease: motionTokens.ease.out,
        },
    },
};

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: motionTokens.duration.slow,
            ease: motionTokens.ease.out,
        },
    },
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: motionTokens.duration.cinematic,
            ease: motionTokens.ease.out,
        },
    },
};

export const slideInLeft = {
    hidden: { opacity: 0, x: -motionTokens.distance.slide },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: motionTokens.duration.slow,
            ease: motionTokens.ease.out,
        },
    },
};

export const slideInRight = {
    hidden: { opacity: 0, x: motionTokens.distance.slide },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: motionTokens.duration.slow,
            ease: motionTokens.ease.out,
        },
    },
};

export const heroLogo = {
    hidden: { opacity: 0, scale: 0.88 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: motionTokens.duration.cinematic,
            ease: motionTokens.ease.out,
        },
    },
};

export const heroHeadlineLine = {
    hidden: { opacity: 0, y: 36 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: motionTokens.duration.cinematic,
            delay: i * motionTokens.delay.hero,
            ease: motionTokens.ease.out,
        },
    }),
};

/** Hover presets — transform + opacity only */
export const hoverLift = {
    rest: { y: 0, scale: 1 },
    hover: {
        y: -4,
        scale: 1.01,
        transition: motionTokens.spring.soft,
    },
    tap: { scale: 0.98 },
};

export const hoverCard = {
    rest: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.out },
    },
};

export const imageReveal = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: motionTokens.duration.slow,
            ease: motionTokens.ease.out,
        },
    },
};

/** When reduced motion is preferred */
export const toReduced = (variants) => {
    if (typeof variants === 'function') {
        return () => reduced;
    }
    return {
        hidden: reduced,
        visible: reduced,
    };
};
