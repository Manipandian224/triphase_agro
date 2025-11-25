
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
import { Thermometer, Droplets, Waves, Wind } from 'lucide-react';
import { useFirebase } from '@/firebase/client-provider';
import { ref, onValue } from 'firebase/database';
import type { IrrigationData } from '@/types/sensor-data';

// == MAIN COMPONENT ==
export function RealtimeSensorData() {
  const { rtdb } = useFirebase();
  const [data, setData] = useState<Partial<IrrigationData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rtdb) return;

    const irrigationRef = ref(rtdb, 'Irrigation/');
    setLoading(true);

    const unsubscribe = onValue(irrigationRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        setData({});
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase read failed: " + error.message);
      setData({});
      setLoading(false);
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, [rtdb]);

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="grid gap-6 md:gap-8 sm:grid-cols-2 xl:grid-cols-4">
      <SingleValueCard
        title="Temperature"
        value={data.Temperature}
        unit="°C"
        icon={Thermometer}
        gradientFrom="from-cyan-400"
        gradientTo="to-blue-500"
      />
      <SingleValueCard
        title="Humidity"
        value={data.Humidity}
        unit="%"
        icon={Wind}
        gradientFrom="from-purple-400"
        gradientTo="to-pink-500"
      />
      <CircularProgressCard
        title="Soil Moisture"
        value={data.SoilMoisture}
        icon={Droplets}
        gradientFrom="from-teal-400"
        gradientTo="to-green-500"
      />
      <CircularProgressCard
        title="Water Level"
        value={data.WaterLevel}
        icon={Waves}
        gradientFrom="from-sky-400"
        gradientTo="to-indigo-500"
      />
    </div>
  );
}

// == SUBCOMPONENTS ==

interface CardWrapperProps {
  children: ReactNode;
  className?: string;
}

const CardWrapper: FC<CardWrapperProps> = ({ children, className }) => (
  <div
    className={cn(
      'relative p-6 bg-slate-900/80 rounded-2xl shadow-lg border border-slate-800/80 overflow-hidden backdrop-blur-sm',
      'h-full flex flex-col',
      className
    )}
  >
    <div className="absolute inset-0 bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0))]"></div>
     <div className="absolute -inset-12 w-1/2 h-1/2 top-1/4 left-1/4 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
    <div className="relative z-10 flex flex-col h-full">{children}</div>
  </div>
);

interface SingleValueCardProps {
  title: string;
  value?: number;
  unit: string;
  icon: React.ElementType;
  gradientFrom: string;
  gradientTo: string;
}

const SingleValueCard: FC<SingleValueCardProps> = ({ title, value, unit, icon: Icon, gradientFrom }) => {
    return (
        <CardWrapper className="items-center justify-center">
             <h3 className="text-lg font-medium text-slate-300 absolute top-6 left-6">{title}</h3>
            <div className="flex flex-col items-center justify-center text-center">
                 <Icon className={cn('w-16 h-16 mb-4 text-color', gradientFrom)} />
                {value !== undefined ? (
                    <p className="text-6xl font-bold text-white">
                        {value.toFixed(1)}
                        <span className="text-4xl text-slate-400 ml-2">{unit}</span>
                    </p>
                ) : (
                    <p className="text-2xl text-slate-500">No data</p>
                )}
            </div>
        </CardWrapper>
    )
}

interface CircularProgressCardProps {
  title: string;
  value?: number;
  icon: React.ElementType;
  gradientFrom: string;
  gradientTo: string;
}

const CircularProgressCard: FC<CircularProgressCardProps> = ({ title, value = 0, icon: Icon, gradientFrom, gradientTo }) => {
  return (
    <CardWrapper className="items-center justify-center">
      <h3 className="text-lg font-medium text-slate-300 absolute top-6 left-6">{title}</h3>
      <div className="relative w-48 h-48 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="80%"
            outerRadius="100%"
            barSize={12}
            data={[{ value: value, fill: 'url(#progressGradient)' }]}
            startAngle={90}
            endAngle={-270}
          >
            <defs>
              <linearGradient id="progressGradient">
                  <stop offset="0%" className={cn('stop-color', gradientFrom)} />
                  <stop offset="100%" className={cn('stop-color', gradientTo)} />
              </linearGradient>
            </defs>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: 'hsl(220 20% 15%)' }}
              dataKey="value"
              cornerRadius={10}
              animationDuration={1500}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <Icon className={cn('w-8 h-8 mb-2 text-color', gradientFrom)} />
           {value !== undefined ? (
             <span className="text-5xl font-bold text-white">{value}%</span>
           ) : (
            <span className="text-2xl text-slate-500">No data</span>
           )}
        </div>
      </div>
    </CardWrapper>
  );
};

const DashboardLoadingSkeleton = () => (
    <div className="grid gap-6 md:gap-8 sm:grid-cols-2 xl:grid-cols-4">
      <Skeleton className="h-[260px] bg-slate-900/80 rounded-2xl" />
      <Skeleton className="h-[260px] bg-slate-900/80 rounded-2xl" />
      <Skeleton className="h-[260px] bg-slate-900/80 rounded-2xl" />
      <Skeleton className="h-[260px] bg-slate-900/80 rounded-2xl" />
    </div>
);
