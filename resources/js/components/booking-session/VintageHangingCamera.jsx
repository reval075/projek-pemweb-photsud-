import { useId } from 'react';
import { motion } from 'framer-motion';

export default function VintageHangingCamera({
    onShutterClick,
    disabled = false,
    isFlashing = false,
    variant = 'light',
    showHint = true,
}) {
    const uid = useId().replace(/:/g, '');
    const isLight = variant === 'light';

    return (
        <div className="relative flex flex-col items-center select-none">
            <div className="flex flex-col items-center">
                <div
                    className={`w-1 h-8 rounded-full ${
                        isLight
                            ? 'bg-gradient-to-b from-white/50 to-white/20'
                            : 'bg-gradient-to-b from-warm-grey to-charcoal'
                    }`}
                />
                <motion.div
                    className="origin-top"
                    animate={{ rotate: disabled ? 0 : [-1.2, 1.2, -1.2] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <svg width="120" height="56" viewBox="0 0 120 56" className="drop-shadow-lg">
                        <path
                            d="M60 4 C40 4 28 20 24 40 L24 52 C24 54 26 56 28 56 L92 56 C94 56 96 54 96 52 L96 40 C92 20 80 4 60 4Z"
                            fill={isLight ? '#5c4033' : '#3d2b1f'}
                            stroke={isLight ? '#6b4f3a' : '#5c4033'}
                            strokeWidth="1"
                        />
                        <path d="M36 18 L84 18" stroke="#8a6a52" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
                        <ellipse cx="60" cy="8" rx="8" ry="4" fill={isLight ? '#4a5568' : '#2a2a2a'} />
                    </svg>

                    <motion.div
                        className="relative -mt-1"
                        animate={isFlashing ? { scale: [1, 0.98, 1] } : {}}
                        transition={{ duration: 0.15 }}
                    >
                        <svg
                            width="220"
                            height="160"
                            viewBox="0 0 220 160"
                            className="drop-shadow-2xl"
                            aria-label="Vintage DSLR Camera"
                        >
                            <defs>
                                <linearGradient id={`bodyGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#2C3E50" />
                                    <stop offset="50%" stopColor="#1e2a38" />
                                    <stop offset="100%" stopColor="#15202b" />
                                </linearGradient>
                                <linearGradient id={`silverGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#E1E9F1" />
                                    <stop offset="100%" stopColor="#9BB5D3" />
                                </linearGradient>
                                <radialGradient id={`lensGlass-${uid}`} cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#7A9CC0" stopOpacity="0.9" />
                                    <stop offset="60%" stopColor="#2C3E50" />
                                    <stop offset="100%" stopColor="#15202b" />
                                </radialGradient>
                            </defs>

                            <rect x="50" y="20" width="120" height="28" rx="4" fill={`url(#silverGrad-${uid})`} />
                            <rect x="55" y="24" width="110" height="4" rx="1" fill="#8E99A4" opacity="0.5" />

                            <rect
                                x="35"
                                y="44"
                                width="150"
                                height="90"
                                rx="8"
                                fill={`url(#bodyGrad-${uid})`}
                                stroke="#4A5568"
                                strokeWidth="1"
                            />
                            <rect x="42" y="50" width="136" height="12" rx="2" fill="#243447" />

                            <path d="M85 44 L85 28 L135 28 L135 44 Z" fill="#1e2a38" stroke="#4A5568" strokeWidth="1" />
                            <rect x="95" y="30" width="30" height="10" rx="2" fill="#15202b" />

                            <ellipse cx="110" cy="105" rx="42" ry="38" fill="#1e2a38" stroke="#7A9CC0" strokeWidth="2" />
                            <ellipse cx="110" cy="105" rx="36" ry="32" fill="#243447" />
                            <ellipse cx="110" cy="105" rx="30" ry="26" fill={`url(#lensGlass-${uid})`} />
                            <ellipse cx="110" cy="105" rx="22" ry="18" fill="#2C3E50" opacity="0.85" />
                            <ellipse cx="98" cy="95" rx="8" ry="5" fill="white" opacity="0.2" transform="rotate(-20 98 95)" />
                            <circle cx="110" cy="105" r="8" fill="#9BB5D3" opacity="0.5" />

                            <rect x="155" y="58" width="22" height="60" rx="3" fill="#15202b" />
                            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                                <line
                                    key={i}
                                    x1="158"
                                    y1={64 + i * 8}
                                    x2="174"
                                    y2={64 + i * 8}
                                    stroke="#3a4a5c"
                                    strokeWidth="1"
                                />
                            ))}

                            <rect x="48" y="72" width="36" height="14" rx="2" fill="#E8C44D" opacity="0.95" />
                            <text
                                x="66"
                                y="82"
                                textAnchor="middle"
                                fill="#2C3E50"
                                fontSize="7"
                                fontFamily="serif"
                                fontWeight="bold"
                            >
                                MEMOFORIA
                            </text>

                            <circle cx="75" cy="58" r="10" fill={`url(#silverGrad-${uid})`} stroke="#7A9CC0" strokeWidth="1" />
                            <circle cx="75" cy="58" r="4" fill="#2C3E50" />
                        </svg>

                        <motion.button
                            type="button"
                            onClick={onShutterClick}
                            disabled={disabled}
                            aria-label="Tekan shutter untuk booking"
                            className={`absolute top-[18px] right-[28px] w-11 h-11 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed group ${
                                isLight ? 'focus-visible:ring-white/80' : 'focus-visible:ring-primary'
                            }`}
                            whileHover={disabled ? {} : { scale: 1.08 }}
                            whileTap={disabled ? {} : { scale: 0.92 }}
                        >
                            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-red-800 shadow-lg shadow-red-900/40 border-2 border-red-300/50 group-hover:border-red-200/70 transition-colors" />
                            <span className="absolute inset-[3px] rounded-full bg-gradient-to-t from-red-700 to-red-500" />
                            <span className="absolute inset-[6px] rounded-full bg-red-600/90" />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {showHint && !disabled && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className={`mt-8 text-xs uppercase tracking-[0.35em] font-light ${
                        isLight ? 'text-white/70' : 'text-warm-grey'
                    }`}
                >
                    Tekan shutter untuk booking
                </motion.p>
            )}
        </div>
    );
}
