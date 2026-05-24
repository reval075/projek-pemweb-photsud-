import Navbar from '@/Components/Navbar';
import { motion } from 'framer-motion';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-off-white text-charcoal selection:bg-charcoal selection:text-off-white">
            <Navbar />
            
            <motion.main 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="flex-grow pt-24"
            >
                {children}
            </motion.main>

            {/* Elegant Minimal Footer */}
            <footer className="py-12 mt-20 border-t border-charcoal/10">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <span className="font-serif text-2xl block mb-2">Memoforia.</span>
                        <p className="text-sm text-charcoal/60 max-w-xs">Premium Photo Studio & Booth Experience in Town.</p>
                    </div>
                    <div className="flex space-x-8 text-sm uppercase tracking-widest text-charcoal/70">
                        <a href="#" className="hover:text-charcoal transition-colors">Instagram</a>
                        <a href="#" className="hover:text-charcoal transition-colors">WhatsApp</a>
                        <a href="#" className="hover:text-charcoal transition-colors">Email</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
