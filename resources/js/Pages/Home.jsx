import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowRight, Star, Camera } from 'lucide-react';
import InteractiveHangingCamera from '@/components/booking-session/InteractiveHangingCamera';
import { homeImages, galleryPhotos } from '@/constants/homeAssets';
import { art, marqueePhrases } from '@/design/artDirection';
import EditorialStack from '@/components/art/EditorialStack';
import MarqueeBand, { MarqueeBandReveal } from '@/components/art/MarqueeBand';
import ChunkyButton from '@/components/art/ChunkyButton';
import LayeredCard from '@/components/art/LayeredCard';
import FloatingLayer from '@/motion/components/FloatingLayer';
import { Reveal, RevealItem } from '@/motion/components/Reveal';
import { motionTokens } from '@/motion';
import usePrefersReducedMotion from '@/motion/hooks/usePrefersReducedMotion';

function GalleryTile({ photo }) {
    const [src, setSrc] = useState(photo.src);

    return (
        <RevealItem>
            <motion.div
                whileHover={{ y: -8, rotate: -1 }}
                transition={{ duration: motionTokens.duration.fast, ease: motionTokens.ease.out }}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl border-2 border-charcoal/10 shadow-[6px_6px_0_0_rgba(44,62,80,0.15)]"
            >
                <img
                    src={src}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={() => setSrc(photo.fallback)}
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/25 transition-colors duration-500" />
            </motion.div>
        </RevealItem>
    );
}

