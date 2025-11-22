import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function FieldViewPage() {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Field View</CardTitle>
        <CardDescription>
          An interactive map of your fields with sensor locations and camera
          feeds.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video w-full rounded-b-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15033.45448353341!2d-101.8906566858999!3d33.57005886191994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86fe6d1d42b1099b%3A0x4c2b9a7f9c87841!2sLubbock%2C%20TX%2C%20USA!5e1!3m2!1sen!2sin!4v1762198942000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Field Map"
          ></iframe>
        </div>
        <Button className="absolute top-20 right-6 rounded-full shadow-lg h-12 w-12">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add New Field</span>
        </Button>
      </CardContent>
    </Card>
  );
}
