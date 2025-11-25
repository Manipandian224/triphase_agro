
'use client';

import { RealtimeSensorData } from '@/components/RealtimeSensorData';

export default function DashboardPage() {
  return (
    <div 
      className="min-h-full w-full p-4 md:p-8"
    >
      <div className="flex items-center justify-between space-y-2 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
          Live Field Dashboard
        </h2>
      </div>

      <RealtimeSensorData />
    </div>
  );
}
