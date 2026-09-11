'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  isExiting?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Start exit animation before removing
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
      );
    }, 3600);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-2xl border text-sm font-medium ${
              toast.isExiting ? 'animate-toast-out' : 'animate-toast-in'
            } ${
              toast.type === 'success'
                ? 'bg-emerald-900/95 text-white border-emerald-700/50 shadow-emerald-950/20'
                : toast.type === 'error'
                ? 'bg-emerald-900/95 text-white border-emerald-700/50 shadow-emerald-950/20'
                : 'bg-stone-900/95 text-white border-stone-700/50 shadow-stone-950/20'
            }`}
            style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  toast.type === 'success'
                    ? 'bg-emerald-500/20'
                    : toast.type === 'error'
                    ? 'bg-emerald-500/20'
                    : 'bg-amber-500/20'
                }`}
              >
                {toast.type === 'success' && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-300" />}
                {toast.type === 'error' && <AlertCircle className="w-4.5 h-4.5 text-red-300" />}
                {toast.type === 'info' && <Info className="w-4.5 h-4.5 text-amber-300" />}
              </div>
              <span className="text-[13px] leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-white/50 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors shrink-0"
              aria-label="Close toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
