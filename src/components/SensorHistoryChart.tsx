
'use client';

import { useState, useEffect, useRef } from 'react';
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
import type { IrrigationData } from '@/types/sensor-data';

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
  const latestTimestamp = useRef<number | null>(null);

  useEffect(() => {
    if (!rtdb) return;

    const historyRef = query(ref(rtdb, 'IrrigationHistory/'), limitToLast(30));
    setLoading(true);

    const unsubscribeHistory = onValue(
      historyRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          const formattedData: ChartData[] = Object.values(rawData as Record<string, HistoryEntry>)
            .sort((a, b) => a.Timestamp - b.Timestamp)
            .map((entry) => {
               if (latestTimestamp.current === null || entry.Timestamp > latestTimestamp.current) {
                  latestTimestamp.current = entry.Timestamp;
               }
               return {
                  time: new Date(entry.Timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  Temperature: entry.Temperature,
                  Humidity: entry.Humidity,
                  'Soil Moisture': entry.SoilMoisture,
               }
            });
          setData(formattedData);
        } else {
            // Mock data if history is empty
            const mockData = Array.from({ length: 30 }, (_, i) => {
                const timestamp = Date.now() - (30 - i) * 60000 * 5;
                if (i === 29) latestTimestamp.current = Math.floor(timestamp / 1000);
                return {
                    time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    Temperature: 20 + Math.sin(i / 5) * 5 + Math.random() * 2,
                    Humidity: 50 + Math.cos(i / 6) * 10 + Math.random() * 5,
                    'Soil Moisture': 60 - Math.sin(i / 4) * 15 + Math.random() * 5,
                };
            });
            setData(mockData);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firebase history read failed: ' + error.message);
        setLoading(false);
      }
    );

    // New listener for real-time data
    const realTimeRef = ref(rtdb, 'Irrigation/');
    const unsubscribeRealtime = onValue(realTimeRef, (snapshot) => {
        if (snapshot.exists()) {
            const newData: IrrigationData = snapshot.val();
            
            // Check if the new data is actually new
            if (newData.LastUpdate && latestTimestamp.current && newData.LastUpdate > latestTimestamp.current) {
                latestTimestamp.current = newData.LastUpdate;

                const newChartEntry: ChartData = {
                    time: new Date(newData.LastUpdate * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    Temperature: newData.Temperature || 0,
                    Humidity: newData.Humidity || 0,
                    'Soil Moisture': newData.SoilMoisture || 0,
                };

                setData(prevData => {
                    const updatedData = [...prevData, newChartEntry];
                    // Keep the chart at a fixed length (e.g., 30 points)
                    if (updatedData.length > 30) {
                        return updatedData.slice(updatedData.length - 30);
                    }
                    return updatedData;
                });
            }
        }
    });

    return () => {
        unsubscribeHistory();
        unsubscribeRealtime();
    };
  }, [rtdb]);

  if (loading && data.length === 0) {
    return <Skeleton className="h-[400px] w-full bg-white/5 rounded-2xl" />;
  }

  return (
    <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-100">Sensor Data Trends</CardTitle>
        <CardDescription className="text-slate-300">
          Live view of the last 30 sensor readings.
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
            <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--foreground), 0.2)" />
            <XAxis dataKey="time" stroke="hsl(var(--foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsla(var(--background), 0.8)',
                borderColor: 'hsla(var(--border), 0.5)',
                color: 'hsl(var(--foreground))',
                borderRadius: 'var(--radius)'
              }}
            />
            <Legend wrapperStyle={{fontSize: "14px", color: 'hsl(var(--foreground))'}}/>
            <Line
              isAnimationActive={false}
              type="monotone"
              dataKey="Temperature"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={{ r: 2, fill: '#38bdf8' }}
              activeDot={{ r: 6, fill: '#38bdf8' }}
            />
            <Line
              isAnimationActive={false}
              type="monotone"
              dataKey="Humidity"
              stroke="#f471b5"
              strokeWidth={2}
               dot={{ r: 2, fill: '#f471b5' }}
              activeDot={{ r: 6, fill: '#f471b5' }}
            />
            <Line
              isAnimationActive={false}
              type="monotone"
              dataKey="Soil Moisture"
              stroke="#fb923c"
              strokeWidth={2}
               dot={{ r: 2, fill: '#fb923c' }}
              activeDot={{ r: 6, fill: '#fb923c' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
