import { motion } from 'framer-motion';
import { motionTokens } from '../tokens';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import useParallax from '../hooks/useParallax';
import { useRef } from 'react';

/**
 * Decorative floating layer — gentle Y loop + optional light parallax on desktop.
 * Parallax and float use nested nodes so transforms do not conflict.
 */
export default function FloatingLayer({
    children,
    className = '',
    duration = 5,
    delay = 0,
    amplitude = motionTokens.float.amplitude,
    parallaxRange = [-16, 16],
    enableParallax = true,
    ...props
}) {
    const reduced = usePrefersReducedMotion();
    const ref = useRef(null);
    const { y: parallaxY, enabled } = useParallax(ref, parallaxRange);

    if (reduced) {
        return (
            <div className={className} {...props}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            style={enableParallax && enabled ? { y: parallaxY } : undefined}
            {...props}
        >
            <motion.div
                animate={{ y: [0, -amplitude, 0] }}
                transition={{
                    duration,
                    delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
