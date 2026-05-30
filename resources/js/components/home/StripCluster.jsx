import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { homeImages } from '@/constants/homeAssets';
import { motionTokens } from '@/motion/tokens';
import usePrefersReducedMotion from '@/motion/hooks/usePrefersReducedMotion';

const STRIP_LAYOUT = [
    { className: 'absolute left-[4%] md:left-[8%] top-[12%] w-[22vw] max-w-[140px] md:max-w-[180px] z-30', rotate: -14, delay: 0 },
    { className: 'absolute right-[2%] md:right-[6%] top-[8%] w-[26vw] max-w-[160px] md:max-w-[200px] z-40', rotate: 10, delay: 0.08 },
    { className: 'absolute left-[18%] md:left-[28%] top-[38%] w-[24vw] max-w-[150px] md:max-w-[190px] z-50', rotate: -6, delay: 0.16 },
    { className: 'absolute right-[12%] md:right-[18%] top-[42%] w-[20vw] max-w-[130px] md:max-w-[170px] z-40', rotate: 12, delay: 0.24 },
    { className: 'absolute left-[42%] md:left-[48%] top-[22%] w-[18vw] max-w-[120px] md:max-w-[150px] z-50 hidden sm:block', rotate: -8, delay: 0.12 },
    { className: 'absolute right-[28%] md:right-[32%] bottom-[18%] w-[22vw] max-w-[140px] md:max-w-[175px] z-30', rotate: 6, delay: 0.2 },
];

/**
 * Photostrips as primary hero visual — overlapping cluster, not decoration.
 */
export default function StripCluster({ className = '' }) {
    const reduced = usePrefersReducedMotion();
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 80]);

    const strips = [...homeImages.strips, ...homeImages.strips.slice(0, 2)];

    return (
        <motion.div ref={ref} style={{ y }} className={`relative w-full h-full min-h-[320px] md:min-h-[520px] ${className}`}>
            {STRIP_LAYOUT.map((layout, i) => {
                const strip = strips[i % strips.length];
                return (
                    <motion.div
                        key={i}
                        className={layout.className}
                        initial={{ opacity: 0, y: 80, rotate: layout.rotate - 20, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, rotate: layout.rotate, scale: 1 }}
                        transition={{
                            delay: 0.35 + layout.delay,
                            duration: motionTokens.duration.cinematic,
                            ease: motionTokens.ease.out,
                        }}
                    >
                        <motion.img
                            src={strip.src}
                            alt={strip.alt}
                            className="w-full drop-shadow-2xl rounded-md border-[3px] border-white/90 shadow-[8px_12px_0_0_rgba(44,62,80,0.25)]"
                            animate={reduced ? undefined : { y: [0, -10 - i * 2, 0] }}
                            transition={
                                reduced
                                    ? undefined
                                    : {
                                          duration: 4.5 + i * 0.6,
                                          repeat: Infinity,
                                          ease: 'easeInOut',
                                          delay: i * 0.4,
                                      }
                            }
                        />
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
