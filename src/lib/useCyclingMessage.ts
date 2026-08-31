"use client";

import { useEffect, useState } from "react";

// While `active` is true, cycles through `messages` every `intervalMs`, giving
// the person something specific and reassuring to read during real backend
// latency (e.g. an actual Gemini call) instead of a static "Loading…".
export function useCyclingMessage(messages: string[], active: boolean, intervalMs = 1400): string {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, intervalMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, intervalMs, messages.length]);

  return messages[index];
}
