// hooks/useChartData.ts
import { useState, useCallback } from "react";
import { getDHT11ChartData, getOptimalGroupBy } from "@/services/dht11Service";
import { GroupBy } from "@/types/dht11";

export interface ChartSeries {
  name: string;
  data: { x: number; y: number }[]; // ← Changed from string to number
}

export interface ChartDataWithRange extends ChartSeries {
  min?: { x: number; y: number }[]; // ← Changed from string to number
  max?: { x: number; y: number }[]; // ← Changed from string to number
}

export function useChartData() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [data, setData] = useState<ChartDataWithRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>("day");

  // hooks/useChartData.ts
  const fetchData = useCallback(async () => {
    console.log("🚀 fetchData called");
    console.log("📅 Current dates:", { startDate, endDate });

    if (!startDate || !endDate) {
      console.log("⚠️ Missing dates");
      return;
    }

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

      console.log("📊 Fetching with:", {
        start: normalizedStart,
        end: normalizedEnd,
        groupBy: optimalGroupBy,
      });

      const chartData = await getDHT11ChartData({
        startDate: normalizedStart,
        endDate: normalizedEnd,
        groupBy: optimalGroupBy,
      });

      console.log("📦 Raw chart data:", chartData);

      if (!chartData.length) {
        console.log("⚠️ No data returned");
        setData([]);
        setNoData(true);
        return;
      }

      // Transform to chart series with range data
      const temperatureSeries: ChartDataWithRange = {
        name: "Temperature",
        data: chartData.map((r) => ({
          x: new Date(r.timestamp).getTime(),
          y: r.avg_temperature,
        })),
        min: chartData.map((r) => ({
          x: new Date(r.timestamp).getTime(),
          y: r.min_temperature ?? r.avg_temperature,
        })),
        max: chartData.map((r) => ({
          x: new Date(r.timestamp).getTime(),
          y: r.max_temperature ?? r.avg_temperature,
        })),
      };

      const humiditySeries: ChartDataWithRange = {
        name: "Humidity",
        data: chartData.map((r) => ({
          x: new Date(r.timestamp).getTime(),
          y: r.avg_humidity,
        })),
        min: chartData.map((r) => ({
          x: new Date(r.timestamp).getTime(),
          y: r.min_humidity ?? r.avg_humidity,
        })),
        max: chartData.map((r) => ({
          x: new Date(r.timestamp).getTime(),
          y: r.max_humidity ?? r.avg_humidity,
        })),
      };

      console.log("✅ Setting data:", {
        series: [temperatureSeries, humiditySeries],
        tempPoints: temperatureSeries.data.length,
        humidityPoints: humiditySeries.data.length,
        firstPoint: temperatureSeries.data[0],
      });

      setData([temperatureSeries, humiditySeries]);
    } catch (err) {
      console.error("❌ Fetch error:", err);
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
