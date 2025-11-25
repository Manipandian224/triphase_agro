/**
 * == FIREBASE REALTIME DATABASE INTEGRATION ==
 * This component is now wired to your Firebase Realtime Database.
 * It listens for changes at the "Irrigation/" path and updates the UI in real-time.
 * - Temperature History -> Irrigation/Temperature/history
 * - Humidity History    -> Irrigation/Humidity/history
 * - Soil Moisture       -> Irrigation/SoilMoisture
 * - Water Level         -> Irrigation/WaterLevel
 */
'use client';
import { useState, useEffect, FC, ReactNode } from 'react';
import {
  LineChart,
  Line,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Droplets, Waves } from 'lucide-react';
import { useFirebase } from '@/firebase/client-provider';
import { ref, onValue, Database } from 'firebase/database';
import { IrrigationData } from '@/types/sensor-data';


// == MAIN COMPONENT ==
export function RealtimeSensorData() {
  const { rtdb } = useFirebase();
  const [data, setData] = useState<Partial<IrrigationData> | null>(null);
  const [loading, setLoading] = useState(true);

  // == FIREBASE DATA FETCHING ==
  useEffect(() => {
    if (!rtdb) return;

    const irrigationRef = ref(rtdb, 'Irrigation/');
    const unsubscribe = onValue(irrigationRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        setData(null);
      }
      setLoading(false);
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, [rtdb]);

  const formatHistory = (historyObj: Record<string, {value: number}> | undefined) => {
    if (!historyObj) return [];
    return Object.entries(historyObj).map(([key, reading], index) => ({
      time: `-${Object.keys(historyObj).length - index}m`,
      value: reading.value,
    })).slice(-10); // get last 10 readings
  };

  const temperatureHistory = formatHistory(data?.Temperature?.history);
  const humidityHistory = formatHistory(data?.Humidity?.history);

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }
  
  if (!data) {
     return <div className="text-center text-slate-400 py-20">No sensor data available.</div>
  }

  return (
    <div className="grid gap-6 md:gap-8 sm:grid-cols-2 xl:grid-cols-4">
      <LineChartCard
        title="Temperature"
        currentValue={data.Temperature?.current ?? 0}
        unit="°C"
        change={data.Temperature?.change ?? 0}
        data={temperatureHistory}
        dataKey="value"
        gradientFrom="from-cyan-400"
        gradientTo="to-blue-500"
        gradientId="tempGradient"
      />
      <LineChartCard
        title="Humidity"
        currentValue={data.Humidity?.current ?? 0}
        unit="%"
        change={data.Humidity?.change ?? 0}
        data={humidityHistory}
        dataKey="value"
        gradientFrom="from-purple-400"
        gradientTo="to-pink-500"
        gradientId="humidityGradient"
      />
      <CircularProgressCard
        title="Soil Moisture"
        value={data.SoilMoisture ?? 0}
        icon={Droplets}
        gradientFrom="from-teal-400"
        gradientTo="to-green-500"
      />
      <CircularProgressCard
        title="Water Level"
        value={data.WaterLevel ?? 0}
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


interface LineChartCardProps {
  title: string;
  currentValue: number;
  unit: string;
  change: number;
  data: any[];
  dataKey: string;
  gradientFrom: string;
  gradientTo: string;
  gradientId: string;
}

const LineChartCard: FC<LineChartCardProps> = ({
  title,
  currentValue,
  unit,
  change,
  data,
  dataKey,
  gradientFrom,
  gradientTo,
  gradientId,
}) => {
  const isPositive = change >= 0;
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <CardWrapper>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-slate-300">{title}</h3>
        <div
          className={cn(
            'flex items-center text-sm font-semibold',
            isPositive ? 'text-green-400' : 'text-red-400'
          )}
        >
          <ChangeIcon className="w-4 h-4 mr-1" />
          {isPositive ? '+' : ''}
          {change}%
        </div>
      </div>
       <div className="mb-4">
          <p className="text-4xl font-bold text-white">
            {currentValue.toFixed(1)}
            <span className="text-2xl text-slate-400 ml-1">{unit}</span>
          </p>
      </div>
      <div className="flex-grow h-40 -ml-6 -mr-6 -mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" className={cn('stop-color', gradientFrom)} stopOpacity={0.3} />
                <stop offset="95%" className={cn('stop-color', gradientTo)} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(220 10% 40%)', fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(5, 15, 35, 0.8)',
                borderColor: 'hsl(220 10% 30%)',
                borderRadius: '0.5rem',
                color: '#fff',
              }}
              cursor={{ stroke: 'hsl(220 10% 50%)', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="none"
              fill={`url(#${gradientId})`}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              strokeWidth={3}
              className={cn('stroke-color', gradientTo)}
              dot={false}
              stroke={`url(#${gradientId})`}
              style={{ filter: `drop-shadow(0 4px 8px hsl(var(--primary) / 0.5))` }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardWrapper>
  );
};


interface CircularProgressCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  gradientFrom: string;
  gradientTo: string;
}

const CircularProgressCard: FC<CircularProgressCardProps> = ({ title, value, icon: Icon, gradientFrom, gradientTo }) => {
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
          <span className="text-5xl font-bold text-white">{value}%</span>
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
