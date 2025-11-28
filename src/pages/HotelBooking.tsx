import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Hotel, CalendarIcon, Users, MapPin, Star, Wifi, Coffee, Car, Waves, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const HotelBooking = () => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("2");
  const [rooms, setRooms] = useState("1");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const mockHotels = [
    {
      id: 1,
      name: "Taj Palace Hotel",
      location: "Mumbai, India",
      rating: 4.8,
      reviews: 1250,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      price: 12500,
      amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Parking"],
      description: "Luxury hotel with ocean views",
    },
    {
      id: 2,
      name: "Oberoi Grand",
      location: "Kolkata, India",
      rating: 4.7,
      reviews: 980,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
      price: 9800,
      amenities: ["Free WiFi", "Breakfast", "Gym", "Restaurant"],
      description: "Heritage property in the heart of the city",
    },
    {
      id: 3,
      name: "Leela Palace",
      location: "Bangalore, India",
      rating: 4.9,
      reviews: 1450,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
      price: 15200,
      amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Parking", "Bar"],
      description: "Premium luxury with world-class amenities",
    },
  ];

  const handleSearch = () => {
    if (!location || !checkIn || !checkOut) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSearching(true);
    setTimeout(() => {
      setSearchResults(mockHotels);
      setSearching(false);
      toast.success("Found 3 hotels matching your criteria!");
    }, 1500);
  };

  const handleBookHotel = (hotel: any) => {
    toast.success(`${hotel.name} added to cart!`);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "free wifi":
        return <Wifi className="h-4 w-4" />;
      case "breakfast":
        return <Coffee className="h-4 w-4" />;
      case "parking":
        return <Car className="h-4 w-4" />;
      case "pool":
        return <Waves className="h-4 w-4" />;
      default:
        return <Hotel className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Book Your Hotel</h1>
          <p className="text-muted-foreground">Find the perfect accommodation for your stay</p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-medium mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="h-5 w-5 text-primary" />
                Hotel Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City, hotel, or landmark"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkIn && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Check-out Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOut && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Guests & Rooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guests">Guests</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger id="guests">
                      <Users className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rooms">Rooms</Label>
                  <Select value={rooms} onValueChange={setRooms}>
                    <SelectTrigger id="rooms">
                      <Hotel className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Room" : "Rooms"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSearch} disabled={searching} className="w-full" size="lg">
                {searching ? "Searching..." : "Search Hotels"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Available Hotels</h2>
              <Badge variant="secondary">{searchResults.length} properties found</Badge>
            </div>

            {searchResults.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-large transition-shadow overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    {/* Hotel Image */}
                    <div className="relative h-64 md:h-auto">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-white text-primary">
                        {hotel.rating} ★
                      </Badge>
                    </div>

                    {/* Hotel Info */}
                    <CardContent className="md:col-span-2 p-6">
                      <div className="flex flex-col h-full justify-between">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-2xl font-bold mb-1">{hotel.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{hotel.location}</span>
                              <Separator orientation="vertical" className="h-4" />
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-gold-accent text-gold-accent" />
                                <span>{hotel.rating} ({hotel.reviews} reviews)</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-muted-foreground">{hotel.description}</p>

                          {/* Amenities */}
                          <div className="flex flex-wrap gap-2">
                            {hotel.amenities.map((amenity, i) => (
                              <Badge key={i} variant="outline" className="flex items-center gap-1">
                                {getAmenityIcon(amenity)}
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Price & Book */}
                        <div className="flex items-end justify-between mt-4 pt-4 border-t">
                          <div>
                            <p className="text-sm text-muted-foreground">Starting from</p>
                            <p className="text-3xl font-bold text-primary flex items-center">
                              <DollarSign className="h-6 w-6" />
                              {hotel.price}
                            </p>
                            <p className="text-xs text-muted-foreground">per night</p>
                          </div>
                          <Button onClick={() => handleBookHotel(hotel)} size="lg">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <ChatSidebar />
    </div>
  );
};

export default HotelBooking;
