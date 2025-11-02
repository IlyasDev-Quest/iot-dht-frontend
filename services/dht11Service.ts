import api from "@/lib/api";
import { DHT11Reading } from "@/types/dht11";

export const getDHT11LatestReading = async (): Promise<DHT11Reading | null> => {
  try {
    const { data } = await api.get<DHT11Reading>("/v1/dht11/readings/latest");
    return data;
  } catch (error) {
    console.error("Error fetching DHT11 latest reading:", error);
    return null;
  }
};
