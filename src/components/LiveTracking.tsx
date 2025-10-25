import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation, Gauge, Clock } from "lucide-react";

interface LiveTrackingProps {
  tripId: string;
  isActive: boolean;
}

const LiveTracking = ({ tripId, isActive }: LiveTrackingProps) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    // Mock live tracking data
    const interval = setInterval(() => {
      setSpeed(Math.floor(Math.random() * 40) + 40); // 40-80 km/h
      setDistance((prev) => prev + 0.5); // Increment distance
      setDuration((prev) => prev + 1); // Increment duration in seconds
    }, 1000);

    // Mock GPS tracking
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("GPS Error:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      return () => {
        clearInterval(interval);
        navigator.geolocation.clearWatch(watchId);
      };
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (!isActive) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Start your trip to enable live tracking</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-accent animate-pulse" />
          Live Tracking
          <Badge className="ml-auto bg-accent text-accent-foreground">Active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Gauge className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Speed</span>
            </div>
            <p className="text-2xl font-bold">{speed}</p>
            <p className="text-xs text-muted-foreground">km/h</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Navigation className="h-4 w-4 text-secondary" />
              <span className="text-xs text-muted-foreground">Distance</span>
            </div>
            <p className="text-2xl font-bold">{distance.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">km</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground">Duration</span>
            </div>
            <p className="text-lg font-bold">{formatDuration(duration)}</p>
          </div>
        </div>

        {location && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">Current Location:</p>
            <p className="text-xs font-mono mt-1">
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          </div>
        )}

        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            GPS tracking active • Location updates every second
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTracking;