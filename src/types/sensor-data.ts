

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

export interface IrrigationData {
  Humidity: number;
  Temperature: number;
  SoilMoisture: number;
  pumpStatus: 'ON' | 'OFF';
  LastUpdate: number; // Unix timestamp
}
