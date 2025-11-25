
export interface SensorData {
  timestamp: number;
  pumpStatus: 'ON' | 'OFF';
  threePhasePower: 'OK' | 'FAULT';
  connectivity: 'Online' | 'Offline';
  soilMoisture: number;
  airTemp: number;
  humidity: number;
  waterLevel: number;
  phValue: number;
  waterFlow: number;
}

export type SensorHistory = {
  [key: string]: SensorData;
}

interface SensorReading {
  current: number;
  change: number;
  history: Record<string, { value: number }>;
}

export interface IrrigationData {
  Humidity?: SensorReading;
  Temperature?: SensorReading;
  SoilMoisture?: number;
  WaterLevel?: number;
  PumpStatus?: boolean;
  LastUpdate?: number; // Unix timestamp
}

    