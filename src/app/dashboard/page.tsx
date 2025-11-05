"use client"

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CircleDot,
  Droplets,
  Leaf,
  Power,
  Thermometer,
  Zap,
  Wind,
  Waves,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useFirebase } from "@/firebase/client-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { getDatabase, ref, onValue, off } from "firebase/database";

const alerts = [
  {
    time: "2m ago",
    severity: "Warning",
    description: "Soil moisture low in Sector A.",
  },
  {
    time: "1h ago",
    severity: "Critical",
    description: "Phase B fault detected on Pump 2.",
  },
  { time: "5h ago", severity: "Info", description: "Pump 1 cycle completed." },
  {
    time: "1d ago",
    severity: "Warning",
    description: "Sensor ESP32-04 offline.",
  },
];

const chartData = [
  { date: "2024-05-20", moisture: 35, temperature: 22 },
  { date: "2024-05-21", moisture: 38, temperature: 24 },
  { date: "2024-05-22", moisture: 32, temperature: 21 },
  { date: "2024-05-23", moisture: 40, temperature: 25 },
  { date: "2024-05-24", moisture: 45, temperature: 26 },
  { date: "2024-05-25", moisture: 42, temperature: 27 },
  { date: "2024-05-26", moisture: 39, temperature: 24 },
];

const chartConfig = {
  moisture: {
    label: "Soil Moisture (%)",
    color: "hsl(var(--chart-1))",
  },
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type SensorDataFromDevice = {
  SoilMoisture: number;
  Temperature: number;
  Humidity: number;
  PumpStatus: boolean;
};

type SensorData = {
  pumpStatus: 'ON' | 'OFF';
  threePhasePower: 'OK' | 'FAULT';
  connectivity: 'Online' | 'Offline';
  cropHealth: number;
  soilMoisture: number;
  airTemp: number;
  humidity: number;
  waterFlow: number;
};

export default function DashboardPage() {
  const { rtdb } = useFirebase();
  const [sensorData, setSensorData] = useState<Partial<SensorData>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!rtdb) {
      return;
    }
    
    const db = getDatabase();
    const sensorRef = ref(db, 'Irrigation/');

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data: SensorDataFromDevice = snapshot.val();
      if (data) {
        setSensorData({
          soilMoisture: data.SoilMoisture,
          airTemp: data.Temperature,
          humidity: data.Humidity,
          pumpStatus: data.PumpStatus ? 'ON' : 'OFF',
          // Assuming default values for other properties for now
          threePhasePower: 'OK',
          connectivity: 'Online',
          cropHealth: 85, // Example value
          waterFlow: 0, // Example value
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase Realtime Database read failed:", error);
      setLoading(false);
    });

    return () => {
      off(sensorRef, 'value', unsubscribe);
    };
  }, [rtdb]);

  const kpiData = [
    {
      title: "Pump Status",
      value: sensorData?.pumpStatus ?? "N/A",
      change: "Last change: 2h ago",
      icon: Power,
      status: sensorData?.pumpStatus === "ON" ? "ok" : "warning",
    },
    {
      title: "3-Phase Power",
      value: sensorData?.threePhasePower ?? "N/A",
      change: "All phases active",
      icon: Zap,
      status: sensorData?.threePhasePower === "OK" ? "ok" : "critical",
    },
    {
      title: "Connectivity",
      value: sensorData?.connectivity ?? "N/A",
      change: "All sensors reporting",
      icon: CircleDot,
      status: sensorData?.connectivity === "Online" ? "ok" : "warning",
    },
    {
      title: "Crop Health",
      value: `${sensorData?.cropHealth ?? "0"}/100`,
      change: "+2% this week",
      icon: Leaf,
      status: "ok",
    },
  ];
  
  const liveSensorData = [
    { name: "Soil Moisture", value: `${sensorData?.soilMoisture?.toFixed(1) ?? "N/A"}%`, icon: Droplets },
    { name: "Air Temp", value: `${sensorData?.airTemp?.toFixed(1) ?? "N/A"}°C`, icon: Thermometer },
    { name: "Humidity", value: `${sensorData?.humidity?.toFixed(1) ?? "N/A"}%`, icon: Wind },
    { name: "Water Flow", value: `${sensorData?.waterFlow?.toFixed(1) ?? "N/A"} L/min`, icon: Waves },
  ];


  return (
    <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon
              className={cn("h-4 w-4 text-muted-foreground", {
                "text-primary": kpi.status === "ok",
                "text-accent": kpi.status === "warning",
                "text-destructive": kpi.status === "critical",
              })}
            />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{kpi.value}</div>}
             {loading ? <Skeleton className="h-4 w-32 mt-1" /> : <p className="text-xs text-muted-foreground">{kpi.change}</p>}
          </CardContent>
        </Card>
      ))}

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Live Sensor Stream</CardTitle>
          <CardDescription>Real-time data from field sensors.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {liveSensorData.map((sensor, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-muted">
                <sensor.icon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  {sensor.name}
                </div>
                 {loading ? <Skeleton className="h-6 w-20 mt-1" /> : <div className="text-lg font-bold">{sensor.value}</div>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Historical Trends</CardTitle>
            <CardDescription>Last 7 days of sensor data.</CardDescription>
          </div>
          <Select defaultValue="moisture">
            <SelectTrigger className="w-[160px] ml-auto">
              <SelectValue placeholder="Select Sensor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="moisture">Soil Moisture</SelectItem>
              <SelectItem value="temperature">Temperature</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart data={chartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={3}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="moisture"
                type="natural"
                fill="var(--color-moisture)"
                fillOpacity={0.4}
                stroke="var(--color-moisture)"
                stackId="a"
              />
               <Area
                dataKey="temperature"
                type="natural"
                fill="var(--color-temperature)"
                fillOpacity={0.4}
                stroke="var(--color-temperature)"
                stackId="b"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Alerts Feed</CardTitle>
          <CardDescription>Recent system events and warnings.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              {alerts.map((alert, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{alert.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.time}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        alert.severity === "Critical"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        alert.severity === "Warning"
                          ? "bg-accent text-accent-foreground hover:bg-accent/80"
                          : alert.severity === "Info" ? "bg-secondary text-secondary-foreground" : ""
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
