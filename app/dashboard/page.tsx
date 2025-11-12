"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProviderClient";
import { TemperatureCard } from "@/components/custom/ui/TemperatureCard";
import { HumidityCard } from "@/components/custom/ui/HumidityCard";
import { getDHT11LatestReading } from "@/services/dht11Service";
import { DHT11Reading } from "@/types/dht11";
import ApexChart from "@/components/custom/ui/ApexChart";

export default function Dashboard() {
  const [reading, setReading] = useState<DHT11Reading | null>(null);
  const { currentUser, logout } = useAuth();

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="mb-2 text-4xl font-semibold text-foreground">Environmental Status</h1>
          <p className="text-sm text-muted-foreground">Real-time temperature and humidity monitoring</p>
        </div>
        <div className="text-right">
          {currentUser ? (
            <div className="text-sm">
              <div>Signed in as <strong>{currentUser.name}</strong></div>
              <div className="text-xs text-muted-foreground">Role: {currentUser.role}</div>
              <button onClick={() => logout()} className="mt-2 text-red-600 text-sm">Sign out</button>
            </div>
          ) : (
            <div className="text-sm">Not signed in</div>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-2xl">
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
          <ApexChart />
        </div>
      </div>
    </div>
  );
}