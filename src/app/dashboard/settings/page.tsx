import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Manage users, roles, notification preferences, and system
          configurations.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[400px] rounded-lg border border-dashed shadow-sm">
        <Settings className="w-16 h-16 mb-4 text-primary" />
        <h3 className="text-xl font-semibold">Settings Panel Coming Soon</h3>
        <p className="max-w-md mt-2">
          This section will be for administrators to manage user roles, set
          global alert thresholds, and configure system settings.
        </p>
      </CardContent>
    </Card>
  );
}
