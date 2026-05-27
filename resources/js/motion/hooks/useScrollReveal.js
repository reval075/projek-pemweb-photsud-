import { motionTokens } from '../tokens';
import usePrefersReducedMotion from './usePrefersReducedMotion';

/**
 * Consistent whileInView props for scroll-triggered reveals.
 */
export default function useScrollReveal(options = {}) {
    const reduced = usePrefersReducedMotion();
    const {
        margin = motionTokens.viewport.margin,
        once = motionTokens.viewport.once,
        amount = 0.2,
    } = options;

    if (reduced) {
        return {
            initial: false,
            animate: undefined,
            whileInView: undefined,
            viewport: undefined,
        };
    }

    return {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once, margin, amount },
    };
}
