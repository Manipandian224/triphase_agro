import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { History } from "lucide-react";

export default function LogsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit & Event Logs</CardTitle>
        <CardDescription>
          A detailed history of all system events and user actions.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[400px] rounded-lg border border-dashed shadow-sm">
        <History className="w-16 h-16 mb-4 text-primary" />
        <h3 className="text-xl font-semibold">Logs Coming Soon</h3>
        <p className="max-w-md mt-2">
          This section will contain detailed audit logs for pump control, user
          actions, and a complete history of system alerts and events.
        </p>
      </CardContent>
    </Card>
  );
}
