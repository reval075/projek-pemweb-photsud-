import { motion } from 'framer-motion';
import {
    fadeUp,
    scaleIn,
    slideInLeft,
    slideInRight,
    staggerContainer,
    staggerItem,
} from '../variants';
import { motionTokens } from '../tokens';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import useScrollReveal from '../hooks/useScrollReveal';

const variantsMap = {
    fadeUp,
    scaleIn,
    slideInLeft,
    slideInRight,
};

/**
 * Scroll-triggered reveal — fade up by default, optional stagger children.
 */
export function Reveal({
    children,
    className = '',
    as = 'div',
    variant = 'fadeUp',
    delay = 0,
    stagger = false,
    staggerChildren = motionTokens.stagger.children,
    ...props
}) {
    const reduced = usePrefersReducedMotion();
    const scroll = useScrollReveal();
    const Component = motion[as] ?? motion.div;
    const variants = variantsMap[variant] ?? fadeUp;

    if (reduced) {
        const Tag = as === 'div' ? 'div' : as;
        return (
            <Tag className={className} {...props}>
                {children}
            </Tag>
        );
    }

    if (stagger) {
        return (
            <Component
                className={className}
                variants={staggerContainer(staggerChildren, delay)}
                {...scroll}
                {...props}
            >
                {children}
            </Component>
        );
    }

    return (
        <Component
            className={className}
            variants={variants}
            transition={{ delay }}
            {...scroll}
            {...props}
        >
            {children}
        </Component>
    );
}

export function RevealItem({ children, className = '', ...props }) {
    const reduced = usePrefersReducedMotion();

    if (reduced) {
        return (
            <div className={className} {...props}>
                {children}
            </div>
        );
    }

    return (
        <motion.div className={className} variants={staggerItem} {...props}>
            {children}
        </motion.div>
    );
}

export default Reveal;
