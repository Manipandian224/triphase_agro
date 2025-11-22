"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Power, Loader2 } from "lucide-react";
import { useFirebase } from "@/firebase/client-provider";
import { ref, onValue, set } from "firebase/database";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function PumpControlPage() {
  const { rtdb } = useFirebase();      // your Realtime DB instance
  const { toast } = useToast();

  const [pumpStatus, setPumpStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!rtdb) return;

    const pumpStatusRef = ref(rtdb, "Irrigation/PumpStatus");

    const unsubscribe = onValue(
      pumpStatusRef,
      (snapshot) => {
        const status = snapshot.val();

        if (typeof status === "boolean") {
          setPumpStatus(status);
        } else if (typeof status === "string") {
          setPumpStatus(status.toUpperCase() === "ON");
        }

        setLoading(false);
      },
      () => {
        toast({
          variant: "destructive",
          title: "Error fetching pump status",
          description: "Could not connect to RTDB.",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [rtdb]);

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

      setPumpStatus(!checked);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Pump Control</CardTitle>
          <CardDescription>
            Manually override main water pump.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center space-x-3">
              <Power className="h-6 w-6 text-muted-foreground" />

              <div>
                <Label className="text-base font-bold">
                  Main Pump
                </Label>

                {loading ? (
                  <Skeleton className="h-5 w-20 mt-1" />
                ) : (
                  <p
                    className={`text-sm font-medium ${
                      pumpStatus
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {pumpStatus ? "ON" : "OFF"}
                  </p>
                )}
              </div>
            </div>

            {loading ? (
              <Skeleton className="h-6 w-11 rounded-full" />
            ) : (
              <div className="relative flex items-center">
                {isUpdating && (
                  <Loader2 className="h-4 w-4 animate-spin absolute -left-6" />
                )}

                <Switch
                  checked={pumpStatus ?? false}
                  onCheckedChange={handlePumpToggle}
                  disabled={isUpdating}
                />
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Updates are sent to your irrigation controller in real-time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
