
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Thermometer,
  Droplets,
  Wind,
  Wifi,
  Power,
  Leaf,
  BarChart,
  ChevronRight,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart, Line, LineChart, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const statusCards = [
  {
    title: 'Pump Status',
    value: 'ON',
    icon: Droplets,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    variant: 'success',
  },
  {
    title: '3-Phase Power',
    value: 'OK',
    icon: Power,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    variant: 'success',
  },
  {
    title: 'Connectivity',
    value: 'Online',
    icon: Wifi,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    variant: 'success',
  },
  {
    title: 'Crop Health',
    value: '92%',
    icon: Leaf,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    variant: 'success',
  },
];

const sensorData = [
  {
    title: 'Soil Moisture',
    value: '68%',
    icon: Droplets,
    chartData: [
      { time: '00:00', value: 65 },
      { time: '04:00', value: 68 },
      { time: '08:00', value: 62 },
      { time: '12:00', value: 70 },
      { time: '16:00', value: 68 },
      { time: '20:00', value: 66 },
    ],
    color: "hsl(var(--primary))",
  },
  {
    title: 'Air Temperature',
    value: '24°C',
    icon: Thermometer,
    chartData: [
      { time: '00:00', value: 22 },
      { time: '04:00', value: 21 },
      { time: '08:00', value: 23 },
      { time: '12:00', value: 26 },
      { time: '16:00', value: 25 },
      { time: '20:00', value: 23 },
    ],
    color: 'hsl(20, 80%, 60%)',
  },
  {
    title: 'Humidity',
    value: '55%',
    icon: Wind,
    chartData: [
      { time: '00:00', value: 58 },
      { time: '04:00', value: 60 },
      { time: '08:00', value: 55 },
      { time: '12:00', value: 50 },
      { time: '16:00', value: 52 },
      { time: '20:00', value: 54 },
    ],
    color: 'hsl(200, 80%, 60%)',
  },
    {
    title: 'Water Flow',
    value: '12 L/min',
    icon: Wind, // Placeholder icon
    chartData: [
      { time: '00:00', value: 10 },
      { time: '04:00', value: 12 },
      { time: '08:00', value: 11 },
      { time: '12:00', value: 15 },
      { time: '16:00', value: 14 },
      { time: '20:00', value: 12 },
    ],
    color: 'hsl(180, 80%, 60%)',
  },
];

const cropHealthChartData = [
  { date: 'May 1', health: 85 },
  { date: 'May 8', health: 88 },
  { date: 'May 15', health: 87 },
  { date: 'May 22', health: 92 },
  { date: 'May 29', health: 91 },
  { date: 'Jun 5', health: 93 },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-secondary/20">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statusCards.map(card => (
          <Card key={card.title} className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
               <Badge variant={'outline'} className={`mt-2 ${card.color} border-current`}>Normal</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Sensor Data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sensorData.map(sensor => (
          <Card key={sensor.title} className="bg-card flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{sensor.title}</CardTitle>
              <sensor.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div>
                <div className="text-2xl font-bold">{sensor.value}</div>
                <p className="text-xs text-muted-foreground">+2.1% from last hour</p>
              </div>
              <div className="h-[80px] -ml-6 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sensor.chartData}>
                    <Line type="monotone" dataKey="value" stroke={sensor.color} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Crop Health */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card">
          <CardHeader>
            <CardTitle>Crop Health Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cropHealthChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="%"/>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="health" name="Health Score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4, fill: "hsl(var(--primary))"}} activeDot={{ r: 8 }}/>
                  </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4 lg:col-span-3 bg-card">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlertItem level="High" message="Soil moisture is critically low in Section A-3." time="25m ago" />
            <AlertItem level="Medium" message="Pump 2 showing pressure fluctuations." time="1h ago" />
            <AlertItem level="Low" message="Connectivity issue detected on Sensor-11B." time="3h ago" />
            <div className="flex justify-end">
              <Link href="#" className="text-sm font-medium text-primary hover:underline flex items-center">
                View All Alerts <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
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
    <div className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
      <div className="flex h-3 w-3 mt-1.5">
          <span className={`relative flex h-3 w-3 rounded-full ${levelColors[level]}`}>
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${levelColors[level]} opacity-75`}></span>
          </span>
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{message}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}

    