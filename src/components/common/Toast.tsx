import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type ToastKind = 'success' | 'info' | 'error';

export interface ToastItem {
  id: string;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  toasts: ToastItem[];
  success: (message: string) => void;
  info: (message: string) => void;
  error: (message: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const AUTO_DISMISS_MS = 2800;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timers.current.get(id);
    if (handle !== undefined) {
      window.clearTimeout(handle);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, kind, message }]);
      const handle = window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
      timers.current.set(id, handle);
    },
    [dismiss],
  );

  const success = useCallback((message: string) => push('success', message), [push]);
  const info = useCallback((message: string) => push('info', message), [push]);
  const error = useCallback((message: string) => push('error', message), [push]);

  useEffect(() => {
    return () => {
      timers.current.forEach((h) => window.clearTimeout(h));
      timers.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, success, info, error, dismiss }}>
      {children}
      {/* Viewport — fixed top-center, glass style, pointer events passthrough */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed top-4 left-1/2 z-[60] flex w-[92vw] max-w-sm -translate-x-1/2 flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={[
              'pointer-events-auto flex items-start gap-3 rounded-2xl border-2 px-4 py-3 shadow-lg backdrop-blur-md',
              'bg-white/85 supports-[backdrop-filter]:bg-white/70',
              'animate-fadeIn',
              t.kind === 'success'
                ? 'border-[var(--green)]/20 bg-[var(--green)]/10'
                : t.kind === 'error'
                  ? 'border-[var(--red)]/20 bg-[#fff1f1]/90'
                  : 'border-[var(--blue)]/20 bg-[#eef8ff]/90',
            ].join(' ')}
          >
            <span
              className={[
                'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border-b-4 text-sm font-black text-white shadow-sm',
                t.kind === 'success'
                  ? 'bg-[var(--green)] border-[var(--green-shadow)]'
                  : t.kind === 'error'
                    ? 'bg-[var(--red)] border-[#c0392b]'
                    : 'bg-[var(--blue)] border-[#0a8ed0]',
              ].join(' ')}
              aria-hidden
            >
              {t.kind === 'success' ? '✓' : t.kind === 'error' ? '!' : 'i'}
            </span>
            <p className="flex-1 pt-0.5 text-sm font-bold leading-snug text-[var(--dark-blue)]">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="ml-1 shrink-0 rounded-full p-1 text-[var(--gray-light)] hover:bg-black/5 hover:text-[var(--dark-blue)]"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
};

export default ToastProvider;
