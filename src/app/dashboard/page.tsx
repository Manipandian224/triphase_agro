"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Droplets,
  Leaf,
  Power,
  Thermometer,
  Zap,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useFirebase } from "@/firebase/client-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { getDatabase, ref, onValue, off, set } from "firebase/database";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const chartConfig = {
  soilMoisture: {
    label: "Soil Moisture",
    color: "hsl(var(--chart-1))",
    icon: Leaf,
  },
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-2))",
    icon: Thermometer,
  },
  humidity: {
    label: "Humidity",
    color: "hsl(var(--chart-5))",
    icon: Droplets,
  },
} satisfies ChartConfig;

// This defines the structure of the data we expect from /Irrigation/
type IrrigationData = {
  SoilMoisture: number;
  Temperature: number;
  Humidity: number;
  PumpStatus: "ON" | "OFF";
  LastUpdate: number; // Unix timestamp in seconds
};

// This defines the structure for our historical chart data
type ChartDataPoint = {
  timestamp: number;
  soilMoisture: number;
  temperature: number;
  humidity: number;
};

export default function DashboardPage() {
  const { rtdb } = useFirebase();
  const { toast } = useToast();
  
  // State for live data from /Irrigation/
  const [liveData, setLiveData] = useState<Partial<IrrigationData>>({});
  
  // State for the field image URL from /SmartFarm/
  const [fieldImageUrl, setFieldImageUrl] = useState<string | null>(null);

  // State for historical data for the chart
  const [historicalData, setHistoricalData] = useState<ChartDataPoint[]>([]);
  
  // Loading states
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Connectivity status based on LastUpdate timestamp
  const [isConnected, setIsConnected] = useState(true);

  // Effect for fetching live sensor data and managing connectivity
  useEffect(() => {
    if (!rtdb) return;

    const db = getDatabase();
    const irrigationRef = ref(db, 'Irrigation/');

    const unsubscribe = onValue(irrigationRef, (snapshot) => {
      const data: IrrigationData = snapshot.val();
      if (data) {
        setLiveData(data);
        
        // Add new data to our historical log for the chart
        setHistoricalData(prevData => {
            const newDataPoint: ChartDataPoint = {
                timestamp: data.LastUpdate * 1000, // convert to ms
                soilMoisture: data.SoilMoisture,
                temperature: data.Temperature,
                humidity: data.Humidity,
            };
            // Keep only the last 50 data points
            return [...prevData, newDataPoint].slice(-50);
        });

        setIsConnected(true); // Mark as connected on new data
      }
      setLoadingInitial(false);
    }, (error) => {
      console.error("Firebase Realtime Database read failed:", error);
      setLoadingInitial(false);
      setIsConnected(false);
    });

    // Check for disconnection every 2 seconds
    const connectivityInterval = setInterval(() => {
        if (liveData.LastUpdate) {
            const now = Date.now() / 1000; // current time in seconds
            const lastUpdate = liveData.LastUpdate;
            if (now - lastUpdate > 15) {
                setIsConnected(false);
            }
        }
    }, 2000);


    return () => {
      off(irrigationRef, 'value', unsubscribe);
      clearInterval(connectivityInterval);
    };
  }, [rtdb, liveData.LastUpdate]);

  // Effect for fetching the field image URL
  useEffect(() => {
    if (!rtdb) return;

    const db = getDatabase();
    const smartFarmRef = ref(db, 'SmartFarm/cropImageURL');

    const unsubscribeImage = onValue(smartFarmRef, (snapshot) => {
        const url = snapshot.val();
        if (url) {
            setFieldImageUrl(url);
        }
        setLoadingImage(false);
    });

    return () => off(smartFarmRef, 'value', unsubscribeImage);
  }, [rtdb]);

  const sensorCards = useMemo(() => [
    { name: "Soil Moisture", value: liveData.SoilMoisture, unit: "%", icon: Leaf, configKey: "soilMoisture" },
    { name: "Air Temperature", value: liveData.Temperature, unit: "°C", icon: Thermometer, configKey: "temperature" },
    { name: "Humidity", value: liveData.Humidity, unit: "%", icon: Droplets, configKey: "humidity" },
  ], [liveData]);

  const handlePumpToggle = async (checked: boolean) => {
    if (!rtdb) {
      toast({
        variant: "destructive",
        title: "Database not connected",
        description: "Cannot update pump status.",
      });
      return;
    }

    setIsUpdating(true);

    const pumpStatusRef = ref(rtdb, "Irrigation/PumpStatus");
    const newStatus = checked ? "ON" : "OFF";

    try {
      await set(pumpStatusRef, newStatus);

      toast({
        title: `Pump turned ${newStatus}`,
        description: "Successfully updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update",
        description: "Try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-4">
        {/* Main Status Cards */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pump Status</CardTitle>
                <Power className="h-4 w-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
                {loadingInitial ? <Skeleton className="h-8 w-20"/> : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold">{liveData.PumpStatus ?? "No Data"}</div>
                          {liveData.PumpStatus && (
                              <Badge variant={liveData.PumpStatus === "ON" ? "success" : "destructive"}>
                                  {liveData.PumpStatus}
                              </Badge>
                          )}
                      </div>
                      <div className="relative flex items-center">
                        {isUpdating && (
                          <Loader2 className="h-4 w-4 animate-spin absolute -left-6" />
                        )}
                        <Switch
                          checked={liveData.PumpStatus === "ON"}
                          onCheckedChange={handlePumpToggle}
                          disabled={isUpdating || loadingInitial}
                        />
                      </div>
                    </div>
                )}
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Connectivity</CardTitle>
                {isConnected ? <Wifi className="h-4 w-4 text-success"/> : <WifiOff className="h-4 w-4 text-destructive"/>}
            </CardHeader>
            <CardContent>
                 {loadingInitial ? <Skeleton className="h-8 w-24"/> : (
                     <div className="text-2xl font-bold">{isConnected ? "Connected" : "Disconnected"}</div>
                 )}
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">My Field</CardTitle>
            </CardHeader>
            <CardContent>
                {loadingImage ? <Skeleton className="h-[60px] w-full rounded-lg"/> : (
                    fieldImageUrl ? (
                        <div className="aspect-video relative rounded-lg overflow-hidden border">
                            <Image src={fieldImageUrl} alt="My Field" fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-4">No Image Available</div>
                    )
                )}
            </CardContent>
        </Card>


      {/* Live Sensor Stream Section */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Live Sensor Stream</CardTitle>
          <CardDescription>Real-time data from field sensors.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {sensorCards.map((sensor) => (
            <div key={sensor.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <sensor.icon className="h-4 w-4" />
                  <span>{sensor.name}</span>
                </div>
                {loadingInitial ? <Skeleton className="h-5 w-16" /> : (
                    <span className="font-bold text-foreground">
                        {typeof sensor.value === 'number' ? `${sensor.value.toFixed(1)}${sensor.unit}` : "No Data"}
                    </span>
                )}
              </div>
               {loadingInitial ? <Skeleton className="h-2 w-full"/> : (
                   <Progress value={sensor.value ?? 0} indicatorClassName={cn({
                       'bg-sky-500': sensor.configKey === 'soilMoisture',
                       'bg-orange-500': sensor.configKey === 'temperature',
                       'bg-blue-500': sensor.configKey === 'humidity'
                   })} className="h-2" />
               )}
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Historical Trends Chart */}
      <Card className="lg:col-span-4">
        <CardHeader>
            <CardTitle>Historical Trends</CardTitle>
            <CardDescription>Live chart of the last 50 sensor readings.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingInitial ? <Skeleton className="h-[300px] w-full" /> : (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={historicalData} margin={{ left: -10, right: 20, top: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="timestamp"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickCount={5}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                    dataKey="soilMoisture"
                    type="natural"
                    fill="var(--color-soilMoisture)"
                    fillOpacity={0.1}
                    stroke="var(--color-soilMoisture)"
                    stackId="a"
                />
                <Area
                    dataKey="temperature"
                    type="natural"
                    fill="var(--color-temperature)"
                    fillOpacity={0.1}
                    stroke="var(--color-temperature)"
                    stackId="b"
                />
                <Area
                    dataKey="humidity"
                    type="natural"
                    fill="var(--color-humidity)"
                    fillOpacity={0.1}
                    stroke="var(--color-humidity)"
                    stackId="c"
                />
                </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