export default function Home() {
    const reduced = usePrefersReducedMotion();
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduced ? 1 : 0.15]);

    return (
        <GuestLayout>
            <Head title="Premium Photo Studio & Booth" />

            {/* ——— HERO: asymmetric, giant type, layered strips ——— */}
            <section
                ref={heroRef}
                className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-off-white border-b-2 border-charcoal/10"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary-50 to-off-white" />
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 pointer-events-none">
                    {!reduced && (
                        <>
                            <motion.div
                                className="absolute -top-32 -right-20 w-[min(90vw,700px)] h-[min(90vw,700px)] rounded-full bg-primary/25 blur-3xl"
                                animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
                                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <motion.div
                                className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl"
                                animate={{ x: [0, 40, 0] }}
                                transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        </>
                    )}
                </motion.div>

                {homeImages.strips.map((strip, i) => (
                    <FloatingLayer
                        key={strip.src}
                        className={`pointer-events-none z-10 ${
                            i === 0
                                ? 'hidden lg:block absolute left-[2%] top-[20%] w-28 xl:w-32'
                                : i === 1
                                  ? 'hidden md:block absolute right-[3%] top-[14%] w-24 lg:w-28'
                                  : i === 2
                                    ? 'hidden lg:block absolute left-[12%] bottom-[18%] w-24 xl:w-28'
                                    : 'hidden md:block absolute right-[6%] bottom-[22%] w-20 lg:w-24'
                        }`}
                        duration={4.5 + i * 0.5}
                        delay={i * 0.3}
                        amplitude={14 + i * 3}
                    >
                        <motion.img
                            initial={{ opacity: 0, rotate: strip.rotate, scale: 0.9 }}
                            animate={{ opacity: 1, rotate: strip.rotate, scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.12, duration: 1.2, ease: motionTokens.ease.out }}
                            src={strip.src}
                            alt={strip.alt}
                            className="w-full drop-shadow-2xl rounded-lg border-2 border-white/60"
                        />
                    </FloatingLayer>
                ))}

                <div className={`relative z-20 ${art.section.pad} pt-32 md:pt-40 pb-16 md:pb-24 max-w-[1400px] mx-auto w-full`}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-end">
                        <div className="lg:col-span-8">
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: motionTokens.ease.out }}
                                className={`${art.type.label} mb-6 md:mb-8`}
                            >
                                meet memoforia
                            </motion.p>

                            <EditorialStack
                                lines={['Capture', 'The', 'Fleeting', 'Moments.']}
                                italicIndices={[2]}
                                accentIndices={[3]}
                                lineClassName="type-mega block"
                            />

                            <motion.p
                                initial={{ opacity: 0, y: 32 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.75, duration: 1, ease: motionTokens.ease.out }}
                                className={`${art.type.body} max-w-xl mt-8 md:mt-12`}
                            >
                                Premium photobooth & studio — cinematic memories, printed instantly, kept forever.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.95, duration: 0.9, ease: motionTokens.ease.out }}
                                className="flex flex-col sm:flex-row flex-wrap gap-4 mt-10 md:mt-14"
                            >
                                <ChunkyButton href="/booking-session">
                                    Book Now <ArrowRight size={20} />
                                </ChunkyButton>
                                <ChunkyButton href="/pricelist" variant="secondary">
                                    View Pricelist
                                </ChunkyButton>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, rotate: 6 }}
                            animate={{ opacity: 1, scale: 1, rotate: 3 }}
                            transition={{ delay: 0.5, duration: 1.2, ease: motionTokens.ease.out }}
                            className="lg:col-span-4 flex justify-center lg:justify-end"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-full bg-primary/40 blur-sm" />
                                <img
                                    src="/images/logo.png"
                                    alt="MemForia"
                                    className="relative h-40 w-40 md:h-52 md:w-52 rounded-full object-cover border-4 border-white shadow-[12px_12px_0_0_rgba(44,62,80,0.15)]"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <MarqueeBandReveal phrases={marqueePhrases} />

            {/* ——— MANIFESTO: Maggie "WITH MAGGIE YOU CAN" energy ——— */}
            <section className={`${art.section.pad} bg-beige border-b-2 border-charcoal/10`}>
                <div className="max-w-[1400px] mx-auto">
                    <Reveal>
                        <p className={`${art.type.label} mb-8`}>with memoforia you can</p>
                    </Reveal>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        <EditorialStack
                            lines={['Book', 'Your', 'Dream', 'Session']}
                            lineClassName="type-display block"
                            animate={false}
                        />
                        <Reveal variant="slideInRight">
                            <p className={`${art.type.body} mb-8`}>
                                We believe every picture tells a story. At MemForia we craft visual poetry — intimate
                                photobooth sessions and studio rentals in spaces designed to inspire.
                            </p>
                            <ChunkyButton href="/booking-session" variant="ghost">
                                Start booking <ArrowRight size={16} />
                            </ChunkyButton>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ——— STATS: oversized numbers ——— */}
            <section className="bg-charcoal text-white border-b-2 border-charcoal overflow-hidden">
                <div className={`${art.section.padTight} max-w-[1400px] mx-auto`}>
                    <Reveal stagger staggerChildren={0.12}>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14">
                            {[
                                { n: '500+', l: 'Happy Clients' },
                                { n: '3', l: 'Branches' },
                                { n: '10+', l: 'Packages' },
                                { n: '4.9', l: 'Rating', star: true },
                            ].map((s) => (
                                <RevealItem key={s.l}>
                                    <p className="type-stat font-serif tabular-nums">
                                        {s.n}
                                        {s.star && <Star className="inline w-[0.35em] h-[0.35em] ml-2 text-accent fill-accent" />}
                                    </p>
                                    <p className="type-label text-white/60 mt-3">{s.l}</p>
                                </RevealItem>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </section>

            <MarqueeBand phrases={['PHOTOBOOTH', 'STUDIO RENTAL', 'EVENT MEMORIES', 'PHOTOSTRIPS', 'MEMOFORIA']} variant="accent" />

            {/* ——— PHILOSOPHY: broken grid overlap ——— */}
            <section className={`${art.section.pad} max-w-[1400px] mx-auto`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <Reveal variant="slideInLeft" className="lg:col-span-5 lg:-mr-8 z-10">
                        <p className={`${art.type.label} mb-6`}>our philosophy</p>
                        <h2 className="type-display mb-8">Crafted For Memory Makers</h2>
                        <p className={art.type.body}>
                            Whether it&apos;s an intimate photobooth session or professional studio rental — top-tier
                            equipment, editorial lighting, and a team that cares about your moments.
                        </p>
                        <div className="mt-10 flex items-center gap-4">
                            <div className="h-1 w-16 bg-accent" />
                            <span className="type-label text-warm-grey">Est. 2024</span>
                        </div>
                    </Reveal>

                    <Reveal variant="scaleIn" className="lg:col-span-7 relative">
                        <div className="absolute -top-6 -right-4 md:-right-8 w-2/3 h-full bg-primary/25 rounded-3xl -z-10 rotate-2" />
                        <img
                            src={homeImages.philosophy}
                            alt="Memoforia studio"
                            className="w-full aspect-[4/5] object-cover rounded-2xl md:rounded-3xl border-2 border-charcoal/10 shadow-[12px_12px_0_0_rgba(44,62,80,0.12)]"
                            loading="lazy"
                        />
                        <LayeredCard className="absolute -bottom-6 -left-4 md:-left-8 p-5 md:p-6 !bg-primary !text-white !border-charcoal/20 max-w-[240px]">
                            <Camera size={28} className="mb-2 text-accent" />
                            <p className="font-serif text-xl">Premium Gear</p>
                            <p className="text-white/70 text-sm mt-1">Pro booth & studio setup</p>
                        </LayeredCard>
                    </Reveal>
                </div>
            </section>

            {/* ——— SERVICES: overlapping chunky cards ——— */}
            <section className={`${art.section.pad} bg-primary-50/80 border-y-2 border-charcoal/10`}>
                <div className="max-w-[1400px] mx-auto">
                    <Reveal className="mb-14 md:mb-20">
                        <p className={`${art.type.label} mb-4`}>what we offer</p>
                        <EditorialStack lines={['Our', 'Services']} lineClassName="type-display block" animate={false} />
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {[
                            { href: '/booking-session', title: 'Photobooth', sub: 'Book a session', img: homeImages.photobooth, offset: 'md:translate-y-8' },
                            { href: '/rentals', title: 'Equipment Rental', sub: 'Browse catalog', img: homeImages.rental, offset: 'md:-translate-y-4' },
                        ].map((svc, i) => (
                            <Reveal key={svc.href} variant="fadeUp" delay={i * 0.1}>
                                <Link href={svc.href} className={`block group ${svc.offset}`}>
                                    <LayeredCard className="overflow-hidden p-0 !shadow-[10px_10px_0_0_rgba(44,62,80,0.18)]">
                                        <div className="relative h-[380px] md:h-[480px] overflow-hidden">
                                            <img
                                                src={svc.img}
                                                alt={svc.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                                <h3 className="type-shout text-white !text-3xl md:!text-4xl mb-3">{svc.title}</h3>
                                                <p className="type-label text-white/80 flex items-center gap-2">
                                                    {svc.sub}
                                                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                                                </p>
                                            </div>
                                        </div>
                                    </LayeredCard>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ——— GALLERY ——— */}
            <section className={`${art.section.pad}`}>
                <div className="max-w-[1400px] mx-auto">
                    <Reveal className="mb-12 md:mb-16 max-w-3xl">
                        <p className={`${art.type.label} mb-4`}>our gallery</p>
                        <EditorialStack
                            lines={['Captured', 'Memories']}
                            lineClassName="type-display block"
                            animate={false}
                        />
                        <p className={`${art.type.body} mt-6`}>Real moments from real clients — captured at our studio.</p>
                    </Reveal>

                    <Reveal className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 broken-grid" stagger staggerChildren={0.08}>
                        {galleryPhotos.map((photo) => (
                            <GalleryTile key={photo.alt} photo={photo} />
                        ))}
                    </Reveal>
                </div>
            </section>

            <MarqueeBandReveal phrases={['READY TO SHOOT?', 'MEMOFORIA', 'BOOK TODAY']} variant="dark" />

            {/* ——— CTA + CAMERA ——— */}
            <section
                id="interactive-camera"
                className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-charcoal text-white border-t-2 border-charcoal scroll-mt-24"
            >
                {!reduced && (
                    <motion.div
                        className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-accent/30 blur-3xl"
                        animate={{ x: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    />
                )}
                <div className={`${art.section.pad} relative z-10 max-w-4xl mx-auto text-center`}>
                    <Reveal>
                        <EditorialStack
                            lines={['Ready To', 'Create', 'Memories?']}
                            lineClassName="type-display text-white block"
                            align="center"
                            animate={false}
                        />
                        <p className="text-white/75 text-lg font-light max-w-lg mx-auto mt-8 mb-4">
                            Book your photobooth session — press the shutter to open booking.
                        </p>
                    </Reveal>

                    <Reveal delay={0.15} className="my-10 md:my-14">
                        <InteractiveHangingCamera redirectTo="/booking" variant="light" />
                    </Reveal>

                    <Reveal delay={0.25} className="flex flex-col sm:flex-row justify-center gap-4">
                        <ChunkyButton href="/booking-session">Book a Session</ChunkyButton>
                        <ChunkyButton href="/branches" variant="secondary">
                            Find a Branch
                        </ChunkyButton>
                    </Reveal>
                </div>
            </section>
        </GuestLayout>
    );
}
