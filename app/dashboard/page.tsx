"use client";

import { useEffect, useState } from "react";
import { TemperatureCard } from "@/components/custom/ui/TemperatureCard";
import { HumidityCard } from "@/components/custom/ui/HumidityCard";
import { getDHT11LatestReading } from "@/services/dht11Service";
import { DHT11Reading } from "@/types/dht11";
import ChartCard from "@/components/custom/ui/ChartCard";

export default function Dashboard() {
  const [reading, setReading] = useState<DHT11Reading | null>(null);

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      console.log("Fetching initial data...");
      try {
        const data = await getDHT11LatestReading();
        console.log("Initial data received:", data);
        setReading(data);
      } catch (err) {
        console.error("Failed to fetch initial reading:", err);
      }
    };

    fetchInitialData();

    // Create EventSource for SSE
    const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/v1/events`;

    const eventSource = new EventSource(url);

    // Listen for the custom event
    eventSource.addEventListener("dht11_reading_created", async (event) => {
      try {
        const data = await getDHT11LatestReading();
        console.log("New reading fetched:", data);
        setReading(data);
      } catch (err) {
        console.error("Failed to fetch reading:", err);
      }
    });

    eventSource.onerror = (error) => {
      console.error("❌ SSE connection error:", error);
    };

    return () => {
      eventSource.close();
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
        <div className="col-span-2 mt-6">
          <ChartCard />
        </div>
      </div>
    </div>
  );
}
