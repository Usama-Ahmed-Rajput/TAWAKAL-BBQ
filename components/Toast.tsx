'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

export function Toast({ message }: ToastProps) {
  const { showToast } = useToast();

  React.useEffect(() => {
    if (message) {
      showToast(message, 'info');
    }
  }, [message, showToast]);

  return null;
}
