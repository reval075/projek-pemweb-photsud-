import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Book Studio', href: '/booking' },
        { name: 'Rentals', href: '/rentals' },
        { name: 'Pricelist', href: '/pricelist' },
        { name: 'Branches', href: '/branches' },
    ];

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-off-white/90 backdrop-blur-md py-3 shadow-sm' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3">
                        <img 
                            src="/images/logo.png" 
                            alt="MemForia Logo" 
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <span className="font-serif text-xl tracking-wide font-medium text-charcoal">
                            MemForia
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className="text-sm uppercase tracking-widest text-charcoal/60 hover:text-primary-dark transition-colors duration-300"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button - Desktop */}
                    <div className="hidden md:block">
                        <Link 
                            href="/booking" 
                            className="bg-primary text-white px-6 py-2.5 rounded-full text-sm uppercase tracking-widest hover:bg-primary-dark transition-all duration-300"
                        >
                            Book Now
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden text-charcoal focus:outline-none z-50"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-off-white z-40 flex flex-col justify-center items-center"
                    >
                        {/* Logo in mobile menu */}
                        <img 
                            src="/images/logo.png" 
                            alt="MemForia Logo" 
                            className="h-20 w-20 rounded-full object-cover mb-10"
                        />
                        <div className="flex flex-col space-y-8 items-center">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                >
                                    <Link 
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="font-serif text-3xl text-charcoal hover:text-primary transition-colors duration-300"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
