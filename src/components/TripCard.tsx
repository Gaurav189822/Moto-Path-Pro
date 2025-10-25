import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Play, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface TripCardProps {
  trip: {
    id: string;
    title: string;
    description?: string;
    start_location: string;
    end_location: string;
    status: string;
    distance_km?: number;
    created_at: string;
  };
  onUpdate?: () => void;
}

const TripCard = ({ trip }: TripCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent text-accent-foreground";
      case "completed":
        return "bg-secondary text-secondary-foreground";
      case "planned":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleAction = () => {
    if (trip.status === "planned") {
      navigate(`/active-trip/${trip.id}`);
    } else if (trip.status === "active") {
      navigate(`/active-trip/${trip.id}`);
    } else {
      navigate(`/trip-summary/${trip.id}`);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{trip.title}</CardTitle>
          <Badge className={getStatusColor(trip.status)}>
            {trip.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{trip.start_location} → {trip.end_location}</span>
        </div>
        {trip.distance_km && (
          <div className="text-sm">
            <span className="font-semibold">{trip.distance_km} km</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(trip.created_at), "MMM d, yyyy")}</span>
        </div>
        {trip.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{trip.description}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAction} className="w-full">
          {trip.status === "planned" && (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Trip
            </>
          )}
          {trip.status === "active" && (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              View Active
            </>
          )}
          {trip.status === "completed" && (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              View Summary
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TripCard;