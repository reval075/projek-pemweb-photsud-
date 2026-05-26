import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Camera, ArrowRight, Sparkles } from 'lucide-react';

export default function Branches({ branches = [] }) {
    return (
        <GuestLayout>
            <Head title="Our Branches" />

            <section className="py-24 px-6 max-w-7xl mx-auto min-h-[70vh]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <p className="text-primary uppercase tracking-widest text-sm mb-4 flex items-center justify-center">
                        <Sparkles size={14} className="mr-2 text-accent" /> Find Us
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif mb-6">Our Branches</h1>
                    <p className="text-slate text-lg font-light max-w-2xl mx-auto">
                        Kunjungi studio MemForia terdekat. Setiap cabang dilengkapi photobooth premium dan ruang editorial.
                    </p>
                </motion.div>

                {branches.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-primary-50 text-center">
                        <p className="text-slate font-light">Data cabang belum tersedia. Jalankan seeder database.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {branches.map((branch, i) => (
                            <motion.article
                                key={branch.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-3xl border border-primary-50 shadow-lg shadow-primary/5 overflow-hidden group hover:border-primary/30 transition-colors"
                            >
                                <div className="relative h-48 overflow-hidden bg-primary-100">
                                    {branch.image ? (
                                        <img
                                            src={branch.image}
                                            alt={branch.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Camera size={40} className="text-primary/40" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
                                    <h2 className="absolute bottom-4 left-5 right-5 font-serif text-xl text-white">
                                        {branch.name}
                                    </h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex items-start gap-3 text-sm">
                                        <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                                        <p className="text-slate font-light leading-relaxed">{branch.address}</p>
                                    </div>
                                    {branch.phone && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone size={16} className="text-primary shrink-0" />
                                            <a href={`tel:${branch.phone}`} className="text-charcoal hover:text-primary-dark transition-colors">
                                                {branch.phone}
                                            </a>
                                        </div>
                                    )}
                                    {branch.operating_hours && (
                                        <div className="flex items-start gap-3 text-sm">
                                            <Clock size={16} className="text-primary shrink-0 mt-0.5" />
                                            <p className="text-slate font-light">{branch.operating_hours}</p>
                                        </div>
                                    )}

                                    {branch.booths?.length > 0 && (
                                        <div className="pt-2 border-t border-beige">
                                            <p className="text-xs uppercase tracking-widest text-warm-grey mb-2">Photobooth</p>
                                            <div className="flex flex-wrap gap-2">
                                                {branch.booths.map((booth) => (
                                                    <span
                                                        key={booth.id}
                                                        className="text-xs px-3 py-1 rounded-full bg-primary-50 text-primary-dark border border-primary-100"
                                                    >
                                                        {booth.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {branch.maps_link && (
                                        <a
                                            href={branch.maps_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-primary-dark hover:text-primary font-medium mt-2 transition-colors"
                                        >
                                            Buka di Google Maps <ArrowRight size={14} />
                                        </a>
                                    )}
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <Link
                        href="/booking-session"
                        className="inline-flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-full hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 uppercase tracking-widest text-sm font-medium"
                    >
                        Book di Cabang Terdekat <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </section>
        </GuestLayout>
    );
}
