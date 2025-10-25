import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import TripCard from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { Plus, Bike } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Trip {
  id: string;
  title: string;
  description: string;
  start_location: string;
  end_location: string;
  status: string;
  distance_km: number;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchTrips(session.user.id);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchTrips(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchTrips = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load trips",
        variant: "destructive",
      });
    } else {
      setTrips(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Trips</h1>
            <p className="text-muted-foreground">Manage and track all your adventures</p>
          </div>
          <Button onClick={() => navigate("/plan-trip")} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Plan New Trip
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Bike className="h-8 w-8 animate-pulse text-primary" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12">
            <Bike className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
            <p className="text-muted-foreground mb-6">Start planning your first adventure!</p>
            <Button onClick={() => navigate("/plan-trip")}>
              <Plus className="mr-2 h-4 w-4" />
              Plan Your First Trip
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onUpdate={() => fetchTrips(user.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;