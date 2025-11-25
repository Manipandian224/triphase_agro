
'use client';

import { RealtimeSensorData } from '@/components/RealtimeSensorData';

export default function DashboardPage() {
  return (
    <div 
      className="min-h-full w-full p-4 md:p-8" 
      style={{ background: 'linear-gradient(145deg, #071122 0%, #0B1C33 100%)' }}
    >
      <div className="flex items-center justify-between space-y-2 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
          Live Field Dashboard
        </h2>
      </div>

      <RealtimeSensorData />
    </div>
  );
}
