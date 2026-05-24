import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <GuestLayout>
            <Head title="Premium Photo Studio & Booth" />

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Placeholder High Quality Image */}
                    <img 
                        src="https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                        alt="Studio Interior" 
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-off-white/40 mix-blend-overlay"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-charcoal leading-tight mb-6">
                            Capture The <br className="hidden md:block"/>
                            <span className="italic font-light">Fleeting</span> Moments.
                        </h1>
                    </motion.div>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="text-lg md:text-xl text-charcoal/80 max-w-2xl mx-auto mb-10 font-light"
                    >
                        A premium photography studio and photobooth experience designed for elegance and timeless memories.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex justify-center"
                    >
                        <Link 
                            href="/booking" 
                            className="group flex items-center space-x-3 bg-charcoal text-off-white px-8 py-4 rounded-full hover:bg-charcoal/90 transition-all duration-300"
                        >
                            <span className="uppercase tracking-widest text-sm font-medium">Book Now</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* About / Philosophy Section */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif mb-8">Our Philosophy</h2>
                        <p className="text-charcoal/70 leading-relaxed mb-6 text-lg font-light">
                            We believe that every picture tells a story. At Memoforia, we don't just take photographs; we craft visual poetry. Our spaces are meticulously designed to provide the perfect canvas for your expressions.
                        </p>
                        <p className="text-charcoal/70 leading-relaxed text-lg font-light">
                            Whether it's an intimate photobooth session or a professional studio rental, we provide top-tier equipment in an environment that inspires creativity.
                        </p>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative h-[600px] w-full"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                            alt="Camera Equipment" 
                            className="w-full h-full object-cover rounded-sm"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Services Preview Section */}
            <section className="py-24 bg-beige/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Services</h2>
                        <p className="text-charcoal/60 uppercase tracking-widest text-sm">Tailored for your needs</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Service 1 */}
                        <Link href="/booking" className="group block relative overflow-hidden h-[500px]">
                            <img 
                                src="https://images.unsplash.com/photo-1520110120835-c96534a4c984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Photobooth" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/40 transition-colors duration-500"></div>
                            <div className="absolute bottom-10 left-10 text-off-white">
                                <h3 className="text-3xl font-serif mb-2">Photobooth</h3>
                                <p className="font-light tracking-wide flex items-center">
                                    Book a session <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                                </p>
                            </div>
                        </Link>

                        {/* Service 2 */}
                        <Link href="/rentals" className="group block relative overflow-hidden h-[500px]">
                            <img 
                                src="https://images.unsplash.com/photo-1510127034890-ba27e66d40d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Equipment Rental" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/40 transition-colors duration-500"></div>
                            <div className="absolute bottom-10 left-10 text-off-white">
                                <h3 className="text-3xl font-serif mb-2">Equipment Rental</h3>
                                <p className="font-light tracking-wide flex items-center">
                                    Browse catalog <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}