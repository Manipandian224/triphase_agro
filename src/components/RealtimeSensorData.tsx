
'use client';

import { useState, useEffect, FC, ReactNode } from 'react';
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirebase } from '@/firebase/client-provider';
import { ref, onValue } from 'firebase/database';
import type { IrrigationData } from '@/types/sensor-data';

// == INSTRUCTIONS FOR FIREBASE INTEGRATION ==
// 1. Ensure you have a `useFirebase` hook that provides the Realtime Database instance (`rtdb`).
// 2. This component listens to the "Irrigation/" path in your Realtime Database.
// 3. Data is expected in this structure:
//    - Irrigation/Temperature: number
//    - Irrigation/Humidity: number
//    - Irrigation/SoilMoisture: number
//    - Irrigation/WaterLevel: number

// == MAIN COMPONENT ==
export function RealtimeSensorData() {
  const { rtdb } = useFirebase();
  const [data, setData] = useState<Partial<IrrigationData>>({});
  const [loading, setLoading] = useState(true);

  const [temperatureHistory, setTemperatureHistory] = useState<{ time: string; value: number }[]>([]);
  const [humidityHistory, setHumidityHistory] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    if (!rtdb) return;

    const irrigationRef = ref(rtdb, 'Irrigation/');
    setLoading(true);

    const unsubscribe = onValue(
      irrigationRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const newData = snapshot.val();
          setData(newData);

          const now = new Date();
          const timeLabel = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
          
          // Update Temperature History
          if (typeof newData.Temperature === 'number') {
            setTemperatureHistory(prev => {
              const newHistory = [...prev, { time: timeLabel, value: newData.Temperature }];
              return newHistory.slice(-15); // Keep last 15 data points
            });
          }
          
          // Update Humidity History
          if (typeof newData.Humidity === 'number') {
            setHumidityHistory(prev => {
              const newHistory = [...prev, { time: timeLabel, value: newData.Humidity }];
              return newHistory.slice(-15); // Keep last 15 data points
            });
          }

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

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, [rtdb]);

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  const isTempPositive = (data.Temperature || 0) >= 20;
  const isHumidityPositive = (data.Humidity || 0) <= 60;

  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      <LineChartCard
        title="Temperature"
        value={data.Temperature}
        unit="°C"
        chartData={temperatureHistory}
        color="cyan"
        isPositive={isTempPositive}
      />
      <LineChartCard
        title="Humidity"
        value={data.Humidity}
        unit="%"
        chartData={humidityHistory}
        color="pink"
        isPositive={isHumidityPositive}
      />
      <CircularProgressCard
        title="Soil Moisture"
        value={data.SoilMoisture}
        color="teal"
      />
      <CircularProgressCard
        title="Water Level"
        value={data.WaterLevel}
        color="indigo"
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
      'absolute w-0 h-0 border-solid border-t-0 border-r-0',
      isPositive ? 'border-b-[30px] border-l-[30px] border-b-emerald-500/80' : 'border-b-[30px] border-l-[30px] border-b-red-500/80',
      'border-l-transparent',
      className
    )}
  />
);

interface LineChartCardProps {
  title: string;
  value?: number;
  unit: string;
  chartData: { time: string; value: number }[];
  color: 'cyan' | 'pink';
  isPositive: boolean;
}

const LineChartCard: FC<LineChartCardProps> = ({ title, value, unit, chartData, color, isPositive }) => {
  const gradientId = `gradient-${color}`;
  const strokeColor = color === 'cyan' ? '#22d3ee' : '#ec4899';
  const stopColor = color === 'cyan' ? '#06b6d4' : '#d946ef';

  return (
    <CardWrapper className="flex-col">
       <CornerTriangle isPositive={isPositive} className="top-0 right-0 transform rotate-90" />
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-slate-300">{title}</h3>
        <div className='text-right'>
           {value !== undefined ? (
            <p className="text-3xl font-bold text-white">
              {value.toFixed(1)}
              <span className="text-xl text-slate-400 ml-1">{unit}</span>
            </p>
          ) : (
            <p className="text-lg text-slate-500">No data</p>
          )}
        </div>
      </div>
      <div className="flex-grow -ml-6 -mr-2 -mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stopColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={stopColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                borderColor: 'rgba(255,255,255,0.2)',
                borderRadius: '0.75rem',
              }}
              labelStyle={{ fontWeight: 'bold' }}
              itemStyle={{ color: strokeColor }}
            />
            <XAxis dataKey="time" hide />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#fff', stroke: strokeColor }}
            />
            <Area type="monotone" dataKey="value" stroke={false} fill={`url(#${gradientId})`} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardWrapper>
  );
};


interface CircularProgressCardProps {
  title: string;
  value?: number;
  color: 'teal' | 'indigo';
}

const CircularProgressCard: FC<CircularProgressCardProps> = ({ title, value = 0, color }) => {
  const gradientId = `gradient-${color}`;
  const fromColor = color === 'teal' ? 'from-teal-400' : 'from-sky-400';
  const toColor = color === 'indigo' ? 'to-indigo-500' : 'to-green-500';

  return (
    <CardWrapper className="items-center justify-between">
      <CornerTriangle isPositive={value > 50} className="bottom-0 left-0 transform -rotate-90" />
      <h3 className="text-lg font-medium text-slate-300 w-full text-left">{title}</h3>
      <div className="relative w-40 h-40 my-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="80%"
            outerRadius="100%"
            barSize={12}
            data={[{ value: value, fill: `url(#${gradientId})` }]}
            startAngle={90}
            endAngle={-270}
          >
            <defs>
              <linearGradient id={gradientId}>
                <stop offset="0%" className={cn('stop-color', fromColor)} />
                <stop offset="100%" className={cn('stop-color', toColor)} />
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
          {value !== undefined ? (
            <span className="text-4xl font-bold text-white">{value.toFixed(0)}%</span>
          ) : (
            <span className="text-lg text-slate-500">No data</span>
          )}
        </div>
      </div>
       <p className='text-transparent text-sm'>hidden</p>
    </CardWrapper>
  );
};

const DashboardLoadingSkeleton = () => (
  <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
    <Skeleton className="h-[220px] bg-slate-900/80 rounded-2xl" />
    <Skeleton className="h-[220px] bg-slate-900/80 rounded-2xl" />
    <Skeleton className="h-[220px] bg-slate-900/80 rounded-2xl" />
    <Skeleton className="h-[220px] bg-slate-900/80 rounded-2xl" />
  </div>
);
