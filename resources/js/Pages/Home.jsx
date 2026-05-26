import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Camera, Sparkles } from 'lucide-react';
import InteractiveHangingCamera from '@/components/booking-session/InteractiveHangingCamera';

const testimonialPhotos = [
    { src: 'https://fotoshare.co/i/2wxtc51', alt: 'Photo Session 1' },
    { src: 'https://jepreto.com/booth-photo/view/605d9dda-79af-4ccc-9f68-9e7a437ca7d2', alt: 'Photo Session 2' },
    { src: 'https://jepreto.com/booth-photo/view/d66e8462-7349-48eb-8df8-f094c27b5e55', alt: 'Photo Session 3' },
    { src: 'https://jepreto.com/booth-photo/view/57f8ff46-488e-47c1-b85f-1408d84cf62f', alt: 'Photo Session 4' },
    { src: 'https://jepreto.com/booth-photo/view/16bc3e17-c4df-478c-8a22-0c8febf9f022', alt: 'Photo Session 5' },
];

export default function Home() {
    return (
        <GuestLayout>
            <Head title="Premium Photo Studio & Booth" />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary-50 to-off-white"></div>
                    {/* Decorative circles */}
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto text-center">
                    {/* Logo badge */}
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                        <img src="/images/logo.png" alt="MemForia Logo" className="h-28 w-28 rounded-full mx-auto mb-8 shadow-lg shadow-primary/20"/>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-charcoal leading-tight mb-6">
                            Capture The <br className="hidden md:block"/>
                            <span className="italic font-light text-primary-dark">Fleeting</span> Moments.
                        </h1>
                    </motion.div>
                    
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} className="text-lg md:text-xl text-slate max-w-2xl mx-auto mb-10 font-light">
                        A premium photobooth experience designed for elegance and timeless memories.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/booking-session" className="group flex items-center justify-center space-x-3 bg-primary text-white px-8 py-4 rounded-full hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/30">
                            <span className="uppercase tracking-widest text-sm font-medium">Book Now</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/pricelist" className="flex items-center justify-center space-x-3 border-2 border-primary/30 text-charcoal px-8 py-4 rounded-full hover:border-primary hover:bg-primary/5 transition-all duration-300">
                            <span className="uppercase tracking-widest text-sm font-medium">View Pricelist</span>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-primary py-8">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                    {[
                        { number: '500+', label: 'Happy Clients' },
                        { number: '3', label: 'Studio Branches' },
                        { number: '10+', label: 'Photo Packages' },
                        { number: '4.9', label: 'Customer Rating', icon: true },
                    ].map((stat, i) => (
                        <div key={i}>
                            <p className="text-3xl md:text-4xl font-serif">{stat.number}{stat.icon && <Star size={16} className="inline ml-1 text-accent fill-accent" />}</p>
                            <p className="text-white/70 text-sm uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* About / Philosophy Section */}
            <section className="py-28 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
                        <p className="text-primary uppercase tracking-widest text-sm mb-4 flex items-center"><Sparkles size={14} className="mr-2 text-accent" /> About Us</p>
                        <h2 className="text-4xl md:text-5xl font-serif mb-8">Our Philosophy</h2>
                        <p className="text-slate leading-relaxed mb-6 text-lg font-light">
                            We believe that every picture tells a story. At MemForia, we don't just take photographs; we craft visual poetry. Our spaces are meticulously designed to provide the perfect canvas for your expressions.
                        </p>
                        <p className="text-slate leading-relaxed text-lg font-light">
                            Whether it's an intimate photobooth session or a professional studio rental, we provide top-tier equipment in an environment that inspires creativity.
                        </p>
                        <div className="mt-8 flex items-center space-x-4">
                            <div className="h-px w-12 bg-accent"></div>
                            <span className="text-sm text-warm-grey uppercase tracking-widest">Est. 2024</span>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative h-[550px] w-full">
                        <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Camera Equipment" className="w-full h-full object-cover rounded-2xl"/>
                        <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-2xl shadow-xl">
                            <Camera size={24} className="mb-2" />
                            <p className="font-serif text-lg">Premium Equipment</p>
                            <p className="text-white/70 text-sm">Professional-grade gear</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-24 bg-beige">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-primary uppercase tracking-widest text-sm mb-4">What We Offer</p>
                        <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Services</h2>
                        <p className="text-slate text-lg font-light max-w-xl mx-auto">Tailored photography experiences for every occasion</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Link href="/booking-session" className="group block relative overflow-hidden h-[500px] rounded-2xl">
                            <img src="https://images.unsplash.com/photo-1520110120835-c96534a4c984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Photobooth" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent group-hover:from-charcoal/80 transition-colors duration-500"></div>
                            <div className="absolute bottom-10 left-10 text-white">
                                <h3 className="text-3xl font-serif mb-2">Photobooth</h3>
                                <p className="font-light tracking-wide flex items-center">Book a session <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" /></p>
                            </div>
                        </Link>
                        <Link href="/rentals" className="group block relative overflow-hidden h-[500px] rounded-2xl">
                            <img src="https://images.unsplash.com/photo-1510127034890-ba27e66d40d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Equipment Rental" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent group-hover:from-charcoal/80 transition-colors duration-500"></div>
                            <div className="absolute bottom-10 left-10 text-white">
                                <h3 className="text-3xl font-serif mb-2">Equipment Rental</h3>
                                <p className="font-light tracking-wide flex items-center">Browse catalog <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" /></p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Gallery / Testimonial Section */}
            <section className="py-28 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-primary uppercase tracking-widest text-sm mb-4 flex items-center justify-center"><Sparkles size={14} className="mr-2 text-accent" /> Our Gallery</p>
                        <h2 className="text-4xl md:text-5xl font-serif mb-4">Captured Memories</h2>
                        <p className="text-slate text-lg font-light max-w-xl mx-auto">Real moments from real clients — captured at our studio</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {testimonialPhotos.map((photo, i) => (
                            <motion.a key={i} href={photo.src} target="_blank" rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-primary-100">
                                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.classList.add('flex', 'items-center', 'justify-center'); const placeholder = document.createElement('div'); placeholder.className = 'text-center p-4'; placeholder.innerHTML = '<div class="text-primary text-4xl mb-2">📸</div><p class="text-sm text-slate">View Photo</p>'; e.target.parentNode.appendChild(placeholder); }}/>
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-end p-4">
                                    <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-light">View on source →</p>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section — interactive camera */}
            <section id="interactive-camera" className="py-20 md:py-28 bg-gradient-to-r from-primary to-primary-dark text-white relative overflow-hidden scroll-mt-24">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/30 blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
                </div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-4xl md:text-5xl font-serif mb-4">Ready to Create Memories?</h2>
                        <p className="text-white/80 text-lg mb-6 font-light max-w-xl mx-auto">
                            Book your photobooth session today and let us help you capture moments that last forever.
                        </p>
                        <p className="text-white/60 text-sm mb-8 font-light">
                            Tekan shutter pada kamera untuk membuka sesi booking
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, duration: 0.7 }}
                        className="mb-10"
                    >
                        <InteractiveHangingCamera redirectTo="/booking" variant="light" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <Link
                            href="/booking-session"
                            className="bg-white text-primary-dark px-10 py-4 rounded-full hover:bg-off-white transition-all duration-300 uppercase tracking-widest text-sm font-medium shadow-lg"
                        >
                            Book a Session
                        </Link>
                        <Link
                            href="/branches"
                            className="border-2 border-white/30 text-white px-10 py-4 rounded-full hover:bg-white/10 transition-all duration-300 uppercase tracking-widest text-sm font-medium"
                        >
                            Find a Branch
                        </Link>
                    </motion.div>
                </div>
            </section>
        </GuestLayout>
    );
}