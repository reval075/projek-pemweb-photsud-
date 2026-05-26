import { motion, AnimatePresence } from 'framer-motion';

export default function CameraFlashOverlay({ active, className = '' }) {
    return (
        <AnimatePresence>
            {active && (
                <>
                    <motion.div
                        key="flash-burst"
                        className={`fixed inset-0 z-[100] pointer-events-none ${className}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.7, 0] }}
                        transition={{ duration: 0.58, times: [0, 0.1, 0.28, 1], ease: 'easeOut' }}
                        style={{
                            background:
                                'radial-gradient(circle at 50% 45%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.92) 18%, rgba(248,249,252,0.5) 40%, transparent 68%)',
                        }}
                    />
                    <motion.div
                        key="flash-full"
                        className={`fixed inset-0 z-[99] bg-white pointer-events-none ${className}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.92, 0] }}
                        transition={{ duration: 0.32, times: [0, 0.12, 1] }}
                    />
                </>
            )}
        </AnimatePresence>
    );
}
