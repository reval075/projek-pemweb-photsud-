import { motion } from 'framer-motion';
import { motionTokens } from '@/motion/tokens';
import usePrefersReducedMotion from '@/motion/hooks/usePrefersReducedMotion';

/**
 * Maggie "pack the drinks / breakfast / ballet" scattered floating labels.
 */
export default function ScatteredPills({ labels, className = '' }) {
    const reduced = usePrefersReducedMotion();

    if (reduced) {
        return (
            <div className={`flex flex-wrap gap-2 ${className}`}>
                {labels.map((item, i) => (
                    <span
                        key={i}
                        className="px-4 py-2 rounded-full bg-primary text-white text-sm font-bold uppercase tracking-wider"
                    >
                        {typeof item === 'string' ? item : item.text}
                    </span>
                ))}
            </div>
        );
    }

    return (
        <div className={`relative min-h-[280px] md:min-h-[400px] ${className}`}>
            {labels.map((item, i) => {
                const { text, top, left, rotate = 0 } = item;

                return (
                    <motion.span
                        key={i}
                        className="absolute px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-primary text-white text-xs md:text-sm font-bold uppercase tracking-widest border-2 border-charcoal/10 shadow-[4px_4px_0_0_rgba(44,62,80,0.2)] whitespace-nowrap"
                        style={{ top, left, rotate: `${rotate}deg` }}
                        initial={{ opacity: 0, scale: 0.6 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                            opacity: { delay: i * 0.1, duration: 0.55, ease: motionTokens.ease.out },
                            scale: { delay: i * 0.1, duration: 0.55, ease: motionTokens.ease.out },
                            y: {
                                duration: 3.5 + i * 0.4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.25,
                            },
                        }}
                    >
                        {text}
                    </motion.span>
                );
            })}
        </div>
    );
}
