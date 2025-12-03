
'use client';

import { RealtimeSensorData } from '@/components/RealtimeSensorData';
import { SensorHistoryChart } from '@/components/SensorHistoryChart';

export default function DashboardPage() {
  return (
    <div 
      className="min-h-full w-full p-4 md:p-8 space-y-8"
    >
      <div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground mb-8" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
          Live Field Dashboard
        </h2>
        <RealtimeSensorData />
      </div>

      <div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground mb-8" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
          Sensor History
        </h2>
        <SensorHistoryChart />
      </div>
    </div>
  );
}
