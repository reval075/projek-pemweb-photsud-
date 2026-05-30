import { motion } from 'framer-motion';
import { motionTokens } from '@/motion/tokens';
import usePrefersReducedMotion from '@/motion/hooks/usePrefersReducedMotion';

/**
 * Maggie "FIND FREE SANITY-SAVING..." word storm — one word per line, asymmetric indent.
 */
export default function KineticWordStorm({ words, className = '' }) {
    const reduced = usePrefersReducedMotion();

    return (
        <div className={`flex flex-col gap-[0.15em] overflow-visible ${className}`}>
            {words.map((item, i) => {
                const { text, indent = 0, italic = false, accent = false } =
                    typeof item === 'string' ? { text: item } : item;

                const indentClass =
                    indent === 1 ? 'ml-[8%] md:ml-[15%]' : indent === 2 ? 'ml-[16%] md:ml-[30%]' : indent === -1 ? '-ml-[4%]' : '';

                const classes = [
                    'type-kinetic font-sans block',
                    indentClass,
                    italic ? 'italic !font-serif !normal-case !text-primary-dark type-display' : '',
                    accent ? 'text-primary-dark' : 'text-charcoal',
                ]
                    .filter(Boolean)
                    .join(' ');

                if (reduced) {
                    return (
                        <span key={i} className={classes}>
                            {text}
                        </span>
                    );
                }

                return (
                    <motion.span
                        key={i}
                        className={classes}
                        initial={{ opacity: 0, x: indent >= 1 ? 60 : -40, y: 40 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{
                            delay: i * 0.07,
                            duration: motionTokens.duration.section,
                            ease: motionTokens.ease.out,
                        }}
                    >
                        {text}
                    </motion.span>
                );
            })}
        </div>
    );
}
