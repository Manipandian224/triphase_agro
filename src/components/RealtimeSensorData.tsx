
'use client';
import { useMemo } from 'react';
import { ref } from 'firebase/database';
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
import type { IrrigationData } from '@/types/sensor-data';
import {
  Thermometer,
  Droplets,
  Wind,
  Power,
  Activity,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';


// Define the structure for each sensor card
const sensorCards = [
  {
    title: 'Soil Moisture',
    dataKey: 'SoilMoisture',
    unit: '%',
    icon: Droplets,
  },
  { title: 'Temperature', dataKey: 'Temperature', unit: '°C', icon: Thermometer },
  { title: 'Humidity', dataKey: 'Humidity', unit: '%', icon: Wind },
];

/**
 * A component to display real-time sensor data from Firebase RTDB.
 */
export function RealtimeSensorData() {
  const { rtdb } = useFirebase();

  // Define the query to get the irrigation data.
  const sensorQuery = rtdb ? ref(rtdb, 'Irrigation') : null;

  const {
    data: sensorData,
    loading,
    error,
  } = useRtdbValue<IrrigationData>(sensorQuery);
  
  const lastUpdateFormatted = useMemo(() => {
    if (!sensorData?.LastUpdate) return null;
    // Assuming LastUpdate is a Unix timestamp in seconds
    return format(new Date(sensorData.LastUpdate * 1000), 'MMM d, yyyy, h:mm:ss a');
  }, [sensorData?.LastUpdate]);


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
      <Card className="bg-card shadow-soft-sm border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pump Status
          </CardTitle>
          {loading ? <Activity className="h-5 w-5 text-muted-foreground" /> : <Power className={`h-5 w-5 ${sensorData?.PumpStatus === 'ON' ? 'text-green-400' : 'text-yellow-400'}`} />}
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-3xl font-bold">{sensorData?.PumpStatus || 'N/A'}</div>
              {!sensorData?.PumpStatus && <p className="text-xs text-yellow-500 flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" />No data</p>}
            </>
          )}
        </CardContent>
      </Card>
      
       {/* Last Updated Card */}
      <Card className="bg-card shadow-soft-sm border-white/10 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Last Update
          </CardTitle>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-48" />
          ) : (
            <div className="text-3xl font-bold">{lastUpdateFormatted || 'N/A'}</div>
          )}
        </CardContent>
      </Card>

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
                {(sensorData as any)[dataKey as keyof IrrigationData]?.toFixed(1) || 'N/A'}
                {unit && <span className="text-xl text-muted-foreground ml-1">{unit}</span>}
              </div>
            )}
            {!loading && sensorData && (sensorData as any)[dataKey as keyof IrrigationData] === undefined && (
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
