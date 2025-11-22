"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Signal } from "lucide-react";
import { useFirebase } from "@/firebase/client-provider";
import { ref, onValue } from "firebase/database";
import { Skeleton } from "@/components/ui/skeleton";

export default function SensorsPage() {
  const { rtdb } = useFirebase();

  const [sensorData, setSensorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rtdb) return;

    const sensorRef = ref(rtdb, "Irrigation/Sensors");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        setSensorData(snapshot.val());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [rtdb]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Management</CardTitle>
        <CardDescription>
          View real-time sensor readings from your field.
        </CardDescription>
      </CardHeader>

      <CardContent className="min-h-[400px]">
        {/* SHOW LOADING UI */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-6 w-44" />
          </div>
        )}

        {/* SHOW EMPTY MESSAGE IF NO SENSORS */}
        {!loading && !sensorData && (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px] border border-dashed rounded-lg">
            <Signal className="w-16 h-16 mb-4 text-primary" />
            <h3 className="text-xl font-semibold">No sensor data found</h3>
            <p className="max-w-md mt-2">
              Connect your ESP32 or NodeMCU to push live sensor data.
            </p>
          </div>
        )}

        {/* SHOW REAL SENSOR VALUES */}
        {!loading && sensorData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-1">Soil Moisture</h3>
              <p className="text-2xl font-bold">{sensorData?.Moisture ?? "NA"}</p>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-1">Temperature</h3>
              <p className="text-2xl font-bold">{sensorData?.Temperature ?? "NA"}°C</p>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-1">Humidity</h3>
              <p className="text-2xl font-bold">{sensorData?.Humidity ?? "NA"}%</p>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-1">Water Level</h3>
              <p className="text-2xl font-bold">{sensorData?.WaterLevel ?? "NA"}</p>
            </Card>

          </div>
        )}
      </CardContent>
    </Card>
  );
}
