'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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
      className="relative h-[220vh] bg-[#11100E]"
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
          className="w-full h-full object-cover object-center opacity-90"
        />

        {/* Ambient Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-transparent to-[#11100E]/70 pointer-events-none" />

        {/* Overlaid Stages Content */}
        <div className="absolute inset-0 z-10 max-w-5xl mx-auto px-6 flex flex-col justify-center items-center text-center">
          {stages.map((stage) => (
            <motion.div
              key={stage.step}
              style={{ opacity: stage.opacity }}
              className="absolute inset-x-6 mx-auto flex flex-col items-center justify-center max-w-3xl pointer-events-none"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#1A1815]/90 border border-[#C69A45]/40 text-[#C69A45] font-sans text-xs font-bold uppercase tracking-[0.25em] mb-4 rounded">
                <Flame className="w-3.5 h-3.5 text-[#C83B22]" />
                STAGE {stage.step}
              </div>

              <h2 className="font-bebas text-4xl sm:text-6xl md:text-7xl font-normal tracking-widest text-[#F4EBDD] uppercase leading-none fire-text-glow">
                {stage.title}
              </h2>

              <p className="mt-4 font-sans text-sm sm:text-base md:text-lg text-[#F4EBDD]/90 max-w-xl font-normal leading-relaxed">
                {stage.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Section Title Header Bar */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span className="font-sans text-xs font-bold tracking-[0.25em] uppercase text-[#C69A45]">
            CRAFTING THE EXPERIENCE • FROM FIRE TO FLAVOR
          </span>
        </div>
      </div>
    </section>
  );
};
