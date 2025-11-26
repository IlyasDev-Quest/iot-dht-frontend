"use client";

import { useState, useEffect } from "react";

interface TimeSinceProps {
  date: string | Date;
}

export default function TimeSince({ date }: TimeSinceProps) {
  const [timeSince, setTimeSince] = useState("");

  useEffect(() => {
    const getTimeSince = () => {
      let utcDate: Date;

      if (typeof date === "string") {
        // Remove microseconds if present
        const sanitized = date.replace(/\.(\d{3})\d*/, ".$1");
        utcDate = new Date(sanitized);
      } else {
        utcDate = date;
      }

      const now = new Date();
      const diff = now.getTime() - utcDate.getTime();
      const absDiff = Math.abs(diff);

      const seconds = Math.floor(absDiff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      let result = "";
      if (seconds < 60) result = `${seconds}s`;
      else if (minutes < 60) result = `${minutes}min`;
      else if (hours < 24) result = `${hours}h ${minutes % 60}min`;
      else result = `${days}d ${hours % 24}h`;

      return diff >= 0 ? result : `in ${result}`;
    };

    setTimeSince(getTimeSince());
    const interval = setInterval(() => setTimeSince(getTimeSince()), 1000);
    return () => clearInterval(interval);
  }, [date]);

  return <span>{timeSince}</span>;
}
