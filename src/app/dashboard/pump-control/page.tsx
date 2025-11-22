"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Wrench } from "lucide-react";

export default function PumpControlPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Removed</CardTitle>
        <CardDescription>
          This page is no longer in use.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[400px] rounded-lg border border-dashed shadow-sm">
        <Wrench className="w-16 h-16 mb-4 text-primary" />
        <h3 className="text-xl font-semibold">Under Construction</h3>
        <p className="max-w-md mt-2">
          The pump controls have been moved to the main dashboard. This page can be repurposed or removed.
        </p>
      </CardContent>
    </Card>
  );
}
