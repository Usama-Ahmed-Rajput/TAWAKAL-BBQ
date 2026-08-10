'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown, Flame, ShoppingBag, Utensils } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  // Check mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      className="relative w-full h-[100svh] min-h-[650px] overflow-hidden bg-[#070707] flex items-center justify-center"
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
          className="w-full h-full object-cover opacity-90"
        />

        {/* Light subtle top and bottom gradient mask only for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/50 pointer-events-none" />
      </div>

      {/* 3D Ember Particles supporting layer */}
      <BBQScene emberCount={90} />

      {/* Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center pt-28 sm:pt-32 pb-16">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#191919]/90 border border-[#FF6A00]/40 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(255,106,0,0.25)]"
        >
          <Flame className="w-4 h-4 text-[#FF6A00] animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#FF9D32]">
            Authentic Pakistani BBQ
          </span>
        </motion.div>

        {/* Main Tagline Title (No TAWAKAL BBQ text over video) */}
        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-widest text-[#F5F1EA] uppercase leading-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)]"
        >
          WHERE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] via-[#FF9D32] to-[#FF6A00] fire-text-glow">FIRE</span> MEETS FLAVOR
        </motion.h1>

        {/* Short description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-6 text-sm sm:text-lg md:text-xl text-[#F5F1EA]/90 max-w-2xl font-light tracking-wide leading-relaxed"
        >
          Live charcoal grilling, heritage spices, and signature platters prepared for the true meat connoisseur.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
        >
          <Button
            id="hero-explore-btn"
            href="#menu"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Utensils className="w-5 h-5 mr-2" />
            EXPLORE MENU
          </Button>

          <Button
            id="hero-order-btn"
            onClick={onOrderClick}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <ShoppingBag className="w-5 h-5 mr-2 text-[#FF6A00]" />
            ORDER NOW
          </Button>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#A7A7A7] font-semibold">
          SCROLL TO EXPERIENCE
        </span>
        <div className="w-6 h-10 rounded-full border border-[#FF6A00]/40 flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-1.5 h-2.5 bg-[#FF6A00] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};
