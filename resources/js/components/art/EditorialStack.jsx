import { motion } from 'framer-motion';
import { motionTokens } from '@/motion/tokens';
import usePrefersReducedMotion from '@/motion/hooks/usePrefersReducedMotion';

/**
 * Maggie-style stacked giant lines — one phrase per row.
 */
export default function EditorialStack({
    lines,
    className = '',
    lineClassName = 'type-mega',
    align = 'left',
    italicIndices = [],
    accentIndices = [],
    animate = true,
}) {
    const reduced = usePrefersReducedMotion();
    const alignClass =
        align === 'center' ? 'text-center items-center' : align === 'right' ? 'text-right items-end' : 'text-left items-start';

    return (
        <div className={`flex flex-col gap-0 ${alignClass} ${className}`}>
            {lines.map((line, i) => {
                const isItalic = italicIndices.includes(i);
                const isAccent = accentIndices.includes(i);
                const lineClasses = [
                    lineClassName,
                    isItalic ? 'italic font-light text-primary-dark' : '',
                    isAccent ? 'text-primary-dark' : '',
                ]
                    .filter(Boolean)
                    .join(' ');

                if (!animate || reduced) {
                    return (
                        <span key={i} className={lineClasses}>
                            {line}
                        </span>
                    );
                }

                return (
                    <motion.span
                        key={i}
                        className={lineClasses}
                        initial={{ opacity: 0, y: 56 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: motionTokens.duration.cinematic,
                            delay: i * motionTokens.delay.hero,
                            ease: motionTokens.ease.out,
                        }}
                    >
                        {line}
                    </motion.span>
                );
            })}
        </div>
    );
}
