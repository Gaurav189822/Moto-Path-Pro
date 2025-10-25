import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, AlertCircle, CheckCircle, Navigation } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ActiveTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);

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
      if (data.status === "active") {
        setTracking(true);
      }
    }
    setLoading(false);
  };

  const handleStartTrip = async () => {
    const { error } = await supabase
      .from("trips")
      .update({
        status: "active",
        start_time: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to start trip",
        variant: "destructive",
      });
    } else {
      setTracking(true);
      toast({
        title: "Trip started!",
        description: "Ride safe and enjoy the journey.",
      });
      fetchTrip();
    }
  };

  const handleEndTrip = async () => {
    const { error } = await supabase
      .from("trips")
      .update({
        status: "completed",
        end_time: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to end trip",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Trip completed!",
        description: "View your trip summary.",
      });
      navigate(`/trip-summary/${id}`);
    }
  };

  const handleSOS = async () => {
    const { error } = await supabase.from("sos_alerts").insert({
      user_id: user.id,
      trip_id: id,
      message: "Emergency alert triggered",
      status: "active",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send SOS",
        variant: "destructive",
      });
    } else {
      toast({
        title: "SOS Alert Sent!",
        description: "Emergency services have been notified.",
        variant: "destructive",
      });
    }
  };

  if (loading || !trip) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{trip.start_location} → {trip.end_location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-primary" />
                Route Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold capitalize">{trip.status}</span>
                </div>
                {trip.distance_km && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Distance</span>
                    <span className="font-semibold">{trip.distance_km} km</span>
                  </div>
                )}
                {trip.start_time && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Started</span>
                    <span className="font-semibold">
                      {new Date(trip.start_time).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                Trip Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trip.description && (
                  <p className="text-sm text-muted-foreground">{trip.description}</p>
                )}
                {trip.is_group_ride && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Group Ride</span>
                    <span className="font-semibold">
                      {trip.current_riders}/{trip.max_riders} riders
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mock Map */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <div className="h-96 bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center rounded-lg">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Map tracking will appear here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  (Google Maps integration required)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {trip.status === "planned" && (
            <Button onClick={handleStartTrip} size="lg" className="flex-1">
              <Navigation className="mr-2 h-5 w-5" />
              Start Trip
            </Button>
          )}

          {trip.status === "active" && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="lg" className="flex-1">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    SOS Emergency
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Send Emergency Alert?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will notify emergency services with your current location.
                      Use only in case of real emergency.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSOS} className="bg-destructive text-destructive-foreground">
                      Send SOS
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="lg" className="flex-1">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    End Trip
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>End Trip?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will mark your trip as completed and generate a summary.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleEndTrip}>
                      End Trip
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveTrip;