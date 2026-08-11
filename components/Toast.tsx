'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export function Toast({ message }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 bg-[#1A1815] border border-[#C69A45]/40 text-[#F4EBDD] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
        >
          <div className="w-8 h-8 rounded-full bg-[#4CAF50]/20 border border-[#4CAF50]/40 flex items-center justify-center text-[#4CAF50]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#C69A45] block">
              Cart Notification
            </span>
            <span className="font-sans text-xs text-[#F4EBDD] font-medium">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
