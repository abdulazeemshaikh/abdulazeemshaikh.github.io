import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ChevronLeft, ChevronRight, X, ArrowUpRight, ExternalLink } from 'lucide-react';
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
    <section className="w-full max-w-7xl order-2 sm:order-3">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 w-full mb-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <Award size={14} strokeWidth={1.8} className="text-black/35" />
            <h2 className="text-sm font-bold tracking-tight text-black">Certificates</h2>
            <span className="text-[10px] font-medium text-black/30 tabular-nums">
              {CERTIFICATES.length}
            </span>
          </div>
          <p className="text-[11px] text-black/40 mt-0.5">
            Courses and certifications I've completed.
          </p>
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

      {/* Horizontal snap carousel */}
      <div
        ref={scrollerRef}
        className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1"
      >
        {CERTIFICATES.map((certificate, index) => (
          <button
            key={certificate.id}
            data-cert-card
            type="button"
            onClick={() => setActiveIndex(index)}
            className="snap-start shrink-0 w-[210px] sm:w-[240px] text-left group cursor-pointer"
            aria-label={`View ${certificate.title} certificate`}
          >
            <div className="relative aspect-[1.414/1] overflow-hidden bg-white border border-black/5 group-hover:border-black/15 transition-colors">
              <img
                src={certificate.preview}
                alt={`${certificate.title} certificate`}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute bottom-2 right-2 text-[9px] font-semibold uppercase tracking-[0.12em] bg-white/90 backdrop-blur-sm text-black px-2 py-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                View
              </span>
            </div>

            <div className="pt-2.5 pr-1">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/35">
                {certificate.issuer}
              </p>
              <h3 className="text-[12px] font-semibold text-black leading-snug mt-1 line-clamp-2">
                {certificate.title}
              </h3>
              <p className="text-[10px] text-black/40 mt-1">{certificate.date}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Certificate modal */}
      <AnimatePresence>
        {activeCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[130] flex items-center justify-center p-4 sm:p-8"
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

            <motion.div
              key={activeCertificate.id}
              initial={{ scale: 0.94, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col w-full max-w-4xl max-h-[90vh] bg-white shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label={activeCertificate.title}
            >
              <div className="flex-1 min-h-0 bg-[#F4F4F4] flex items-center justify-center p-3 sm:p-5">
                <img
                  src={activeCertificate.preview}
                  alt={`${activeCertificate.title} certificate`}
                  className="max-h-[58vh] sm:max-h-[62vh] w-auto max-w-full object-contain shadow-sm select-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 p-5 sm:p-6 border-t border-black/5">
                <div className="text-left min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/35">
                    {activeCertificate.issuer}
                  </p>
                  <h3 className="text-base sm:text-lg font-semibold text-black leading-tight mt-1">
                    {activeCertificate.title}
                  </h3>
                  <p className="text-[11px] text-black/40 mt-1">
                    {activeCertificate.date}
                    {activeCertificate.credentialId && (
                      <span className="text-black/30"> · ID {activeCertificate.credentialId}</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activeCertificate.credentialUrl && (
                    <a
                      href={activeCertificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-black/60 hover:text-black border border-black/10 hover:border-black/25 px-3 py-2 transition-colors"
                    >
                      <ExternalLink size={12} strokeWidth={1.8} />
                      Verify
                    </a>
                  )}
                  <a
                    href={activeCertificate.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-black hover:bg-black/85 px-3.5 py-2 transition-colors"
                  >
                    Open {activeCertificate.fileType === 'pdf' ? 'PDF' : 'image'}
                    <ArrowUpRight size={13} strokeWidth={1.8} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertificatesCarousel;
