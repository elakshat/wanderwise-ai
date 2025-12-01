import { Card, CardContent } from "./ui/card";
import { Cloud, Sun, CloudRain } from "lucide-react";

export const WeatherWidget = ({ city = "Mumbai" }: { city?: string }) => {
  // Mock weather data - in real app, fetch from weather API
  const weather = {
    temp: 28,
    condition: "Partly Cloudy",
    icon: Cloud,
    humidity: 65,
    wind: 12,
  };

  const WeatherIcon = weather.icon;

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">{city}</p>
            <h3 className="text-4xl font-bold">{weather.temp}°C</h3>
            <p className="text-sm opacity-90">{weather.condition}</p>
          </div>
          <WeatherIcon className="h-16 w-16 opacity-80" />
        </div>
        <div className="flex gap-4 mt-4 text-xs">
          <span>Humidity: {weather.humidity}%</span>
          <span>Wind: {weather.wind} km/h</span>
        </div>
      </CardContent>
    </Card>
  );
};
