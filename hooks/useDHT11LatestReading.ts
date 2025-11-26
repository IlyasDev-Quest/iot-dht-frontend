"use client";

import { useEffect, useState } from "react";
import { getDHT11LatestReading } from "@/services/dht11Service";
import { DHT11Reading } from "@/types/dht11";

export const useDHT11LatestReading = () => {
  const [reading, setReading] = useState<DHT11Reading | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getDHT11LatestReading();
        setReading(data);
      } catch (err) {
        console.error("Failed to fetch initial reading:", err);
        setError("Failed to fetch initial reading");
      }
    };

    fetchInitialData();

    const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/v1/events`;
    const eventSource = new EventSource(url);

    const handleNewReading = async () => {
      try {
        const data = await getDHT11LatestReading();
        setReading(data);
      } catch (err) {
        console.error("Failed to fetch reading:", err);
        setError("Failed to fetch reading");
      }
    };

    eventSource.addEventListener("dht11_reading_created", handleNewReading);

    eventSource.onerror = (err) => {
      console.error("❌ SSE connection error:", err);
      setError("SSE connection error");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { reading, error };
};
