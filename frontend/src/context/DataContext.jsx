import React, { createContext, useContext, useState, useCallback } from "react";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [cache, setCache] = useState({});

  const getData = useCallback((key) => {
    const entry = cache[key];
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) return null;
    return entry.value;
  }, [cache]);

  const setData = useCallback((key, value, ttlMs = 60000) => {
    setCache((prev) => ({
      ...prev,
      [key]: { value, expiresAt: Date.now() + ttlMs }
    }));
  }, []);

  const isStale = useCallback((key) => {
    const entry = cache[key];
    return !entry || Date.now() > entry.expiresAt;
  }, [cache]);

  const invalidate = useCallback((keyPrefix) => {
    setCache((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const k of Object.keys(next)) {
        if (!keyPrefix || k.startsWith(keyPrefix) || k.includes(keyPrefix)) {
          delete next[k];
          changed = true;
        }
      }
      return changed ? next : prev;
    });

    try {
      if (keyPrefix) {
        if (keyPrefix.includes("products")) {
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const k = localStorage.key(i);
            if (k && k.startsWith("cached_products_")) {
              localStorage.removeItem(k);
            }
          }
        }
        if (keyPrefix.includes("categories")) {
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const k = localStorage.key(i);
            if (k && k.startsWith("cached_categories_")) {
              localStorage.removeItem(k);
            }
          }
        }
      } else {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && (k.startsWith("cached_products_") || k.startsWith("cached_categories_") || k.startsWith("cached_boutique_"))) {
            localStorage.removeItem(k);
          }
        }
      }
    } catch (e) {}
  }, []);

  return (
    <DataContext.Provider value={{ cache, getData, setData, isStale, invalidate }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
