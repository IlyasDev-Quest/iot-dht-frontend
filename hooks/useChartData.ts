// hooks/useChartData.ts
import { useState, useCallback } from "react";
import { getDHT11Readings } from "@/services/dht11Service";

export interface ChartSeries {
  name: string;
  data: { x: string; y: number }[];
}

export function useChartData() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [data, setData] = useState<ChartSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState(false); // <-- new

  const fetchData = useCallback(async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);
    setNoData(false);

    try {
      const normalizedStart = new Date(startDate);
      normalizedStart.setHours(0, 0, 0, 0);

      const normalizedEnd = new Date(endDate);
      normalizedEnd.setHours(23, 59, 59, 999);

      const readings = await getDHT11Readings({
        start: normalizedStart,
        end: normalizedEnd,
        limit: 100,
      });

      if (!readings.length) {
        setData([]);
        setNoData(true);
        return;
      }

      const temperatureSeries: ChartSeries = {
        name: "Temperature",
        data: readings.map((r) => ({ x: r.timestamp, y: r.temperature })),
      };

      const humiditySeries: ChartSeries = {
        name: "Humidity",
        data: readings.map((r) => ({ x: r.timestamp, y: r.humidity })),
      };

      setData([temperatureSeries, humiditySeries]);
    } catch (err) {
      console.error(err);
      setError("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    data,
    loading,
    error,
    noData,
    fetchData,
  };
}
