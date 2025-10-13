// src/hooks/useResponsive.js
import { useEffect, useState } from "react";

/**
 * Mengembalikan status responsif: isMobile, isTablet, isDesktop
 */
export default function useResponsive() {
  const [size, setSize] = useState(() => getDeviceSize());

  function getDeviceSize() {
    const width = typeof window !== "undefined" ? window.innerWidth : 1024;

    return {
      isMobile: width <= 767,
      isTablet: width > 767 && width <= 1024,
      isDesktop: width > 1024,
    };
  }

  useEffect(() => {
    const handleResize = () => setSize(getDeviceSize());

    window.addEventListener("resize", handleResize);
    handleResize(); // initial run

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
