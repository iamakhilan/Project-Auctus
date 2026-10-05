import { useEffect, useRef } from 'react';
import { useToast } from './Toast';
import { getLastPersistenceError, subscribePersistenceError } from '../../services/storage';

export const PersistenceErrorBridge: React.FC = () => {
  const { error } = useToast();
  const lastShownRef = useRef(0);

  useEffect(() => {
    const maybeShow = (key: string) => {
      const now = Date.now();
      if (now - lastShownRef.current < 8000) return;
      lastShownRef.current = now;
      error(`Save failed \u2014 storage unavailable (${key}). Progress may not persist after reload.`);
    };

    const last = getLastPersistenceError();
    if (last && Date.now() - last.timestamp < 5000) {
      maybeShow(last.key);
    }

    const unsubscribe = subscribePersistenceError((evt) => {
      maybeShow(evt.key);
    });

    const handleCustomEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key?: string } | undefined;
      if (detail?.key) maybeShow(detail.key);
    };
    window.addEventListener('auctus:persistence-error', handleCustomEvent as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('auctus:persistence-error', handleCustomEvent as EventListener);
    };
  }, [error]);

  return null;
};

export default PersistenceErrorBridge;
