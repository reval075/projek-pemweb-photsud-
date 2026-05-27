import { useEffect, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import usePrefersReducedMotion from './usePrefersReducedMotion';

const MOBILE_MAX = 768;

/**
 * Light scroll-linked Y offset. Disabled on mobile and when reduced motion is on.
 */
export default function useParallax(ref, range = [-24, 24]) {
    const reduced = usePrefersReducedMotion();
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const check = () => setEnabled(window.innerWidth > MOBILE_MAX);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(
        scrollYProgress,
        [0, 1],
        reduced || !enabled ? [0, 0] : range,
    );

    return { y, enabled: enabled && !reduced };
}
