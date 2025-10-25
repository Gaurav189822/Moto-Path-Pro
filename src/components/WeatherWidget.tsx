import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind, Droplets } from "lucide-react";

interface WeatherWidgetProps {
  location: string;
}

// Mock weather data - in production, integrate with weather API
const WeatherWidget = ({ location }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState({
    temp: 24,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    icon: "cloud",
  });

  useEffect(() => {
    // Simulate weather data fetch
    const mockConditions = [
      { temp: 24, condition: "Partly Cloudy", humidity: 65, windSpeed: 12, icon: "cloud" },
      { temp: 28, condition: "Sunny", humidity: 45, windSpeed: 8, icon: "sun" },
      { temp: 18, condition: "Rainy", humidity: 85, windSpeed: 18, icon: "rain" },
    ];
    
    const randomWeather = mockConditions[Math.floor(Math.random() * mockConditions.length)];
    setWeather(randomWeather);
  }, [location]);

  const WeatherIcon = () => {
    switch (weather.icon) {
      case "sun":
        return <Sun className="h-12 w-12 text-yellow-500" />;
      case "rain":
        return <CloudRain className="h-12 w-12 text-blue-500" />;
      default:
        return <Cloud className="h-12 w-12 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weather Forecast</CardTitle>
        <p className="text-sm text-muted-foreground">{location}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <WeatherIcon />
            <div>
              <p className="text-4xl font-bold">{weather.temp}°C</p>
              <p className="text-sm text-muted-foreground">{weather.condition}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-semibold">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="font-semibold">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Mock data • Weather API integration coming soon
        </p>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;