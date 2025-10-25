import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Route, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";

const tripSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  startLocation: z.string().min(2, "Start location required").max(200),
  endLocation: z.string().min(2, "End location required").max(200),
  description: z.string().max(500).optional(),
  distanceKm: z.number().min(1).optional(),
  maxRiders: z.number().min(1).max(50).optional(),
});

const PlanTrip = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isGroupRide, setIsGroupRide] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    startLocation: "",
    endLocation: "",
    description: "",
    distanceKm: "",
    maxRiders: "1",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = tripSchema.parse({
        title: formData.title,
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        description: formData.description || undefined,
        distanceKm: formData.distanceKm ? parseFloat(formData.distanceKm) : undefined,
        maxRiders: parseInt(formData.maxRiders),
      });

      const { error } = await supabase.from("trips").insert({
        user_id: user.id,
        title: validatedData.title,
        start_location: validatedData.startLocation,
        end_location: validatedData.endLocation,
        description: validatedData.description,
        distance_km: validatedData.distanceKm,
        max_riders: validatedData.maxRiders,
        is_group_ride: isGroupRide,
        status: "planned",
      });

      if (error) throw error;

      toast({
        title: "Trip planned!",
        description: "Your adventure awaits.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create trip",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Plan Your Trip</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              Trip Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Trip Title</Label>
                <Input
                  id="title"
                  placeholder="Weekend Mountain Ride"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Start Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="start"
                      placeholder="City, State"
                      className="pl-10"
                      value={formData.startLocation}
                      onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end">End Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="end"
                      placeholder="City, State"
                      className="pl-10"
                      value={formData.endLocation}
                      onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Scenic route through the mountains..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distance">Estimated Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  placeholder="150"
                  value={formData.distanceKm}
                  onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <Label>Group Ride</Label>
                    <p className="text-sm text-muted-foreground">Allow others to join</p>
                  </div>
                </div>
                <Switch checked={isGroupRide} onCheckedChange={setIsGroupRide} />
              </div>

              {isGroupRide && (
                <div className="space-y-2">
                  <Label htmlFor="maxRiders">Maximum Riders</Label>
                  <Input
                    id="maxRiders"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.maxRiders}
                    onChange={(e) => setFormData({ ...formData, maxRiders: e.target.value })}
                  />
                </div>
              )}

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Trip"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanTrip;