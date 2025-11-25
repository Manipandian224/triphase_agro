
export interface SensorData {
  timestamp: number;
  pumpStatus: 'ON' | 'OFF';
  threePhasePower: 'OK' | 'FAULT';
  connectivity: 'Online' | 'Offline';
  cropHealth: number;
  soilMoisture: number;
  airTemp: number;
  humidity: number;
  waterFlow: number;
}

export type SensorHistory = {
  [key: string]: SensorData;
}
