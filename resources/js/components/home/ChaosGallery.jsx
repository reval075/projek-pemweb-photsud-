import { useState } from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from '@/motion/tokens';
import usePrefersReducedMotion from '@/motion/hooks/usePrefersReducedMotion';

const COLLAGE_LAYOUT = [
    { top: '0%', left: '0%', width: '42%', rotate: -7, z: 10, delay: 0 },
    { top: '8%', left: '38%', width: '48%', rotate: 5, z: 20, delay: 0.08 },
    { top: '38%', left: '8%', width: '38%', rotate: 8, z: 15, delay: 0.16 },
    { top: '42%', left: '48%', width: '44%', rotate: -4, z: 25, delay: 0.12 },
    { top: '22%', left: '62%', width: '34%', rotate: -9, z: 30, delay: 0.2 },
];

/**
 * Maggie-style chaos gallery — overlapping offset collage, not a grid.
 */
export default function ChaosGallery({ photos, className = '' }) {
    const reduced = usePrefersReducedMotion();

    return (
        <div className={`relative w-full min-h-[520px] md:min-h-[680px] lg:min-h-[760px] ${className}`}>
            {photos.map((photo, i) => (
                <ChaosTile key={photo.alt} photo={photo} layout={COLLAGE_LAYOUT[i]} reduced={reduced} />
            ))}
        </div>
    );
}

function ChaosTile({ photo, layout, reduced }) {
    const [src, setSrc] = useState(photo.src);

    return (
        <motion.div
            className="absolute aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl border-[3px] border-white shadow-[10px_14px_0_0_rgba(44,62,80,0.22)]"
            style={{
                top: layout.top,
                left: layout.left,
                width: layout.width,
                zIndex: layout.z,
                rotate: `${layout.rotate}deg`,
            }}
            initial={reduced ? false : { opacity: 0, y: 60, scale: 0.9 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
                delay: layout.delay,
                duration: motionTokens.duration.section,
                ease: motionTokens.ease.out,
            }}
            whileHover={reduced ? undefined : { y: -12, rotate: layout.rotate - 2, scale: 1.03, zIndex: 50 }}
        >
            <img
                src={src}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={() => setSrc(photo.fallback)}
            />
        </motion.div>
    );
}
