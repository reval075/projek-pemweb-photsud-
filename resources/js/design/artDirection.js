/**
 * Memoforia × Maggie visual system — class tokens & layout rhythm.
 */

export const art = {
    type: {
        mega: 'type-mega font-serif font-medium text-charcoal',
        display: 'type-display font-serif font-medium text-charcoal',
        shout: 'type-shout font-sans text-charcoal',
        stat: 'type-stat font-serif text-white',
        label: 'type-label font-sans text-primary-dark',
        body: 'text-base md:text-lg font-light text-slate leading-relaxed',
    },
    section: {
        pad: 'px-5 sm:px-8 md:px-12 lg:px-16 py-20 md:py-28 lg:py-36',
        padTight: 'px-5 sm:px-8 md:px-12 py-14 md:py-20',
    },
    card: {
        base: 'relative bg-white rounded-2xl md:rounded-3xl border-2 border-charcoal/10 shadow-[8px_8px_0_0_rgba(44,62,80,0.12)]',
        offset: 'before:absolute before:inset-0 before:translate-x-2 before:translate-y-2 before:rounded-2xl before:bg-primary/20 before:-z-10',
    },
    btn: {
        primary:
            'inline-flex items-center justify-center gap-2 font-sans font-bold uppercase tracking-widest text-sm md:text-base px-8 md:px-12 py-4 md:py-5 rounded-full bg-primary text-white border-2 border-charcoal/10 shadow-[6px_6px_0_0_rgba(44,62,80,0.2)]',
        secondary:
            'inline-flex items-center justify-center gap-2 font-sans font-bold uppercase tracking-widest text-sm md:text-base px-8 md:px-12 py-4 md:py-5 rounded-full bg-white text-charcoal border-2 border-charcoal/15 shadow-[6px_6px_0_0_rgba(155,181,211,0.45)]',
        ghost:
            'inline-flex items-center justify-center gap-2 font-sans font-bold uppercase tracking-widest text-xs md:text-sm px-6 py-3 rounded-full border-2 border-charcoal/20 text-charcoal',
    },
};

export const marqueePhrases = [
    'BOOK YOUR SESSION',
    'CAPTURE THE MOMENT',
    'PRINT THE MEMORY',
    'KEEP IT FOREVER',
    'MEMOFORIA',
];
