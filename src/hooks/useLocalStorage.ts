import { useCallback, useEffect, useState } from 'react';

function readValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

/**
 * Typed localStorage hook with JSON handling and cross-tab `storage` event sync.
 * Mirrors the `StorageService` JSON convention already used in the app.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => readValue(key, initialValue));

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? (value as (p: T) => T)(prev) : value;
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(next));
          }
        } catch {
          // quota / serialization — keep in-memory value
        }
        return next;
      });
    },
    [key],
  );

  // Sync when another tab/window writes the same key
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        if (e.newValue === null) {
          setStoredValue(initialValue);
        } else {
          setStoredValue(JSON.parse(e.newValue) as T);
        }
      } catch {
        // ignore malformed JSON from external writer
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, initialValue]);

  // Keep initialValue in sync if key already present on mount (SSR/hydration safety)
  useEffect(() => {
    setStoredValue(readValue(key, initialValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
