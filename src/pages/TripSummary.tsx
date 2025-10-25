import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, Calendar, TrendingUp, Home } from "lucide-react";
import { format } from "date-fns";

const TripSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchTrip();
      }
    };
    checkUser();
  }, [navigate, id]);

  const fetchTrip = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load trip",
        variant: "destructive",
      });
      navigate("/dashboard");
    } else {
      setTrip(data);
    }
    setLoading(false);
  };

  const calculateDuration = () => {
    if (!trip.start_time || !trip.end_time) return "N/A";
    const start = new Date(trip.start_time);
    const end = new Date(trip.end_time);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading || !trip) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Trip Summary</h1>
          <h2 className="text-2xl text-muted-foreground">{trip.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Distance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {trip.distance_km ? `${trip.distance_km} km` : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-secondary" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{calculateDuration()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-accent" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold capitalize">{trip.status}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Route Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-semibold">Start Location</p>
                <p className="text-muted-foreground">{trip.start_location}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-destructive mt-1" />
              <div>
                <p className="font-semibold">End Location</p>
                <p className="text-muted-foreground">{trip.end_location}</p>
              </div>
            </div>

            {trip.description && (
              <div className="flex items-start gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-semibold">Description</p>
                  <p className="text-muted-foreground">{trip.description}</p>
                </div>
              </div>
            )}

            {trip.start_time && (
              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-semibold">Started</p>
                  <p className="text-muted-foreground">
                    {format(new Date(trip.start_time), "PPpp")}
                  </p>
                </div>
              </div>
            )}

            {trip.end_time && (
              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-semibold">Completed</p>
                  <p className="text-muted-foreground">
                    {format(new Date(trip.end_time), "PPpp")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mock Map */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Route Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center rounded-lg">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Route visualization will appear here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  (Google Maps integration required)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => navigate("/dashboard")} size="lg" className="flex-1">
            <Home className="mr-2 h-5 w-5" />
            Back to Dashboard
          </Button>
          <Button variant="outline" size="lg" className="flex-1" onClick={() => navigate("/plan-trip")}>
            Plan Another Trip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TripSummary;