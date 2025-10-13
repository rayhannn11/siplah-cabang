// hooks/useFetch.js
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export default function useFetch(queryKey, queryFn, options = {}) {
  const { data, isLoading, isFetching, isRefetching, isError, error, refetch } =
    useQuery({
      queryKey,
      queryFn,
      ...options,
    });

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [showRefetching, setShowRefetching] = useState(false);

  useEffect(() => {
    if (!isLoading && data !== undefined) {
      setHasLoadedOnce(true);
    }
  }, [isLoading, data]);

  // efek untuk delay refetching
  useEffect(() => {
    let timer;
    const currentlyRefetching = (isRefetching || isFetching) && hasLoadedOnce;

    if (currentlyRefetching) {
      // kasih delay 1 detik sebelum aktif
      timer = setTimeout(() => {
        setShowRefetching(true);
      }, 1000);
    } else {
      // reset jika selesai
      setShowRefetching(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [isRefetching, isFetching, hasLoadedOnce]);

  return {
    data: data ?? null,
    loading: isLoading,
    initialLoading: isLoading,
    refetching: showRefetching, // hanya true kalau > 1 detik
    error: isError ? error : null,
    refetch,
  };
}
