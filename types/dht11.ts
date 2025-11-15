export interface DHT11Reading {
  temperature: number;
  humidity: number;
  timestamp: string;
}

export interface DHT11ReadingsQuery {
  start: Date;
  end: Date;
  limit?: number;
  offset?: number;
}

export interface DHT11ReadingsResponse {
  items: DHT11Reading[];
  total: number;
  limit: number;
  offset: number;
}
