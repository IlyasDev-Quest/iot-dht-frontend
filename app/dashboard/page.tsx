"use client";

import { TemperatureCard } from "@/components/custom/ui/TemperatureCard";
import { HumidityCard } from "@/components/custom/ui/HumidityCard";
import ChartCard from "@/components/custom/ui/ChartCard";
import { useDHT11LatestReading } from "@/hooks/useDHT11LatestReading";

export default function Dashboard() {
  const { reading, error } = useDHT11LatestReading();

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-4xl font-semibold text-foreground">
          Environmental Status
        </h1>
        <p className="mb-8 text-muted-foreground">
          Real-time temperature and humidity monitoring
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

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
