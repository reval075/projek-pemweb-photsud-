import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { art } from '@/design/artDirection';
import { motionTokens } from '@/motion/tokens';

export default function ChunkyButton({
    href,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = '',
    children,
}) {
    const base =
        variant === 'secondary'
            ? art.btn.secondary
            : variant === 'ghost'
              ? art.btn.ghost
              : art.btn.primary;

    const classes = `${base} transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${className}`;

    const motionProps = {
        whileHover: disabled ? undefined : { y: -3, scale: 1.02 },
        whileTap: disabled ? undefined : { y: 2, scale: 0.98 },
        transition: motionTokens.spring.soft,
    };

    if (href && !disabled) {
        return (
            <motion.div {...motionProps} className="inline-block">
                <Link href={href} className={classes}>
                    {children}
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.button type={type} onClick={onClick} disabled={disabled} className={classes} {...motionProps}>
            {children}
        </motion.button>
    );
}
