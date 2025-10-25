import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, MapPin, Calendar, UserPlus, Bike } from "lucide-react";
import { format } from "date-fns";

interface GroupRide {
  id: string;
  title: string;
  description: string;
  start_location: string;
  end_location: string;
  status: string;
  distance_km: number;
  max_riders: number;
  current_riders: number;
  created_at: string;
  user_id: string;
  organizer_name?: string;
}

const GroupRides = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [rides, setRides] = useState<GroupRide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchGroupRides();
      }
    };
    checkUser();
  }, [navigate]);

  const fetchGroupRides = async () => {
    setLoading(true);
    const { data: tripsData, error: tripsError } = await supabase
      .from("trips")
      .select("*")
      .eq("is_group_ride", true)
      .eq("status", "planned")
      .order("created_at", { ascending: false });

    if (tripsError) {
      toast({
        title: "Error",
        description: "Failed to load group rides",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Fetch organizer names
    const ridesWithOrganizers = await Promise.all(
      (tripsData || []).map(async (trip) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", trip.user_id)
          .maybeSingle();

        return {
          ...trip,
          organizer_name: profile?.full_name || "Unknown",
        };
      })
    );

    setRides(ridesWithOrganizers);
    setLoading(false);
  };

  const handleJoinRide = async (rideId: string, currentRiders: number, maxRiders: number) => {
    if (currentRiders >= maxRiders) {
      toast({
        title: "Ride Full",
        description: "This ride has reached maximum capacity",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("trips")
      .update({ current_riders: currentRiders + 1 })
      .eq("id", rideId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to join ride",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Joined!",
        description: "You've joined this group ride",
      });
      fetchGroupRides();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Group Rides</h1>
            <p className="text-muted-foreground">Find and join rides with other bikers</p>
          </div>
          <Button onClick={() => navigate("/plan-trip")}>
            Create Group Ride
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Bike className="h-8 w-8 animate-pulse text-primary" />
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No group rides available</h3>
            <p className="text-muted-foreground mb-6">Be the first to create one!</p>
            <Button onClick={() => navigate("/plan-trip")}>
              Create Group Ride
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.map((ride) => (
              <Card key={ride.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{ride.title}</CardTitle>
                    <Badge variant="secondary">
                      {ride.current_riders}/{ride.max_riders}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Organized by {ride.organizer_name || "Unknown"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{ride.start_location} → {ride.end_location}</span>
                  </div>
                  {ride.distance_km && (
                    <div className="text-sm">
                      <span className="font-semibold">{ride.distance_km} km</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(ride.created_at), "MMM d, yyyy")}</span>
                  </div>
                  {ride.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{ride.description}</p>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  {ride.user_id === user?.id ? (
                    <Button
                      onClick={() => navigate(`/active-trip/${ride.id}`)}
                      className="flex-1"
                    >
                      Manage Ride
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleJoinRide(ride.id, ride.current_riders, ride.max_riders)}
                      disabled={ride.current_riders >= ride.max_riders}
                      className="flex-1"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      {ride.current_riders >= ride.max_riders ? "Full" : "Join Ride"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/active-trip/${ride.id}`)}
                  >
                    Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupRides;