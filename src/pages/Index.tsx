import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Bike, Map, Users, Shield, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-biker.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <div className="flex justify-center mb-6">
            <Bike className="h-20 w-20 text-primary animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            Biker's Trip Planner
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground mb-8 max-w-2xl mx-auto">
            Plan, coordinate, and track your motorcycle adventures with ease
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button size="lg" onClick={() => navigate("/dashboard")} className="text-lg px-8">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8">
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Features Built for Riders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Map className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Route Planning</h3>
              <p className="text-muted-foreground">
                Plan your routes with precision and discover scenic paths
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Group Rides</h3>
              <p className="text-muted-foreground">
                Coordinate with fellow riders and share your adventures
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">SOS Safety</h3>
              <p className="text-muted-foreground">
                Emergency alerts and live location tracking for safety
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trip Analytics</h3>
              <p className="text-muted-foreground">
                Track your rides and review detailed trip summaries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Hit the Road?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of riders planning their next adventure
          </p>
          
          {!user && (
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
              Start Planning Now
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;