// hooks/useChartData.ts
import { useState, useCallback } from "react";
import { getDHT11ChartData, getOptimalGroupBy } from "@/services/dht11Service";
import { GroupBy } from "@/types/dht11";

export interface ChartSeries {
  name: string;
  data: { x: string; y: number }[];
}

export interface ChartDataWithRange extends ChartSeries {
  min?: { x: string; y: number }[];
  max?: { x: string; y: number }[];
}

export function useChartData() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [data, setData] = useState<ChartDataWithRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>("day");

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

      // Automatically determine optimal groupBy
      const optimalGroupBy = getOptimalGroupBy(normalizedStart, normalizedEnd);
      setGroupBy(optimalGroupBy);

      const chartData = await getDHT11ChartData({
        startDate: normalizedStart,
        endDate: normalizedEnd,
        groupBy: optimalGroupBy,
      });

      if (!chartData.length) {
        setData([]);
        setNoData(true);
        return;
      }

      // Transform to chart series with range data
      const temperatureSeries: ChartDataWithRange = {
        name: "Temperature",
        data: chartData.map((r) => ({
          x: r.timestamp,
          y: r.avg_temperature,
        })),
        min: chartData.map((r) => ({
          x: r.timestamp,
          y: r.min_temperature ?? r.avg_temperature,
        })),
        max: chartData.map((r) => ({
          x: r.timestamp,
          y: r.max_temperature ?? r.avg_temperature,
        })),
      };

      const humiditySeries: ChartDataWithRange = {
        name: "Humidity",
        data: chartData.map((r) => ({
          x: r.timestamp,
          y: r.avg_humidity,
        })),
        min: chartData.map((r) => ({
          x: r.timestamp,
          y: r.min_humidity ?? r.avg_humidity,
        })),
        max: chartData.map((r) => ({
          x: r.timestamp,
          y: r.max_humidity ?? r.avg_humidity,
        })),
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
    groupBy,
    fetchData,
  };
}
