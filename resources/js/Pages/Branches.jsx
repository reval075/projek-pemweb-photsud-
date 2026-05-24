import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Branches() {
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
                    <p className="text-primary uppercase tracking-widest text-sm mb-4">Find Us</p>
                    <h1 className="text-4xl md:text-6xl font-serif mb-6">Our Branches</h1>
                    <p className="text-slate text-lg font-light max-w-2xl mx-auto">
                        We have multiple locations ready to serve you. Find the MemForia studio closest to you.
                    </p>
                </motion.div>

                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-primary/5 max-w-4xl mx-auto border border-primary-50">
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-serif text-charcoal mb-4">Branches Map Integration In Progress</h3>
                        <p className="text-slate font-light">The list of locations and interactive map will appear here.</p>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
