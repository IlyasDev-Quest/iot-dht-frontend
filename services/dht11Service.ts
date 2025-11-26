import api from "@/lib/api";
import {
  DHT11ChartData,
  DHT11ChartQuery,
  DHT11Reading,
  DHT11ReadingsQuery,
  DHT11ReadingsResponse,
  GroupBy,
} from "@/types/dht11";

export const getDHT11LatestReading = async (): Promise<DHT11Reading | null> => {
  try {
    const { data } = await api.get<DHT11Reading>("/v1/dht11/readings/latest");
    return data;
  } catch (error) {
    console.error("Error fetching DHT11 latest reading:", error);
    return null;
  }
};

export const getDHT11Readings = async (
  query: DHT11ReadingsQuery
): Promise<DHT11Reading[]> => {
  try {
    const params = new URLSearchParams();

    if (query.startDate)
      params.set("start_date", query.startDate.toISOString());
    if (query.endDate) params.set("end_date", query.endDate.toISOString());
    if (query.limit !== undefined) params.set("limit", String(query.limit));
    if (query.offset !== undefined) params.set("offset", String(query.offset));

    const { data } = await api.get<DHT11ReadingsResponse>(
      `/v1/dht11/readings?${params.toString()}`
    );

    return Array.isArray(data.items) ? data.items : [];
  } catch (error) {
    console.error("Error fetching DHT11 readings:", error);
    return [];
  }
};

// services/dht11Service.ts
export const getDHT11ChartData = async (
  query: DHT11ChartQuery
): Promise<DHT11ChartData[]> => {
  try {
    const params = new URLSearchParams();

    // Format dates as local time strings (YYYY-MM-DDTHH:mm:ss)
    const formatLocalDateTime = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    params.set("start_date", formatLocalDateTime(query.startDate));
    params.set("end_date", formatLocalDateTime(query.endDate));
    params.set("group_by", query.groupBy);

    const url = `/v1/dht11/readings/chart?${params.toString()}`;
    console.log("🔍 Fetching chart data:", url);

    const { data } = await api.get<DHT11ChartData[]>(url);

    console.log("📊 Received data:", data);

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching DHT11 chart data:", error);
    return [];
  }
};

// Helper function to determine optimal groupBy based on duration
export const getOptimalGroupBy = (startDate: Date, endDate: Date): GroupBy => {
  const hours = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
  );
  const days = hours / 24;

  if (hours <= 24) return "minute";
  if (days <= 7) return "hour";
  if (days <= 31) return "day";
  if (days <= 90) return "day";
  return "week";
};
