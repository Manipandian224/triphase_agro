/**
 * == INSTRUCTIONS FOR FIREBASE REALTIME DATABASE INTEGRATION ==
 *
 * 1. Import Firebase dependencies:
 *    - In this file, uncomment the line: `// import { ref, onValue } from 'firebase/database';`
 *    - You will also need your `db` instance from your firebase config, e.g. `// import { db } from '@/firebase';`
 *
 * 2. Connect to Firebase paths in the `useEffect` hook within `RealtimeSensorData` component:
 *    - Temperature History -> `Irrigation/Temperature/history` (assuming you store history)
 *    - Humidity History    -> `Irrigation/Humidity/history`
 *    - Soil Moisture       -> `Irrigation/SoilMoisture` (for the current value)
 *    - Water Level         -> `Irrigation/WaterLevel` (for the current value)
 *
 * 3. Update state with real data:
 *    - Inside the `onValue` callback, use the state setters (e.g., `setTemperature`, `setSoilMoisture`) 
 *      to update the component with live data from Firebase.
 *
 * 4. Recommended Gradient Colors:
 *    - Temperature: `from-cyan-400 to-blue-500`
 *    - Humidity: `from-purple-400 to-pink-500`
 *    - Soil Moisture: `from-teal-400 to-green-500`
 *    - Water Level: `from-sky-400 to-indigo-500`
 */

'use client';
import { useState, useEffect, useMemo, FC, ReactNode } from 'react';
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
import { TrendingUp, TrendingDown, Droplets, Waves } from 'lucide-react';

// == MOCK DATA (replace with Firebase data) ==
const generateMockHistory = (points = 10, min = 20, max = 30) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `-${points - i}m`,
    value: parseFloat((Math.random() * (max - min) + min).toFixed(1)),
  }));
};

const mockTemperatureHistory = generateMockHistory(10, 18, 25);
const mockHumidityHistory = generateMockHistory(10, 40, 60);

// == MAIN COMPONENT ==
export function RealtimeSensorData() {
  const [loading, setLoading] = useState(true);

  // == STATE FOR SENSOR VALUES ==
  // Replace initial values with data from Firebase
  const [temperature, setTemperature] = useState({
    current: 22.5,
    change: 1.2, // Positive or negative change
    history: mockTemperatureHistory,
  });

  const [humidity, setHumidity] = useState({
    current: 55,
    change: -2.5,
    history: mockHumidityHistory,
  });

  const [soilMoisture, setSoilMoisture] = useState(68);
  const [waterLevel, setWaterLevel] = useState(82);

  // == FIREBASE DATA FETCHING ==
  useEffect(() => {
    // This is where you'll fetch data from Firebase Realtime Database.
    // The timeout simulates a loading state. Remove it in production.
    const timer = setTimeout(() => setLoading(false), 1500);

    /*
    // --- UNCOMMENT AND MODIFY FOR FIREBASE INTEGRATION ---
    // import { ref, onValue } from 'firebase/database';
    // import { db } from '@/firebase'; // Adjust this import to your Firebase config file

    if (!db) return;

    // Example for Soil Moisture (current value)
    const soilMoistureRef = ref(db, 'Irrigation/SoilMoisture');
    const unsubscribeSoil = onValue(soilMoistureRef, (snapshot) => {
      if (snapshot.exists()) {
        setSoilMoisture(snapshot.val());
      }
    });

    // Example for Water Level (current value)
    const waterLevelRef = ref(db, 'Irrigation/WaterLevel');
    const unsubscribeWater = onValue(waterLevelRef, (snapshot) => {
      if (snapshot.exists()) {
        setWaterLevel(snapshot.val());
      }
    });

    // Example for Temperature (history)
    const tempHistoryRef = ref(db, 'Irrigation/Temperature'); // Adjust path if you have a history sub-node
    const unsubscribeTemp = onValue(tempHistoryRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            // Assuming data is an object like { current: 22.5, change: 1.2, history: [...] }
            // You may need to format the history array to match what the chart expects.
            setTemperature(data);
        }
    });
    
    // Example for Humidity (history)
     const humidityHistoryRef = ref(db, 'Irrigation/Humidity');
     const unsubscribeHumidity = onValue(humidityHistoryRef, (snapshot) => {
        if(snapshot.exists()) {
            setHumidity(snapshot.val());
        }
     });

    // Clean up listeners on component unmount
    return () => {
      unsubscribeSoil();
      unsubscribeWater();
      unsubscribeTemp();
      unsubscribeHumidity();
    };
    */
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <LineChartCard
        title="Temperature"
        currentValue={temperature.current}
        unit="°C"
        change={temperature.change}
        data={temperature.history}
        dataKey="value"
        gradientFrom="from-cyan-400"
        gradientTo="to-blue-500"
        gradientId="tempGradient"
      />
      <LineChartCard
        title="Humidity"
        currentValue={humidity.current}
        unit="%"
        change={humidity.change}
        data={humidity.history}
        dataKey="value"
        gradientFrom="from-purple-400"
        gradientTo="to-pink-500"
        gradientId="humidityGradient"
      />
      <CircularProgressCard
        title="Soil Moisture"
        value={soilMoisture}
        icon={Droplets}
        gradientFrom="from-teal-400"
        gradientTo="to-green-500"
      />
      <CircularProgressCard
        title="Water Level"
        value={waterLevel}
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
  isPositive?: boolean;
}

const CardWrapper: FC<CardWrapperProps> = ({ children, className, isPositive }) => (
  <div
    className={cn(
      'relative p-5 bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden',
      className
    )}
  >
    {isPositive !== undefined && (
      <div
        className={cn(
          'absolute w-0 h-0 border-l-[60px] border-b-[60px] border-l-transparent -bottom-1 -left-1',
          isPositive ? 'border-b-green-500/30' : 'border-b-red-500/30'
        )}
        style={{
          filter: 'blur(5px)',
        }}
      />
    )}
    {children}
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
    <CardWrapper isPositive={isPositive} className="col-span-1 sm:col-span-2">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-slate-300">{title}</h3>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">
            {currentValue}
            <span className="text-xl text-slate-400 ml-1">{unit}</span>
          </p>
          <div
            className={cn(
              'flex items-center justify-end text-sm font-semibold',
              isPositive ? 'text-green-400' : 'text-red-400'
            )}
          >
            <ChangeIcon className="w-4 h-4 mr-1" />
            {isPositive ? '+' : ''}
            {change}%
          </div>
        </div>
      </div>
      <div className="h-40 -ml-5 -mr-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
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
              padding={{ left: 20, right: 20 }}
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
              style={{ filter: `drop-shadow(0 2px 4px hsl(var(--primary) / 0.5))` }}
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
    <CardWrapper isPositive={value > 50} className="flex flex-col items-center justify-center">
      <h3 className="text-lg font-medium text-slate-300 absolute top-5 left-5">{title}</h3>
      <div className="relative w-40 h-40">
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
           <Icon className={cn('w-6 h-6 mb-1 text-color', gradientFrom)} />
          <span className="text-4xl font-bold text-white">{value}%</span>
        </div>
      </div>
    </CardWrapper>
  );
};

const DashboardLoadingSkeleton = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Skeleton className="h-[236px] col-span-1 sm:col-span-2 bg-slate-900/80" />
      <Skeleton className="h-[236px] col-span-1 sm:col-span-2 bg-slate-900/80" />
      <Skeleton className="h-[236px] col-span-1 sm:col-span-1 bg-slate-900/80" />
      <Skeleton className="h-[236px] col-span-1 sm:col-span-1 bg-slate-900/80" />
    </div>
);
