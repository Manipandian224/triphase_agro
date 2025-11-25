
'use client';

import { useState, useEffect, FC, ReactNode } from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirebase } from '@/firebase/client-provider';
import { ref, onValue, update } from 'firebase/database';
import type { IrrigationData } from '@/types/sensor-data';
import { Button } from './ui/button';
import { Power } from 'lucide-react';

// == MAIN COMPONENT ==
export function RealtimeSensorData() {
  const { rtdb } = useFirebase();
  const [data, setData] = useState<Partial<IrrigationData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rtdb) return;

    const irrigationRef = ref(rtdb, 'Irrigation/');
    setLoading(true);

    const unsubscribe = onValue(
      irrigationRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          setData({});
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firebase read failed: ' + error.message);
        setData({});
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [rtdb]);

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  // Convert temperature to a percentage of a 0-50°C range for the progress bar
  const tempPercentage = data.Temperature ? (data.Temperature / 50) * 100 : 0;
  const isTempPositive = (data.Temperature || 0) >= 20;

  // Humidity is already a percentage
  const humidityPercentage = data.Humidity || 0;
  const isHumidityPositive = (data.Humidity || 0) <= 60;
  
  const isSoilMoisturePositive = (data.SoilMoisture || 0) > 40;

  const handleTogglePump = async () => {
    if (!rtdb) return;
    const irrigationRef = ref(rtdb, 'Irrigation');
    const newStatus = !data.PumpStatus;
    try {
      await update(irrigationRef, { PumpStatus: newStatus });
    } catch (error) {
      console.error('Failed to update pump status:', error);
    }
  };


  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      <CircularProgressCard
        title="Temperature"
        value={data.Temperature}
        displayValue={`${(data.Temperature ?? 0).toFixed(1)}°C`}
        percentage={tempPercentage}
        isPositive={isTempPositive}
      />
      <CircularProgressCard
        title="Humidity"
        value={data.Humidity}
        displayValue={`${(data.Humidity ?? 0).toFixed(0)}%`}
        percentage={humidityPercentage}
        isPositive={isHumidityPositive}
      />
      <CircularProgressCard
        title="Soil Moisture"
        value={data.SoilMoisture}
        displayValue={`${(data.SoilMoisture ?? 0).toFixed(0)}%`}
        percentage={data.SoilMoisture}
        isPositive={isSoilMoisturePositive}
      />
      <PumpStatusCard 
        pumpStatus={data.PumpStatus}
        onToggle={handleTogglePump}
      />
    </div>
  );
}


// == SUBCOMPONENTS ==

const CardWrapper = ({ children, className }: { children: ReactNode, className?: string }) => (
  <div className={cn('bg-slate-900/70 relative h-full rounded-2xl p-6 shadow-lg backdrop-blur-sm border border-slate-800/80', className)}>
    <div className="absolute inset-0 bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0))]"></div>
    <div className="absolute -inset-12 w-1/2 h-1/2 top-1/4 left-1/4 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
    <div className="relative z-10 flex flex-col h-full">{children}</div>
  </div>
);

const CornerTriangle = ({ isPositive, className }: { isPositive: boolean; className?: string }) => (
  <div
    className={cn(
      'absolute w-0 h-0 border-solid border-t-0',
      isPositive ? 'border-b-[30px] border-l-[30px] border-b-emerald-500/80' : 'border-b-[30px] border-l-[30px] border-b-red-500/80',
      'border-l-transparent',
      className
    )}
  />
);

interface CircularProgressCardProps {
  title: string;
  value?: number;
  displayValue: string;
  percentage?: number;
  isPositive: boolean;
}

const CircularProgressCard: FC<CircularProgressCardProps> = ({ title, value, displayValue, percentage = 0, isPositive }) => {

  return (
    <CardWrapper className="items-center justify-between">
      <CornerTriangle isPositive={isPositive} className="top-0 right-0 transform rotate-90" />
      <h3 className="text-lg font-medium text-slate-200 w-full text-left">{title}</h3>
      <div className="relative w-40 h-40 my-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="80%"
            outerRadius="100%"
            barSize={12}
            data={[{ value: percentage, fill: 'hsl(var(--primary))' }]}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: 'hsl(var(--muted) / 0.3)' }}
              dataKey="value"
              cornerRadius={10}
              animationDuration={1500}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {value !== undefined ? (
            <span className="text-4xl font-bold text-slate-100">{displayValue}</span>
          ) : (
            <span className="text-lg text-slate-400">No data</span>
          )}
        </div>
      </div>
       <p className='text-transparent text-sm'>hidden</p>
    </CardWrapper>
  );
};


interface PumpStatusCardProps {
  pumpStatus?: boolean;
  onToggle: () => void;
}

const PumpStatusCard: FC<PumpStatusCardProps> = ({ pumpStatus, onToggle }) => {
  const isOnline = pumpStatus !== undefined;
  const isOn = pumpStatus === true;

  return (
     <CardWrapper className="items-center justify-between">
      <CornerTriangle isPositive={isOnline} className="top-0 right-0 transform rotate-90" />
      <h3 className="text-lg font-medium text-slate-200 w-full text-left">Pump Status</h3>
      <div className="flex flex-col items-center justify-center my-4 flex-1">
        {isOnline ? (
          <>
            <Power className={cn("h-20 w-20 mb-4", isOn ? "text-green-500" : "text-red-500")} />
            <p className={cn("text-4xl font-bold", isOn ? "text-green-400" : "text-red-400")}>
              {isOn ? 'ON' : 'OFF'}
            </p>
          </>
        ) : (
          <p className="text-lg text-slate-400">No data</p>
        )}
      </div>
      <Button 
        onClick={onToggle} 
        disabled={!isOnline}
        className={cn(
          "w-full font-bold",
           isOn 
             ? "bg-red-600/80 hover:bg-red-600 text-white" 
             : "bg-green-600/80 hover:bg-green-600 text-white"
        )}
      >
        {isOn ? 'Turn OFF' : 'Turn ON'}
      </Button>
    </CardWrapper>
  );
};

const DashboardLoadingSkeleton = () => (
  <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
    <Skeleton className="h-[220px] bg-slate-900/80 rounded-2xl" />
    <Skeleton className="h-[22-px] bg-slate-900/80 rounded-2xl" />
    <Skeleton className="h-[220px] bg-slate-900/80 rounded-2xl" />
    <Skeleton className="h-[220px] bg-slate-900/80 rounded-2xl" />
  </div>
);
