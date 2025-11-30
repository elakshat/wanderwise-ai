import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChatSidebar } from "@/components/ChatSidebar";
import { BackToTop } from "@/components/BackToTop";
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
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Hotel, CalendarIcon, Users, MapPin, Star, Wifi, Coffee, Car, Waves, IndianRupee, ShoppingCart } from "lucide-react";
import { mockHotels } from "@/data/mockData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

const HotelBooking = () => {
  const { addToCart } = useCart();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("2");
  const [rooms, setRooms] = useState("1");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [filters, setFilters] = useState({
    wifi: false,
    breakfast: false,
    pool: false,
    parking: false,
    ac: false,
  });
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("price");

  const handleSearch = () => {
    if (!location || !checkIn || !checkOut) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(checkIn).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      toast.error("Past dates are not allowed");
      return;
    }

    if (new Date(checkOut).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      toast.error("Past dates are not allowed");
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
                      <Calendar 
                        mode="single" 
                        selected={checkIn} 
                        onSelect={setCheckIn} 
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus 
                      />
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
                      <Calendar 
                        mode="single" 
                        selected={checkOut} 
                        onSelect={setCheckOut} 
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus 
                      />
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
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Available Hotels</h2>
              <Badge variant="secondary">{searchResults.length} properties found</Badge>
            </div>

            {/* Filters & Sort */}
            <Card className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-3">
                  <Label className="font-semibold">Amenities</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="wifi"
                        checked={filters.wifi}
                        onCheckedChange={(checked) => setFilters({ ...filters, wifi: !!checked })}
                      />
                      <Label htmlFor="wifi" className="cursor-pointer text-sm">Free WiFi</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="breakfast"
                        checked={filters.breakfast}
                        onCheckedChange={(checked) => setFilters({ ...filters, breakfast: !!checked })}
                      />
                      <Label htmlFor="breakfast" className="cursor-pointer text-sm">Breakfast</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="pool"
                        checked={filters.pool}
                        onCheckedChange={(checked) => setFilters({ ...filters, pool: !!checked })}
                      />
                      <Label htmlFor="pool" className="cursor-pointer text-sm">Pool</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="ac"
                        checked={filters.ac}
                        onCheckedChange={(checked) => setFilters({ ...filters, ac: !!checked })}
                      />
                      <Label htmlFor="ac" className="cursor-pointer text-sm">Air Conditioning</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold">Price Range (per night)</Label>
                  <div className="pt-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={50000}
                      step={1000}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="sortBy" className="font-semibold">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sortBy">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setFilters({ wifi: false, breakfast: false, pool: false, parking: false, ac: false });
                      setPriceRange([0, 50000]);
                      setSortBy("price");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>

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
                              <IndianRupee className="h-6 w-6" />
                              {hotel.price}
                            </p>
                            <p className="text-xs text-muted-foreground">per night</p>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => handleBookHotel(hotel)} size="lg" className="flex-1">
                              Book Now
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                addToCart({
                                  type: "hotel",
                                  data: {
                                    name: hotel.name,
                                    location: hotel.location,
                                    checkIn: checkIn ? format(checkIn, "PPP") : "",
                                    checkOut: checkOut ? format(checkOut, "PPP") : "",
                                    rooms,
                                  },
                                  price: hotel.price,
                                })
                              }
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          </div>
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

      <Footer />
      <ChatSidebar />
      <BackToTop />
    </div>
  );
};

export default HotelBooking;
