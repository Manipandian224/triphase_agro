'use client';
import { useMemo } from 'react';
import { ref, query, limitToLast } from 'firebase/database';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirebase } from '@/firebase/client-provider';
import { useRtdbValue } from '@/hooks/use-rtdb-value';
import type { SensorData } from '@/types/sensor-data';
import {
  Thermometer,
  Droplets,
  Wind,
  Layers,
  FlaskConical,
  Power,
  Activity,
  AlertCircle,
} from 'lucide-react';

// Define the structure for each sensor card
const sensorCards = [
  {
    title: 'Soil Moisture',
    dataKey: 'soilMoisture',
    unit: '%',
    icon: Droplets,
  },
  { title: 'Temperature', dataKey: 'airTemp', unit: '°C', icon: Thermometer },
  { title: 'Humidity', dataKey: 'humidity', unit: '%', icon: Wind },
  { title: 'Water Level', dataKey: 'waterLevel', unit: 'm', icon: Layers },
  { title: 'pH Value', dataKey: 'phValue', unit: '', icon: FlaskConical },
];

/**
 * A component to display real-time sensor data from Firebase RTDB.
 */
export function RealtimeSensorData() {
  const { rtdb } = useFirebase();

  // Define the query to get the single most recent sensor reading.
  const sensorQuery = rtdb
    ? query(ref(rtdb, 'sensors/main-field-sensor'), limitToLast(1))
    : null;

  // Use the custom hook to get live data. The data is expected to be an object
  // with a single key-value pair, e.g., { "reading_123": { ...sensorData } }
  const {
    data: latestReadingObj,
    loading,
    error,
  } = useRtdbValue<{ [key: string]: SensorData }>(sensorQuery);

  // Extract the actual sensor data object from the parent object.
  const sensorData = useMemo(() => {
    if (!latestReadingObj) return null;
    const readingKey = Object.keys(latestReadingObj)[0];
    return latestReadingObj[readingKey];
  }, [latestReadingObj]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not fetch sensor data. Please try again later.</p>
          <p className="text-xs text-muted-foreground mt-2">
            {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Pump Status Card */}
      <Card className="bg-card shadow-soft-sm border-white/10 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pump Status
          </CardTitle>
          {loading ? <Activity className="h-5 w-5 text-muted-foreground" /> : <Power className={`h-5 w-5 ${sensorData?.pumpStatus === 'ON' ? 'text-green-400' : 'text-yellow-400'}`} />}
        </CardHeader>
        <CardContent>
          {loading ? (
            <>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-5 w-16 mt-2" />
            </>
          ) : (
            <>
              <div className="text-3xl font-bold">{sensorData?.pumpStatus}</div>
              <Badge
                variant={'outline'}
                className={`mt-2 text-xs font-medium border-current ${sensorData?.pumpStatus === 'ON' ? 'text-green-400' : 'text-yellow-400'}`}
              >
                {sensorData?.pumpStatus === 'ON' ? 'Active' : 'Idle'}
              </Badge>
            </>
          )}
        </CardContent>
      </Card>

      {/* Spacer div to align grid */}
      <div className="hidden lg:block lg:col-span-2"></div>


      {/* Dynamic Sensor Cards */}
      {sensorCards.map(({ title, dataKey, unit, icon: Icon }) => (
        <Card key={title} className="bg-card shadow-soft-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <Icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading || !sensorData ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-3xl font-bold">
                {(sensorData as any)[dataKey as keyof SensorData]?.toFixed(1) || 'N/A'}
                {unit && <span className="text-xl text-muted-foreground ml-1">{unit}</span>}
              </div>
            )}
            {!loading && !(sensorData as any)?.[dataKey as keyof SensorData] && (
                 <p className="text-xs text-yellow-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    No data
                 </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
