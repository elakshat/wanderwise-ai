import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ChatSidebar } from "@/components/ChatSidebar";
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
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plane, CalendarIcon, Users, MapPin, Clock, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const FlightBooking = () => {
  const [tripType, setTripType] = useState("roundtrip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState("1");
  const [classType, setClassType] = useState("economy");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const mockFlights = [
    {
      id: 1,
      airline: "Air India",
      flightNumber: "AI202",
      departure: "09:30 AM",
      arrival: "11:45 AM",
      duration: "2h 15m",
      stops: "Non-stop",
      price: 4500,
      class: "Economy",
    },
    {
      id: 2,
      airline: "IndiGo",
      flightNumber: "6E456",
      departure: "02:15 PM",
      arrival: "04:30 PM",
      duration: "2h 15m",
      stops: "Non-stop",
      price: 3800,
      class: "Economy",
    },
    {
      id: 3,
      airline: "Vistara",
      flightNumber: "UK789",
      departure: "06:00 PM",
      arrival: "08:20 PM",
      duration: "2h 20m",
      stops: "Non-stop",
      price: 5200,
      class: "Economy",
    },
  ];

  const handleSearch = () => {
    if (!from || !to || !departDate) {
      toast.error("Please fill in all required fields");
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
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="from"
                      placeholder="Delhi (DEL)"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="to"
                      placeholder="Mumbai (BOM)"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="pl-10"
                    />
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
                      <Calendar mode="single" selected={departDate} onSelect={setDepartDate} initialFocus />
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
                        <Calendar mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus />
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
            <h2 className="text-2xl font-bold mb-4">Available Flights</h2>

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
                            <DollarSign className="h-6 w-6" />
                            {flight.price}
                          </p>
                          <p className="text-xs text-muted-foreground">per person</p>
                        </div>
                        <Button onClick={() => handleBookFlight(flight)} className="w-full">
                          Select Flight
                        </Button>
                      </div>
                    </div>
                  </CardContent>
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

export default FlightBooking;
