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
import { getDatabase, ref, onValue, set } from "firebase/database";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function PumpControlPage() {
  const { rtdb } = useFirebase();
  const { toast } = useToast();
  const [pumpStatus, setPumpStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!rtdb) {
      return;
    }

    const db = getDatabase();
    const pumpStatusRef = ref(db, "Irrigation/PumpStatus");

    const unsubscribe = onValue(
      pumpStatusRef,
      (snapshot) => {
        const status = snapshot.val();
        setPumpStatus(status as boolean);
        setLoading(false);
      },
      (error) => {
        console.error("Firebase Realtime Database read failed:", error);
        toast({
          variant: "destructive",
          title: "Error fetching pump status",
          description: "Could not connect to the database.",
        });
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [rtdb, toast]);

  const handlePumpToggle = async (checked: boolean) => {
    if (!rtdb) {
      toast({
        variant: "destructive",
        title: "Database not connected",
        description: "Cannot change pump status.",
      });
      return;
    }

    setIsUpdating(true);
    const db = getDatabase();
    const pumpStatusRef = ref(db, "Irrigation/PumpStatus");

    try {
      await set(pumpStatusRef, checked);
      toast({
        title: `Pump turned ${checked ? "ON" : "OFF"}`,
        description: "The pump status has been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to update pump status:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not change the pump status. Please try again.",
      });
      // Revert UI state on failure
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
            Manually override and control the main water pump.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center space-x-3">
              <Power className="h-6 w-6 text-muted-foreground" />
              <div>
                <Label htmlFor="pump-switch" className="text-base font-bold">
                  Main Pump
                </Label>
                {loading ? (
                  <Skeleton className="h-5 w-20 mt-1" />
                ) : (
                  <p
                    className={`text-sm font-medium ${
                      pumpStatus ? "text-success" : "text-muted-foreground"
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
                 {isUpdating && <Loader2 className="h-4 w-4 animate-spin absolute -left-6" />}
                <Switch
                  id="pump-switch"
                  checked={pumpStatus ?? false}
                  onCheckedChange={handlePumpToggle}
                  disabled={isUpdating || pumpStatus === null}
                  aria-label="Toggle main water pump"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Changes made here will be sent to your irrigation controller in real-time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
