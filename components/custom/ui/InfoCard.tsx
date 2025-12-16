"use client";

import { ReactNode, useEffect, useState } from "react";
import TimeSince from "./TimeSince";

interface InfoCardProps {
  title: string;
  value: number | string;
  unit?: string;
  maxValue?: number | string;
  timestamp?: Date;
  icon?: ReactNode;
  bgColor?: string;
  iconColor?: string;
  cardBg?: string;
  borderColor?: string;
  textColor?: string;
  mutedTextColor?: string;
}

// Client-side only LocalDate component
function LocalDate({ timestamp }: { timestamp: string | Date }) {
  const [clientDate, setClientDate] = useState("");

  useEffect(() => {
    if (timestamp) {
      setClientDate(new Date(timestamp).toLocaleString());
    }
  }, [timestamp]);

  return <span>{clientDate}</span>;
}

export function InfoCard({
  title,
  value,
  unit,
  maxValue,
  timestamp,
  icon,
  bgColor = "bg-secondary",
  iconColor = "text-accent",
  cardBg = "bg-card",
  borderColor = "border-border",
  textColor = "text-foreground",
  mutedTextColor = "text-muted-foreground",
}: InfoCardProps) {
  return (
    <div className={`card ${borderColor} ${cardBg}`}>
      <div className="flex flex-col items-center justify-center gap-4">
        {icon && (
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full ${bgColor} ${iconColor}`}
          >
            {icon}
          </div>
        )}

        <div className="flex flex-col items-center">
          <p className={`text-sm font-medium ${mutedTextColor}`}>{title}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-5xl font-semibold ${textColor}`}>
              {value}
            </span>
            {unit && (
              <span className={`text-lg ${mutedTextColor}`}>{unit}</span>
            )}
          </div>
        </div>
      </div>

      {maxValue !== undefined && (
        <div className="mt-6">
          <p className={`text-center text-sm ${mutedTextColor}`}>
            Max:{" "}
            <span className={`font-semibold ${textColor}`}>
              {maxValue}
              {unit}
            </span>
          </p>
        </div>
      )}

      {timestamp && (
        <div className="mt-6 space-y-1 border-t border-border pt-4 text-center">
          <p className={`text-xs ${mutedTextColor}`}>
            Updated: <TimeSince date={timestamp} /> ago
          </p>
          <p className={`text-xs ${mutedTextColor}`}>
            <LocalDate timestamp={timestamp} />
          </p>
        </div>
      )}
    </div>
  );
}
