"use client";

import { TemperatureCard } from "@/components/custom/ui/TemperatureCard";
import { HumidityCard } from "@/components/custom/ui/HumidityCard";

export default function Home() {
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
            value={25}
            timestamp="2025-11-02T18:45:00Z"
          />
          <HumidityCard
            value={60}
            timestamp="2025-11-02T18:45:00Z"
          />
        </div>
      </div>
    </div>
  );
}
