
export interface SensorData {
  pumpStatus: 'ON' | 'OFF';
  threePhasePower: 'OK' | 'FAULT';
  connectivity: 'Online' | 'Offline';
  cropHealth: number;
  soilMoisture: number;
  airTemp: number;
  humidity: number;
  waterFlow: number;
}

    