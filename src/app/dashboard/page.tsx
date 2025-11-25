
'use client';

import { RealtimeSensorData } from '@/components/RealtimeSensorData';

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-4xl font-bold tracking-tighter">
          Live Field Dashboard
        </h2>
      </div>

      <RealtimeSensorData />
    </div>
  );
}
