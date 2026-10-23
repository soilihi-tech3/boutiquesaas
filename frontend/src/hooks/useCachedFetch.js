import { useEffect, useState, useCallback } from "react";
import api from "../api";
import { useData } from "../context/DataContext";

/**
 * Custom React hook for fetching API endpoints with client-side caching.
 * Prevents redundant HTTP requests during page navigation.
 */
export function useCachedFetch(cacheKey, fetcherFnOrUrl, params = {}, options = {}) {
  const { getData, setData, isStale, invalidate } = useData();
  const [data, setDataState] = useState(() => (cacheKey ? getData(cacheKey) : null));
  const [loading, setLoading] = useState(() => (cacheKey ? isStale(cacheKey) : true));
  const [error, setError] = useState(null);

  const executeFetch = useCallback(async (force = false) => {
    if (!cacheKey) return;

    if (!force && !isStale(cacheKey)) {
      const cached = getData(cacheKey);
      if (cached !== null) {
        setDataState(cached);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      let result;
      if (typeof fetcherFnOrUrl === "function") {
        result = await fetcherFnOrUrl();
      } else {
        const res = await api.get(fetcherFnOrUrl, { params });
        result = res.data;
      }
      setData(cacheKey, result, options.ttl || 60000);
      setDataState(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, fetcherFnOrUrl, JSON.stringify(params), getData, setData, isStale, options.ttl]);

  useEffect(() => {
    let cancelled = false;
    executeFetch().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [cacheKey, executeFetch]);

  const refetch = useCallback(() => {
    if (cacheKey) invalidate(cacheKey);
    return executeFetch(true);
  }, [cacheKey, invalidate, executeFetch]);

  return { data, loading, error, refetch };
}
