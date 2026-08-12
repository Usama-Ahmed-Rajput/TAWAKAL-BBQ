'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
  };
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, type, message };

      setToasts((prev) => [...prev.slice(-4), newToast]); // Keep maximum 5 toasts

      // Auto-dismiss after 3.5s
      setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast]
  );

  const toast = {
    success: (msg: string) => showToast(msg, 'success'),
    error: (msg: string) => showToast(msg, 'error'),
    warning: (msg: string) => showToast(msg, 'warning'),
    info: (msg: string) => showToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={{ showToast, toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer: React.FC<{
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence mode="sync">
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.85)] border backdrop-blur-xl ${getToastStyles(
              item.type
            )}`}
          >
            <div className="shrink-0 pt-0.5">{getToastIcon(item.type)}</div>
            <div className="flex-1 min-w-0">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest block mb-0.5 opacity-80">
                {item.type}
              </span>
              <p className="font-sans text-xs font-semibold leading-snug break-words text-[#F4EBDD]">
                {item.message}
              </p>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="shrink-0 text-white/50 hover:text-white transition-colors p-1 -mr-1 rounded-lg"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

function getToastIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-[#E53935]" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-[#FFB300]" />;
    case 'info':
    default:
      return <Info className="w-5 h-5 text-[#29B6F6]" />;
  }
}

function getToastStyles(type: ToastType) {
  switch (type) {
    case 'success':
      return 'bg-[#142217]/95 border-[#4CAF50]/40 text-[#E8F5E9]';
    case 'error':
      return 'bg-[#261414]/95 border-[#E53935]/40 text-[#FFEBEE]';
    case 'warning':
      return 'bg-[#241E12]/95 border-[#FFB300]/40 text-[#FFF8E1]';
    case 'info':
    default:
      return 'bg-[#141C24]/95 border-[#29B6F6]/40 text-[#E1F5FE]';
  }
}
