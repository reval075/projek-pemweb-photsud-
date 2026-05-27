import { motion } from 'framer-motion';
import usePrefersReducedMotion from '@/motion/hooks/usePrefersReducedMotion';

export default function MarqueeBand({ phrases, className = '', variant = 'primary' }) {
    const reduced = usePrefersReducedMotion();
    const items = [...phrases, ...phrases];
    const bg =
        variant === 'accent'
            ? 'bg-accent text-charcoal'
            : variant === 'dark'
              ? 'bg-charcoal text-white'
              : 'bg-primary text-white';

    if (reduced) {
        return (
            <div className={`${bg} py-4 overflow-hidden ${className}`}>
                <p className="text-center type-label opacity-90">{phrases.join(' · ')}</p>
            </div>
        );
    }

    return (
        <div className={`${bg} py-5 md:py-6 overflow-hidden border-y-2 border-charcoal/10 ${className}`}>
            <div className="flex w-max maggie-marquee-track">
                {items.map((text, i) => (
                    <span
                        key={`${text}-${i}`}
                        className="type-shout text-inherit opacity-95 whitespace-nowrap px-8 md:px-12"
                    >
                        {text}
                        <span className="mx-6 md:mx-10 opacity-40">✦</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

export function MarqueeBandReveal({ phrases, ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
            <MarqueeBand phrases={phrases} {...props} />
        </motion.div>
    );
}
