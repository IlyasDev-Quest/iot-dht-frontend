"use client";

import { useEffect, useState } from "react";
import { TemperatureCard } from "@/components/custom/ui/TemperatureCard";
import { HumidityCard } from "@/components/custom/ui/HumidityCard";
import { getDHT11LatestReading } from "@/services/dht11Service";
import { DHT11Reading } from "@/types/dht11";

export default function Dashboard() {
  const [reading, setReading] = useState<DHT11Reading | null>(null);

  useEffect(() => {
    let isMounted = true; // prevent state updates after unmount
    const intervalMs = 5000; // fetch every 5 seconds

    const fetchData = async () => {
      try {
        const data = await getDHT11LatestReading();
        if (isMounted) setReading(data);
      } catch (error) {
        console.error("Failed to fetch DHT11 reading:", error);
      }
    };

    // Initial fetch immediately
    fetchData();

    // Polling
    const interval = setInterval(fetchData, intervalMs);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-4xl font-semibold text-foreground">
          Environmental Status
        </h1>
        <p className="mb-8 text-muted-foreground">
          Real-time temperature and humidity monitoring
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <TemperatureCard
            value={reading?.temperature ?? 0}
            timestamp={reading?.timestamp ?? ""}
          />
          <HumidityCard
            value={reading?.humidity ?? 0}
            timestamp={reading?.timestamp ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
