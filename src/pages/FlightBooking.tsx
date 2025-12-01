import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChatSidebar } from "@/components/ChatSidebar";
import { BackToTop } from "@/components/BackToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plane, CalendarIcon, Users, MapPin, Clock, IndianRupee, ShoppingCart } from "lucide-react";
import { mockFlights } from "@/data/mockData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

const FlightBooking = () => {
  const { addToCart } = useCart();
  const [tripType, setTripType] = useState("roundtrip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState("1");
  const [classType, setClassType] = useState("economy");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [filters, setFilters] = useState({
    nonStop: false,
    refundable: false,
    wifi: false,
  });
  const [sortBy, setSortBy] = useState("price");

  const handleSearch = () => {
    if (!from || !to || !departDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(departDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      toast.error("Past dates are not allowed");
      return;
    }

    if (returnDate && new Date(returnDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      toast.error("Past dates are not allowed");
      return;
    }

    setSearching(true);
    setTimeout(() => {
      setSearchResults(mockFlights);
      setSearching(false);
      toast.success("Found 3 flights matching your criteria!");
    }, 1500);
  };

  const handleBookFlight = (flight: any) => {
    toast.success(`Flight ${flight.flightNumber} added to cart!`);
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
          <h1 className="text-4xl font-bold mb-2">Book Your Flight</h1>
          <p className="text-muted-foreground">Search and compare flights from top airlines</p>
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
                <Plane className="h-5 w-5 text-primary" />
                Flight Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trip Type */}
              <RadioGroup value={tripType} onValueChange={setTripType} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="roundtrip" id="roundtrip" />
                  <Label htmlFor="roundtrip">Round Trip</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oneway" id="oneway" />
                  <Label htmlFor="oneway">One Way</Label>
                </div>
              </RadioGroup>

              {/* Origin & Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      id="from"
                      placeholder="Search city..."
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="pl-10"
                      list="fromCities"
                    />
                    <datalist id="fromCities">
                      <option value="Delhi (DEL)" />
                      <option value="Mumbai (BOM)" />
                      <option value="Bangalore (BLR)" />
                      <option value="Chennai (MAA)" />
                      <option value="Kolkata (CCU)" />
                      <option value="Hyderabad (HYD)" />
                      <option value="Pune (PNQ)" />
                      <option value="Ahmedabad (AMD)" />
                      <option value="Jaipur (JAI)" />
                      <option value="Goa (GOI)" />
                    </datalist>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      id="to"
                      placeholder="Search city..."
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="pl-10"
                      list="toCities"
                    />
                    <datalist id="toCities">
                      <option value="Mumbai (BOM)" />
                      <option value="Delhi (DEL)" />
                      <option value="Bangalore (BLR)" />
                      <option value="Chennai (MAA)" />
                      <option value="Kolkata (CCU)" />
                      <option value="Hyderabad (HYD)" />
                      <option value="Pune (PNQ)" />
                      <option value="Ahmedabad (AMD)" />
                      <option value="Jaipur (JAI)" />
                      <option value="Goa (GOI)" />
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Departure Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !departDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {departDate ? format(departDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar 
                        mode="single" 
                        selected={departDate} 
                        onSelect={setDepartDate} 
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus 
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {tripType === "roundtrip" && (
                  <div className="space-y-2">
                    <Label>Return Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !returnDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {returnDate ? format(returnDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar 
                          mode="single" 
                          selected={returnDate} 
                          onSelect={setReturnDate} 
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus 
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              {/* Passengers & Class */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passengers">Passengers</Label>
                  <Select value={passengers} onValueChange={setPassengers}>
                    <SelectTrigger id="passengers">
                      <Users className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select value={classType} onValueChange={setClassType}>
                    <SelectTrigger id="class">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium-economy">Premium Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSearch} disabled={searching} className="w-full" size="lg">
                {searching ? "Searching..." : "Search Flights"}
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold">Available Flights</h2>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="nonStop"
                    checked={filters.nonStop}
                    onCheckedChange={(checked) => setFilters({ ...filters, nonStop: !!checked })}
                  />
                  <Label htmlFor="nonStop" className="cursor-pointer">Non-stop only</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="refundable"
                    checked={filters.refundable}
                    onCheckedChange={(checked) => setFilters({ ...filters, refundable: !!checked })}
                  />
                  <Label htmlFor="refundable" className="cursor-pointer">Refundable</Label>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="departure">Departure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {searchResults.map((flight, index) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-large transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      {/* Flight Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Plane className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{flight.airline}</h3>
                            <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                          </div>
                          <Badge variant="secondary">{flight.stops}</Badge>
                        </div>

                        <div className="flex items-center gap-8">
                          <div>
                            <p className="text-2xl font-bold">{flight.departure}</p>
                            <p className="text-sm text-muted-foreground">{from || "Delhi"}</p>
                          </div>

                          <div className="flex-1 flex flex-col items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                            <Separator className="w-full" />
                            <p className="text-sm text-muted-foreground mt-1">{flight.duration}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold">{flight.arrival}</p>
                            <p className="text-sm text-muted-foreground">{to || "Mumbai"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Price & Booking */}
                      <div className="flex flex-col items-end gap-3 md:border-l md:pl-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Starting from</p>
                          <p className="text-3xl font-bold text-primary flex items-center">
                            <IndianRupee className="h-6 w-6" />
                            {flight.price}
                          </p>
                          <p className="text-xs text-muted-foreground">per person</p>
                        </div>
                        <div className="flex gap-2 w-full">
                          <Button onClick={() => handleBookFlight(flight)} className="flex-1">
                            Book Now
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              addToCart({
                                type: "flight",
                                data: {
                                  airline: flight.airline,
                                  from: from || "Delhi",
                                  to: to || "Mumbai",
                                  date: departDate ? format(departDate, "PPP") : "",
                                  flightNumber: flight.flightNumber,
                                },
                                price: flight.price,
                              })
                            }
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
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

export default FlightBooking;
