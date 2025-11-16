export interface DHT11Reading {
  temperature: number;
  humidity: number;
  timestamp: string;
}

export interface DHT11ReadingsQuery {
  startDate: Date;
  endDate: Date;
  limit?: number;
  offset?: number;
}

export interface DHT11ReadingsResponse {
  items: DHT11Reading[];
  total: number;
  limit: number;
  offset: number;
}

export interface DHT11ChartData {
  timestamp: string;
  avg_temperature: number;
  avg_humidity: number;
  min_temperature: number | null;
  max_temperature: number | null;
  min_humidity: number | null;
  max_humidity: number | null;
  reading_count: number;
}

export type GroupBy = "hour" | "day" | "week" | "month";

export interface DHT11ChartQuery {
  startDate: Date;
  endDate: Date;
  groupBy: GroupBy;
}
