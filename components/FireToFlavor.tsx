'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

export const FireToFlavor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  // Track video duration & trigger play
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration || 10);
      videoRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Video scroll-scrubbing effect
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
      } else {
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

  // Stage text transforms
  // Stage 1: 0 - 0.25
  // Stage 2: 0.25 - 0.50
  // Stage 3: 0.50 - 0.75
  // Stage 4: 0.75 - 1.0
  const stage1Opacity = useTransform(smoothProgress, [0, 0.15, 0.22, 0.28], [1, 1, 1, 0]);
  const stage2Opacity = useTransform(smoothProgress, [0.22, 0.28, 0.45, 0.52], [0, 1, 1, 0]);
  const stage3Opacity = useTransform(smoothProgress, [0.48, 0.53, 0.70, 0.78], [0, 1, 1, 0]);
  const stage4Opacity = useTransform(smoothProgress, [0.73, 0.78, 0.95, 1.00], [0, 1, 1, 1]);

  const stages = [
    {
      opacity: stage1Opacity,
      step: '01',
      title: 'MARINATED WITH PURPOSE',
      desc: 'Raw tender cuts submerged for 24 hours in yogurt, mustard oils and stone-pounded secret seasonings.',
    },
    {
      opacity: stage2Opacity,
      step: '02',
      title: 'GRILLED OVER REAL FIRE',
      desc: 'Seared directly above glowing red hardwood charcoal to lock in savory natural juices.',
    },
    {
      opacity: stage3Opacity,
      step: '03',
      title: 'FINISHED TO PERFECTION',
      desc: 'Basted with aromatic clarified ghee and dusted with roasted crushed spice blend before serving.',
    },
    {
      opacity: stage4Opacity,
      step: '04',
      title: 'MADE FOR THE TABLE',
      desc: 'Served searing hot on cast-iron platters alongside warm puri parathas and mint chutneys.',
    },
  ];

  return (
    <section
      ref={containerRef}
      id="from-fire"
      className="relative h-[220vh] bg-[#070707]"
    >
      {/* Sticky Fullscreen Video Window */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          src="/videos/from-fire-to-flavor.mp4"
          onLoadedMetadata={handleLoadedMetadata}
          muted
          playsInline
          loop
          autoPlay
          preload="auto"
          className="w-full h-full object-cover opacity-90"
        />

        {/* Ambient Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/60 pointer-events-none" />

        {/* Overlaid Stages Content */}
        <div className="absolute inset-0 z-10 max-w-5xl mx-auto px-6 flex flex-col justify-center items-center text-center">
          {stages.map((stage) => (
            <motion.div
              key={stage.step}
              style={{ opacity: stage.opacity }}
              className="absolute inset-x-6 mx-auto flex flex-col items-center justify-center max-w-3xl pointer-events-none"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#191919]/90 border border-[#FF6A00]/40 text-[#FF9D32] text-xs font-semibold uppercase tracking-[0.3em] mb-4">
                <Flame className="w-3.5 h-3.5 text-[#FF6A00]" />
                STAGE {stage.step}
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-widest text-[#F5F1EA] uppercase leading-tight fire-text-glow">
                {stage.title}
              </h2>

              <p className="mt-6 text-sm sm:text-lg text-[#A7A7A7] max-w-xl font-light tracking-wide leading-relaxed">
                {stage.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Section Title Header Bar */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#FF6A00]/80">
            CRAFTING THE EXPERIENCE • FROM FIRE TO FLAVOR
          </span>
        </div>
      </div>
    </section>
  );
};
