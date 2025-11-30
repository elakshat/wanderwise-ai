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
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Car, CalendarIcon, MapPin, Users, Clock, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockCabs } from "@/data/mockData";

const CabBooking = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("09:00");
  const [cabType, setCabType] = useState("sedan");
  const [passengers, setPassengers] = useState("2");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    if (!pickup || !drop || !pickupDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(pickupDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      toast.error("Past dates are not allowed");
      return;
    }

    setSearching(true);
    setTimeout(() => {
      const filtered = cabType === "all" 
        ? mockCabs 
        : mockCabs.filter(cab => cab.type.toLowerCase() === cabType);
      setSearchResults(filtered);
      setSearching(false);
      toast.success(`Found ${filtered.length} cabs available!`);
    }, 1500);
  };

  const handleBookCab = (cab: any) => {
    toast.success(`${cab.type} cab booking initiated!`);
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
          <h1 className="text-4xl font-bold mb-2">Book a Cab</h1>
          <p className="text-muted-foreground">Convenient and affordable rides across India</p>
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
                <Car className="h-5 w-5 text-primary" />
                Cab Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pickup & Drop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup">Pickup Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pickup"
                      placeholder="Enter pickup location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drop">Drop Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="drop"
                      placeholder="Enter drop location"
                      value={drop}
                      onChange={(e) => setDrop(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pickup Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !pickupDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {pickupDate ? format(pickupDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar 
                        mode="single" 
                        selected={pickupDate} 
                        onSelect={setPickupDate} 
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus 
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Pickup Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="time"
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Cab Type & Passengers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cabType">Cab Type</Label>
                  <Select value={cabType} onValueChange={setCabType}>
                    <SelectTrigger id="cabType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cabs</SelectItem>
                      <SelectItem value="mini">Mini</SelectItem>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
              </div>

              <Button onClick={handleSearch} disabled={searching} className="w-full" size="lg">
                {searching ? "Searching..." : "Search Cabs"}
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
              <h2 className="text-2xl font-bold">Available Cabs</h2>
              <Badge variant="secondary">{searchResults.length} cabs found</Badge>
            </div>

            {searchResults.map((cab, index) => (
              <motion.div
                key={cab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-large transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Cab Image */}
                      <div className="relative h-32 rounded-lg overflow-hidden">
                        <img
                          src={cab.image}
                          alt={cab.type}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Cab Info */}
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold">{cab.type}</h3>
                            <Badge variant="secondary">{cab.capacity} seats</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{cab.model}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {cab.features.map((feature: string, i: number) => (
                            <Badge key={i} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {cab.estimatedTime} away
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {cab.distance}
                          </span>
                        </div>
                      </div>

                      {/* Price & Booking */}
                      <div className="flex flex-col items-end justify-between">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Estimated Fare</p>
                          <p className="text-3xl font-bold text-primary flex items-center justify-end">
                            <IndianRupee className="h-6 w-6" />
                            {cab.fare * 15}
                          </p>
                          <p className="text-xs text-muted-foreground">per km: ₹{cab.fare}</p>
                        </div>
                        <Button onClick={() => handleBookCab(cab)} size="lg" className="w-full">
                          Book Now
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

      <Footer />
      <ChatSidebar />
      <BackToTop />
    </div>
  );
};

export default CabBooking;
