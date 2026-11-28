/**
 * Cue Foundations · Chained Spring Arc Carousel
 * ────────────────────────────────────────────
 * A 10-card fanned wheel carousel where scroll input triggers a chained spring ripple, propagating tension outward from the leading card like a plucked string.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/chained-spring-arc-carousel.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue063
 *
 * Original Cue ID: cue063
 * Category: Sliders & Marquees
 * ────────────────────────────────────────────
 */

/**
 * Chained Spring Arc Carousel — React + TypeScript
 *
 * 10-card fanned wheel with 2-phase spring physics (entrance fan-out + chained scroll).
 * All physics runs in a ref-backed rAF loop — zero React re-renders per frame.
 *
 * Usage:
 *   import ArcCarousel from './ArcCarousel';
 *   <ArcCarousel
 *     images={[...10 urls...]}
 *     labels={['PORTRAIT', 'STREET', ...]}
 *     initialIndex={4}
 *   />
 */

import React, { useEffect, useRef, useState } from 'react';

interface ArcCarouselProps {
  images?: string[];
  labels?: string[];
  initialIndex?: number;
  gapAngle?: number;                                 // default 16°
  stiffness?: number;                                // default 0.2
  damping?: number;                                  // default 0.4
}

// Certificate images from the existing data
const CERTIFICATE_IMAGES = [
  'assets/certificates/simplilearn-intro-to-prompt-engineering-github-copilot.jpg',
  'assets/certificates/hubspot-inbound-certified.jpg',
  'assets/certificates/hubspot-sales-hub-software-certified.jpg',
  'assets/certificates/hubspot-salesforce-integration-certification.jpg',
  'assets/certificates/hubspot-social-media-marketing-ii-certified.jpg',
  'assets/certificates/hp-life-selling-online.jpg',
  'assets/certificates/hp-life-social-entrepreneurship.jpg',
  'assets/certificates/hp-life-starting-a-small-business.jpg',
  'assets/certificates/hp-life-introduction-to-digital-business-skills.jpg',
  'assets/certificates/hp-life-unique-value-proposition.jpg',
];

const CERTIFICATE_LABELS = [
  'PROMPT ENG',
  'INBOUND',
  'SALES HUB',
  'SF INTEGRATION',
  'SOCIAL MEDIA',
  'SELLING ONLINE',
  'SOCIAL ENTREP',
  'SMALL BIZ',
  'DIGITAL SKILLS',
  'VALUE PROP',
];

