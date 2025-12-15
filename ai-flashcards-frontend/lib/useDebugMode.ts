"use client";

import { useState, useEffect } from "react";

const DEBUG_MODE_KEY = "debug_mode_enabled";
const isDevelopment = process.env.NODE_ENV === "development";

export function useDebugMode() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (!isDevelopment) {
      setIsEnabled(false);
      return;
    }

    const stored = localStorage.getItem(DEBUG_MODE_KEY);
    if (stored === "true") {
      setIsEnabled(true);
    }
  }, []);

  const toggle = () => {
    if (!isDevelopment) return;

    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem(DEBUG_MODE_KEY, newValue.toString());
  };

  return {
    isEnabled: isEnabled && isDevelopment,
    toggle,
    isAvailable: isDevelopment,
  };
}
