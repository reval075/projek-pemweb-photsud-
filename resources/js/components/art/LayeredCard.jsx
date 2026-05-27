import { motion } from 'framer-motion';
import { art } from '@/design/artDirection';
import { motionTokens } from '@/motion/tokens';

export default function LayeredCard({
    children,
    className = '',
    hover = true,
    as = 'div',
    ...props
}) {
    const Component = motion[as] ?? motion.div;

    return (
        <Component
            className={`${art.card.base} ${art.card.offset} ${className}`}
            whileHover={
                hover
                    ? {
                          y: -6,
                          rotate: -0.5,
                          transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.out },
                      }
                    : undefined
            }
            {...props}
        >
            {children}
        </Component>
    );
}
