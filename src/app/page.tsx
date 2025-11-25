'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Thermometer,
  Droplets,
  Wind,
  Wifi,
  Power,
  Leaf,
  ChevronRight,
  Zap,
  Activity,
} from 'lucide-react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useRtdbValue } from '@/hooks/use-rtdb-value';
import { useFirebase } from '@/firebase/client-provider';
import { ref, query, orderByChild, limitToLast } from 'firebase/database';
import { SensorData, SensorHistory } from '@/types/sensor-data';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { format } from 'date-fns';

function LiveDashboardContent() {
  const { rtdb } = useFirebase();

  // Fetch the single most recent sensor reading
  const latestSensorQuery = rtdb ? query(ref(rtdb, 'sensors/main-field-sensor/history'), limitToLast(1)) : null;
  const { data: latestSensorDataObj, loading: loadingLatest } = useRtdbValue<{[key: string]: SensorData}>(latestSensorQuery);
  
  // Fetch the last 24 hours of data (approx 288 readings if every 5 mins)
  const historyQuery = rtdb ? query(ref(rtdb, 'sensors/main-field-sensor/history'), limitToLast(288)) : null;
  const { data: sensorHistoryObj, loading: loadingHistory } = useRtdbValue<SensorHistory>(historyQuery);

  const liveSensorData = useMemo(() => {
    if (!latestSensorDataObj) return null;
    const key = Object.keys(latestSensorDataObj)[0];
    return latestSensorDataObj[key];
  }, [latestSensorDataObj]);

  const chartData = useMemo(() => {
    if (!sensorHistoryObj) return [];
    return Object.values(sensorHistoryObj).sort((a, b) => a.timestamp - b.timestamp);
  }, [sensorHistoryObj]);

  const loading = loadingLatest || loadingHistory;

  const getStatusCard = (title: string) => {
    if (loading || !liveSensorData) {
      return { value: <Skeleton className="h-8 w-20" />, badge: <Skeleton className="h-5 w-16" />, icon: Activity, color: 'text-muted-foreground' };
    }
    switch (title) {
      case 'Pump Status':
        const pumpOn = liveSensorData.pumpStatus === 'ON';
        return { value: liveSensorData.pumpStatus, badge: pumpOn ? 'Active' : 'Idle', icon: Droplets, color: pumpOn ? 'text-green-400' : 'text-yellow-400' };
      case '3-Phase Power':
        const powerOk = liveSensorData.threePhasePower === 'OK';
        return { value: liveSensorData.threePhasePower, badge: powerOk ? 'Nominal' : 'Fault', icon: Power, color: powerOk ? 'text-green-400' : 'text-red-400' };
      case 'Connectivity':
        const isOnline = liveSensorData.connectivity === 'Online';
        return { value: liveSensorData.connectivity, badge: isOnline ? 'Connected' : 'Offline', icon: Wifi, color: isOnline ? 'text-green-400' : 'text-muted-foreground' };
      case 'Crop Health':
        const health = liveSensorData.cropHealth;
        return { value: `${health.toFixed(0)}%`, badge: health > 85 ? 'Excellent' : 'Good', icon: Leaf, color: health > 85 ? 'text-green-400' : 'text-yellow-400'};
      default:
        return { value: 'N/A', badge: 'Unknown', icon: Activity, color: 'text-muted-foreground' };
    }
  };

  const getSensorReading = (title: string) => {
    if (loading || !liveSensorData) return { value: <Skeleton className="h-8 w-24" />, change: <div className="h-4 w-32 mt-1"><Skeleton className="h-full w-full" /></div> };
    switch (title) {
      case 'Soil Moisture':
        return { value: `${liveSensorData.soilMoisture.toFixed(1)}%`, change: "+1.2% vs last hr" };
      case 'Air Temperature':
        return { value: `${liveSensorData.airTemp.toFixed(1)}°C`, change: "-0.5°C vs last hr" };
      case 'Humidity':
        return { value: `${liveSensorData.humidity.toFixed(1)}%`, change: "+2.0% vs last hr" };
      case 'Water Flow':
        return { value: `${liveSensorData.waterFlow.toFixed(1)} L/min`, change: "Stable" };
      default:
        return { value: 'N/A', change: ''};
    }
  };

  const sensorReadings = [
    { title: 'Soil Moisture', icon: Droplets, dataKey: 'soilMoisture', color: 'hsl(var(--primary))' },
    { title: 'Air Temperature', icon: Thermometer, dataKey: 'airTemp', color: 'hsl(20, 80%, 60%)' },
    { title: 'Humidity', icon: Wind, dataKey: 'humidity', color: 'hsl(200, 80%, 60%)' },
    { title: 'Water Flow', icon: Zap, dataKey: 'waterFlow', color: 'hsl(50, 80%, 60%)' },
  ];

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {['Pump Status', '3-Phase Power', 'Connectivity', 'Crop Health'].map(title => {
          const { value, badge, icon: Icon, color } = getStatusCard(title);
          return (
            <Card key={title} className="bg-card shadow-soft-sm border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className={`h-5 w-5 ${color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                <Badge variant={'outline'} className={`mt-2 text-xs font-medium border-current ${color}`}>
                  {badge}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {sensorReadings.map(sensor => {
          const {value, change} = getSensorReading(sensor.title);
          return (
             <Card key={sensor.title} className="bg-card flex flex-col shadow-soft-sm border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{sensor.title}</CardTitle>
                <sensor.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-bold">{value}</div>
                  <div className="text-xs text-muted-foreground">{change}</div>
                </div>
                <div className="h-[80px] -ml-6 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          borderColor: "hsl(var(--border))",
                          color: "hsl(var(--popover-foreground))"
                        }}
                        cursor={{fill: 'hsl(var(--secondary))'}}
                        formatter={(value: number) => value.toFixed(1)}
                        labelFormatter={(label: number) => format(new Date(label), 'HH:mm')}
                      />
                      <Line type="monotone" dataKey={sensor.dataKey} name={sensor.title} stroke={sensor.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card shadow-soft-lg border-white/10">
          <CardHeader>
            <CardTitle>Crop Health Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM d, HH:mm')}
                      />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="%"/>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        borderColor: "hsl(var(--border))",
                      }}
                      labelFormatter={(label) => format(new Date(label), 'eeee, MMM d, yyyy HH:mm')}
                    />
                    <Legend wrapperStyle={{fontSize: "0.875rem"}}/>
                    <Line type="monotone" dataKey="cropHealth" name="Health Score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4, fill: "hsl(var(--primary))"}} activeDot={{ r: 8, strokeWidth: 2, stroke: 'hsl(var(--background))' }}/>
                  </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4 lg:col-span-3 bg-card shadow-soft-lg border-white/10">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlertItem level="High" message="Soil moisture is critically low in Section A-3." time="25m ago" />
            <AlertItem level="Medium" message="Pump 2 showing pressure fluctuations." time="1h ago" />
            <AlertItem level="Low" message="Connectivity issue detected on Sensor-11B." time="3h ago" />
            <div className="flex justify-end pt-2">
              <Button asChild variant="link" className="text-primary h-auto p-0">
                <Link href="#">
                  View All Alerts <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )

}


export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-4xl font-bold tracking-tighter">Live Field Dashboard</h2>
      </div>

      <LiveDashboardContent />
      
    </div>
  );
}


type AlertItemProps = {
  level: 'High' | 'Medium' | 'Low';
  message: string;
  time: string;
}
function AlertItem({level, message, time}: AlertItemProps) {
  const levelColors = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-blue-500',
  }
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/80 border border-border">
      <div className="flex h-3 w-3 mt-1.5">
          <span className={`relative flex h-3 w-3 rounded-full ${levelColors[level]}`}>
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${levelColors[level]} opacity-75`}></span>
          </span>
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}
