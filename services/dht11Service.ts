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

export const getDHT11ChartData = async (
  query: DHT11ChartQuery
): Promise<DHT11ChartData[]> => {
  try {
    const params = new URLSearchParams();
    params.set("start_date", query.startDate.toISOString());
    params.set("end_date", query.endDate.toISOString());
    params.set("group_by", query.groupBy);

    const { data } = await api.get<DHT11ChartData[]>(
      `/v1/dht11/readings/chart?${params.toString()}`
    );

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching DHT11 chart data:", error);
    return [];
  }
};

// Helper function to determine optimal groupBy based on duration
export const getOptimalGroupBy = (startDate: Date, endDate: Date): GroupBy => {
  const days = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (days <= 1) return "hour";
  if (days <= 7) return "hour";
  if (days <= 31) return "day";
  if (days <= 90) return "day";
  return "week";
};
