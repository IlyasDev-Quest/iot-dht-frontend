import api from "@/lib/api";
import { DHT11Reading, DHT11ReadingsQuery } from "@/types/dht11";

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
    const params = new URLSearchParams(
      Object.entries(query)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    );

    const { data } = await api.get<DHT11Reading[]>(
      `/v1/dht11/readings?${params.toString()}`
    );

    return data;
  } catch (error) {
    console.error("Error fetching DHT11 readings:", error);
    return [];
  }
};
