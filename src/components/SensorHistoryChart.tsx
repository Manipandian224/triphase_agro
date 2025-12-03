
'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useFirebase } from '@/firebase/client-provider';
import { ref, onValue, query, limitToLast } from 'firebase/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface HistoryEntry {
  Timestamp: number;
  Temperature: number;
  Humidity: number;
  SoilMoisture: number;
}

interface ChartData {
  time: string;
  Temperature: number;
  Humidity: number;
  'Soil Moisture': number;
}

export function SensorHistoryChart() {
  const { rtdb } = useFirebase();
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rtdb) return;

    const historyRef = query(ref(rtdb, 'IrrigationHistory/'), limitToLast(30));
    setLoading(true);

    const unsubscribe = onValue(
      historyRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          const formattedData = Object.values(rawData as Record<string, HistoryEntry>)
            .sort((a, b) => a.Timestamp - b.Timestamp)
            .map((entry) => ({
              time: new Date(entry.Timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              Temperature: entry.Temperature,
              Humidity: entry.Humidity,
              'Soil Moisture': entry.SoilMoisture,
            }));
          setData(formattedData);
        } else {
          // If no data, generate some mock data after a delay
          setTimeout(() => {
            if (data.length === 0) { // check if data is still empty
                const mockData = Array.from({ length: 30 }, (_, i) => {
                    const timestamp = Date.now() - (30 - i) * 60000 * 5; // 5 minute intervals
                    return {
                        time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        Temperature: 20 + Math.sin(i / 5) * 5 + Math.random() * 2,
                        Humidity: 50 + Math.cos(i / 6) * 10 + Math.random() * 5,
                        'Soil Moisture': 60 - Math.sin(i / 4) * 15 + Math.random() * 5,
                    };
                });
                setData(mockData);
            }
          }, 2000);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firebase read failed: ' + error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [rtdb]);

  if (loading && data.length === 0) {
    return <Skeleton className="h-[400px] w-full bg-white/5 rounded-2xl" />;
  }

  return (
    <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-100">Sensor Data Trends</CardTitle>
        <CardDescription className="text-slate-400">
          Historical data from the last 30 readings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--border), 0.5)" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsla(var(--background), 0.8)',
                borderColor: 'hsla(var(--border), 0.5)',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Legend wrapperStyle={{fontSize: "14px"}}/>
            <Line
              type="monotone"
              dataKey="Temperature"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Humidity"
              stroke="#82ca9d"
              strokeWidth={2}
               dot={{ r: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Soil Moisture"
              stroke="#ffc658"
              strokeWidth={2}
               dot={{ r: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
