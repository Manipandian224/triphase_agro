import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Signal } from "lucide-react";

export default function SensorsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Management</CardTitle>
        <CardDescription>
          View detailed data, manage settings, and configure alerts for each
          sensor.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[400px] rounded-lg border border-dashed shadow-sm">
        <Signal className="w-16 h-16 mb-4 text-primary" />
        <h3 className="text-xl font-semibold">Sensor Details Coming Soon</h3>
        <p className="max-w-md mt-2">
          This section will provide a detailed view for each sensor, including
          metadata, historical charts, raw telemetry, and alert configuration.
        </p>
      </CardContent>
    </Card>
  );
}
