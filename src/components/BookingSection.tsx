import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hotel, UtensilsCrossed, Star, MapPin } from "lucide-react";

interface BookingSectionProps {
  location: string;
}

// Mock data for hotels and restaurants
const mockHotels = [
  { id: 1, name: "Mountain View Inn", price: 89, rating: 4.5, distance: "2.3 km" },
  { id: 2, name: "Highway Rest Lodge", price: 65, rating: 4.2, distance: "5.1 km" },
  { id: 3, name: "Biker's Paradise Hotel", price: 120, rating: 4.8, distance: "1.8 km" },
];

const mockRestaurants = [
  { id: 1, name: "Road House Grill", cuisine: "American", rating: 4.6, distance: "0.8 km" },
  { id: 2, name: "Mountain Cafe", cuisine: "Local", rating: 4.3, distance: "1.2 km" },
  { id: 3, name: "Biker's Diner", cuisine: "Comfort Food", rating: 4.7, distance: "2.5 km" },
];

const BookingSection = ({ location }: BookingSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Hotels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hotel className="h-5 w-5 text-primary" />
            Nearby Hotels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockHotels.map((hotel) => (
            <div key={hotel.id} className="p-3 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{hotel.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{hotel.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{hotel.distance}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">${hotel.price}/night</Badge>
              </div>
              <Button size="sm" variant="outline" className="w-full">
                View Details
              </Button>
            </div>
          ))}
          <p className="text-xs text-center text-muted-foreground mt-4">
            Mock data • Real booking integration coming soon
          </p>
        </CardContent>
      </Card>

      {/* Restaurants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-secondary" />
            Nearby Restaurants
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="p-3 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{restaurant.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {restaurant.cuisine}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{restaurant.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {restaurant.distance}
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full">
                View Menu
              </Button>
            </div>
          ))}
          <p className="text-xs text-center text-muted-foreground mt-4">
            Mock data • Real restaurant integration coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSection;