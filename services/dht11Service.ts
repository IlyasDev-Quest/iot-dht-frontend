import api from "@/lib/api";
import {
  DHT11Reading,
  DHT11ReadingsQuery,
  DHT11ReadingsResponse,
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

    if (query.start) params.set("start", query.start.toISOString());
    if (query.end) params.set("end", query.end.toISOString());
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
