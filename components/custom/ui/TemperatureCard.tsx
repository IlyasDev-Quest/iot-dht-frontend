"use client";

import { Thermometer } from "lucide-react";
import { InfoCard } from "./InfoCard";

interface TemperatureCardProps {
  value: number;
  maxValue?: number;
  timestamp?: string | Date;
  unit?: string;
}

export function TemperatureCard({
  value,
  maxValue,
  timestamp,
  unit = "°C",
}: TemperatureCardProps) {
  return (
    <InfoCard
      title="Temperature"
      value={value}
      unit={unit}
      maxValue={maxValue}
      timestamp={timestamp}
      icon={<Thermometer className="h-11 w-11" />}
      bgColor="bg-red-100"
      iconColor="text-red-600"
    />
  );
}