export default function ArcCarousel({
  images = CERTIFICATE_IMAGES,
  labels = CERTIFICATE_LABELS,
  initialIndex = 4,
  gapAngle = 16,
  stiffness = 0.2,
  damping = 0.4,
}: ArcCarouselProps) {

  const cardsElRef = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef({
    activeIndex: initialIndex,
    cards: images.map(() => ({ angle: 0, velocity: 0 })),
    isIntro: true,
    introFanning: false,
    isScrolling: false,
  });
  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    : false;

  // Seed z-index once on mount
  useEffect(() => {
    cardsElRef.current.forEach((el, i) => {
      if (el) {
        el.style.zIndex = String(images.length - Math.abs(i - initialIndex));
        // Set CSS custom property for z-index layering
        el.style.setProperty('--card-index', String(Math.abs(i - initialIndex)));
      }
    });

    // Enable fan-out after slide-up arrival
    let fanTimer: ReturnType<typeof setTimeout> | undefined;
    if (reducedMotion) {
      // Snap straight to final positions
      const st = stateRef.current;
      st.cards.forEach((c, i) => {
        c.angle = (i - st.activeIndex) * gapAngle;
        c.velocity = 0;
      });
      st.isIntro = false;
    } else {
      fanTimer = setTimeout(() => { stateRef.current.introFanning = true; }, 1000);
    }

    // Physics loop
    const step = () => {
      const st = stateRef.current;

      if (st.isIntro) {
        if (st.introFanning) {
          let settled = true;
          for (let i = 0; i < st.cards.length; i++) {
            const target = (i - st.activeIndex) * gapAngle;
            const force = (target - st.cards[i].angle) * 0.01;
            st.cards[i].velocity += force;
            st.cards[i].velocity *= 0.88;
            st.cards[i].angle    += st.cards[i].velocity;
            if (Math.abs(target - st.cards[i].angle) > 0.5 || Math.abs(st.cards[i].velocity) > 0.5) {
              settled = false;
            }
          }
          if (settled) {
            st.isIntro = false;
          }
        }
      } else {
        // Chained spring — leader = last card
        const n = st.cards.length;
        const leaderIdx = n - 1;
        const leaderTarget = (leaderIdx - st.activeIndex) * gapAngle;
        const leader = st.cards[leaderIdx];
        leader.velocity += (leaderTarget - leader.angle) * stiffness;
        leader.velocity *= damping;
        leader.angle    += leader.velocity;

        for (let i = leaderIdx - 1; i >= 0; i--) {
          const cur  = st.cards[i];
          const next = st.cards[i + 1];
          const target = next.angle - gapAngle;
          cur.velocity += (target - cur.angle) * stiffness;
          cur.velocity *= damping;
          cur.angle    += cur.velocity;
        }
      }

      // Write transforms + detect closest-to-zero
      let minAbs = Infinity;
      let closest = 0;
      st.cards.forEach((c, i) => {
        const el = cardsElRef.current[i];
        if (el) el.style.transform = `rotate(${c.angle}deg)`;
        if (Math.abs(c.angle) < minAbs) {
          minAbs = Math.abs(c.angle);
          closest = i;
        }
      });

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    // Wheel handler
    const onWheel = (e: WheelEvent) => {
      const st = stateRef.current;
      if (st.isIntro) return;
      if (Math.abs(e.deltaY) < 15) return;
      if (st.isScrolling) return;
      if (e.deltaY > 0) st.activeIndex = Math.max(0, st.activeIndex - 1);
      else              st.activeIndex = Math.min(images.length - 1, st.activeIndex + 1);
      st.isScrolling = true;
      setTimeout(() => { st.isScrolling = false; }, 400);
    };
    window.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (fanTimer) clearTimeout(fanTimer);
      window.removeEventListener('wheel', onWheel);
    };
  }, [images.length, initialIndex, gapAngle, stiffness, damping, reducedMotion]);

  return (
    <>
      <style>{CSS}</style>

      <div className="ac-carousel-wrapper">
        <div className="ac-pivot">
          {images.map((src, i) => (
            <div key={i} className="ac-card" ref={el => (cardsElRef.current[i] = el)}>
              <div className="ac-card-inner" style={{ backgroundImage: `url('${src}')` }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const CSS = `
.ac-carousel-wrapper {
  position: relative;
  width: 100%;
  max-width: 976px;
  margin: 0 auto;
  display: flex; justify-content: center; align-items: center;
  font-family: 'Inter', sans-serif;
  overflow: visible;
  height: 500px;
}

.ac-pivot {
  position: relative;
  width: 100%;
  height: 500px;
  display: flex; justify-content: center; align-items: flex-end;
}

.ac-card {
  position: absolute;
  width: 220px; height: 340px;
  left: 50%;
  transform-origin: center bottom;
  margin-left: -110px;
  bottom: 0;
  will-change: transform;
  display: flex; justify-content: center;
  z-index: calc(10 - var(--card-index, 0));
}

.ac-card-inner {
  position: absolute; inset: 0;
  border-radius: 6px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  overflow: hidden;
  background-size: cover; background-position: center;
  background-color: #fff;
  transform: translateY(0);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.ac-card:hover .ac-card-inner {
  transform: translateY(-40px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.25);
}

@media (max-width: 900px) {
  .ac-carousel-wrapper { height: 400px; }
  .ac-pivot { height: 400px; }
  .ac-card { width: 160px; height: 240px; margin-left: -80px; }
}
@media (prefers-reduced-motion: reduce) {
  .ac-card-inner { transition: none !important; }
}
`;