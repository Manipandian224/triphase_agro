import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Power } from "lucide-react";

export default function PumpControlPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pump Control & Scheduling</CardTitle>
        <CardDescription>
          Manage pump operations and view historical runtime data.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[400px] rounded-lg border border-dashed shadow-sm">
        <Power className="w-16 h-16 mb-4 text-primary" />
        <h3 className="text-xl font-semibold">Pump Controls Coming Soon</h3>
        <p className="max-w-md mt-2">
          This section will allow for manual pump operation, schedule creation,
          and visualization of pump runtime and energy usage.
        </p>
      </CardContent>
    </Card>
  );
}
