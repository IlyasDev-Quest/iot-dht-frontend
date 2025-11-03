export interface DHT11Reading {
  temperature: number;
  humidity: number;
  timestamp: string;
}

export interface DHT11ReadingsQuery {
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}
