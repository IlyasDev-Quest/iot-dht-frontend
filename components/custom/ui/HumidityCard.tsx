"use client";

import { Droplet } from "lucide-react";
import { InfoCard } from "./InfoCard";

interface HumidityCardProps {
  value: number;
  maxValue?: number;
  timestamp?: Date;
  unit?: string;
}

export function HumidityCard({
  value,
  maxValue,
  timestamp,
  unit = "%",
}: HumidityCardProps) {
  return (
    <InfoCard
      title="Humidity"
      value={value}
      unit={unit}
      maxValue={maxValue}
      timestamp={timestamp}
      icon={<Droplet className="h-11 w-11" />}
      bgColor="bg-blue-100"
      iconColor="text-blue-600"
    />
  );
}
