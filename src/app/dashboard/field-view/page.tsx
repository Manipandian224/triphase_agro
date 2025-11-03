import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Map } from "lucide-react";

export default function FieldViewPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Field View</CardTitle>
        <CardDescription>
          An interactive map of your fields with sensor locations and camera
          feeds.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[400px] rounded-lg border border-dashed shadow-sm">
        <Map className="w-16 h-16 mb-4 text-primary" />
        <h3 className="text-xl font-semibold">Map View Coming Soon</h3>
        <p className="max-w-md mt-2">
          This section will display an interactive map with field boundaries,
          live sensor markers, and camera feed thumbnails.
        </p>
      </CardContent>
    </Card>
  );
}
