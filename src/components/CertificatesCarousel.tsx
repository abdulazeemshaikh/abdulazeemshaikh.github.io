import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { CERTIFICATES } from '../data/certificates';

export const CertificatesCarousel: React.FC = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  const scrollCarousel = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-cert-card]');
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveIndex((i) => (i === null ? null : (i + 1) % CERTIFICATES.length));
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((i) =>
          i === null ? null : (i - 1 + CERTIFICATES.length) % CERTIFICATES.length
        );
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex]);

  const activeCertificate = activeIndex === null ? null : CERTIFICATES[activeIndex];

  return (
    <section className="w-full max-w-7xl order-2 sm:order-3 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 w-full mb-4">
        <div className="flex items-center gap-2">
          <Award size={14} strokeWidth={1.8} className="text-black/35" />
          <h2 className="text-sm font-bold tracking-tight text-black">Certificates</h2>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => scrollCarousel(-1)}
            disabled={!canScrollLeft}
            aria-label="Previous certificates"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-black/10 text-black/60 hover:text-black hover:border-black/25 hover:bg-black/[0.03] transition-all disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
          >
            <ChevronLeft size={16} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel(1)}
            disabled={!canScrollRight}
            aria-label="Next certificates"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-black/10 text-black/60 hover:text-black hover:border-black/25 hover:bg-black/[0.03] transition-all disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
          >
            <ChevronRight size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Horizontal snap carousel — extends to the right edge of the viewport */}
      <div
        ref={scrollerRef}
        className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 w-[calc(100%_+_(100vw_-_100%)/2)]"
      >
        {CERTIFICATES.map((certificate, index) => (
          <button
            key={certificate.id}
            data-cert-card
            type="button"
            onClick={() => setActiveIndex(index)}
            className="snap-start shrink-0 w-[210px] sm:w-[240px] text-left cursor-pointer p-0 bg-transparent border-0"
            aria-label={`View ${certificate.title} certificate`}
          >
            <div className="relative aspect-[1.414/1] overflow-hidden bg-white border border-black/5">
              <img
                src={certificate.preview}
                alt={`${certificate.title} certificate`}
                loading="lazy"
                className="w-full h-full object-cover object-top select-none"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Large image pop-up */}
      <AnimatePresence>
        {activeCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[130] flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 z-20"
              aria-label="Close certificate"
            >
              <X size={20} />
            </button>

            {CERTIFICATES.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(
                      (i) => (i === null ? null : (i - 1 + CERTIFICATES.length) % CERTIFICATES.length)
                    );
                  }}
                  aria-label="Previous certificate"
                  className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 active:scale-95"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((i) => (i === null ? null : (i + 1) % CERTIFICATES.length));
                  }}
                  aria-label="Next certificate"
                  className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200 active:scale-95"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <motion.img
              key={activeCertificate.id}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              src={activeCertificate.preview}
              alt={`${activeCertificate.title} certificate`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[92vw] max-h-[88vh] w-auto h-auto object-contain rounded-lg shadow-2xl select-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertificatesCarousel;
