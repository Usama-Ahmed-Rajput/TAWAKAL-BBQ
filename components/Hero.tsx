'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Flame, ShoppingBag, Utensils } from 'lucide-react';
import { Button } from './ui/Button';
import dynamic from 'next/dynamic';

const BBQScene = dynamic(() => import('./3d/BBQScene'), { ssr: false });

interface HeroProps {
  onOrderClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  // Track hero scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Scroll indicator opacity
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Video loaded metadata handler & immediate play trigger
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration || 10);
      setVideoLoaded(true);
      videoRef.current.play().catch(() => {});
    }
  };

  // Ensure video plays on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Scroll scrubbing for video when scrolling through hero
  useEffect(() => {
    if (!videoRef.current || videoDuration === 0) return;

    let animationFrameId: number;
    let targetTime = 0;
    let isUserScrolling = false;

    const unsubscribe = smoothProgress.on('change', (latest) => {
      const progress = Math.max(0, Math.min(1, latest));
      if (progress > 0.001 && progress < 0.999) {
        isUserScrolling = true;
        targetTime = progress * videoDuration;
      } else if (progress <= 0.001) {
        isUserScrolling = false;
      }
    });

    const updateVideoTime = () => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        if (isUserScrolling) {
          const current = videoRef.current.currentTime;
          const diff = targetTime - current;
          if (Math.abs(diff) > 0.01) {
            videoRef.current.currentTime = current + diff * 0.18;
          }
        } else if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        }
      }
      animationFrameId = requestAnimationFrame(updateVideoTime);
    };

    animationFrameId = requestAnimationFrame(updateVideoTime);

    return () => {
      unsubscribe();
      cancelAnimationFrame(animationFrameId);
    };
  }, [smoothProgress, videoDuration]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full min-h-[680px] lg:min-h-[min(850px,92vh)] overflow-hidden bg-[var(--color-bg)] flex items-center justify-center"
    >
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src="/videos/hero-bbq.mp4"
          onLoadedMetadata={handleLoadedMetadata}
          muted
          playsInline
          loop
          autoPlay
          preload="auto"
          className="w-full h-full object-cover object-center opacity-85"
        />

        {/* Design System Readability Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(17,16,14,0.88)] via-[rgba(17,16,14,0.60)] to-[rgba(17,16,14,0.20)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* 3D Ember Particles supporting layer */}
      <BBQScene emberCount={80} />

      {/* Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center pt-28 sm:pt-32 pb-16">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-surface)]/90 border border-[var(--color-gold)]/40 backdrop-blur-md mb-5 shadow-lg"
        >
          <Flame className="w-4 h-4 text-[var(--color-primary)] animate-pulse" />
          <span className="text-eyebrow text-[var(--color-gold)]">
            Authentic Pakistani BBQ
          </span>
        </motion.div>

        {/* Main Heading Group (TAWAKAL BBQ + WHERE FIRE MEETS FLAVOR) */}
        <div className="flex flex-col items-center gap-1 max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-display text-3xl sm:text-5xl md:text-6xl font-normal tracking-widest text-[var(--color-primary)] uppercase fire-text-glow leading-none"
          >
            TAWAKAL <span className="text-[var(--color-text)]">BBQ</span>
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="text-hero text-[var(--color-text)] drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
          >
            WHERE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-orange)] to-[var(--color-primary)]">FIRE</span> MEETS FLAVOR
          </motion.h1>
        </div>

        {/* Short description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-4 text-body text-[var(--color-text-secondary)] max-w-xl text-center"
        >
          Live charcoal grilling, heritage spices, and signature platters prepared for the true meat connoisseur.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Button
            id="hero-order-btn"
            onClick={onOrderClick}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            ORDER NOW
          </Button>

          <Button
            id="hero-explore-btn"
            href="#menu"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Utensils className="w-5 h-5 mr-2 text-[var(--color-orange)]" />
            EXPLORE MENU
          </Button>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-small text-[var(--color-text-muted)] tracking-[0.25em] uppercase">
          SCROLL TO EXPERIENCE
        </span>
        <div className="w-6 h-10 rounded-full border border-[var(--color-border-strong)] flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-1.5 h-2.5 bg-[var(--color-primary)] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};
