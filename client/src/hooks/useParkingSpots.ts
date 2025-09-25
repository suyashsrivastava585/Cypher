// src/hooks/useParkingSpots.ts
import { useEffect, useState } from "react";
import type { Spot } from "@/types/parking";

export function useParkingSpots(pollInterval = 3000) {
  const [spots, setSpots] = useState<Spot[]>([]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let ws: WebSocket | null = null;
    let fallbackTimeout: ReturnType<typeof setTimeout> | null = null;

    const fetchAll = async () => {
      try {
        // primary REST endpoint (expected from backend)
        const res = await fetch("/api/spots");
        if (res.ok) {
          const data = await res.json();
          setSpots(data);
          return;
        }
      } catch (e) {
        // ignore, try fallback
      }

      try {
        // fallback for local dev: public/spots.json
        const res2 = await fetch("/spots.json");
        if (res2.ok) {
          const data = await res2.json();
          setSpots(data);
        }
      } catch (e) {
        // ignore
      }
    };

    // initial fetch
    fetchAll();

    // Try WebSocket connection (preferred)
    try {
      ws = new WebSocket("ws://localhost:4000");

      ws.onopen = () => {
        console.log("[useParkingSpots] WebSocket connected");
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          // If backend sends full list:
          if (Array.isArray(msg)) {
            setSpots(msg);
            return;
          }

          // If backend sends a single update { block, number, status }
          if (
            msg &&
            msg.block &&
            typeof msg.number === "number" &&
            msg.status
          ) {
            setSpots((prev) => {
              const idx = prev.findIndex(
                (s) => s.block === msg.block && s.number === msg.number
              );
              if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = { ...copy[idx], status: msg.status };
                return copy;
              }
              // optional: if you don't have initial list, you might push
              return prev;
            });
          }
        } catch (e) {
          // ignore parse errors
        }
      };

      ws.onclose = () => {
        console.log(
          "[useParkingSpots] WebSocket closed — falling back to polling"
        );
        if (!intervalId) intervalId = setInterval(fetchAll, pollInterval);
      };

      ws.onerror = (err) => {
        console.warn("[useParkingSpots] WebSocket error", err);
      };
    } catch (e) {
      console.warn("[useParkingSpots] WebSocket setup failed — using polling");
      if (!intervalId) intervalId = setInterval(fetchAll, pollInterval);
    }

    // If ws doesn't open within 2s, start polling as fallback
    fallbackTimeout = setTimeout(() => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        if (!intervalId) intervalId = setInterval(fetchAll, pollInterval);
      }
    }, 2000);

    return () => {
      if (ws) ws.close();
      if (intervalId) clearInterval(intervalId);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, [pollInterval]);

  return spots;
}
