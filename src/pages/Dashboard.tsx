import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { DestinationCard } from "@/components/DestinationCard";
import { BackToTop } from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Search, MapPin, Plane, Hotel, Car, TrendingUp } from "lucide-react";
import { popularIndianCities } from "@/data/mockData";
import heroImage from "@/assets/hero-bg.jpg";

const Dashboard = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    loadDestinations();
  };

  const loadDestinations = async () => {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .order("rating", { ascending: false })
      .limit(12);

    if (error) {
      console.error("Error loading destinations:", error);
      toast.error("Failed to load destinations");
    } else {
      setDestinations(data || []);
    }
    setLoading(false);
  };

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || dest.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={heroImage}
          alt="Travel Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Your Journey Starts Here
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Discover India's most beautiful destinations with TravelMate
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button
                size="lg"
                onClick={() => navigate("/flights")}
                className="gap-2"
              >
                <Plane className="h-5 w-5" />
                Book Flights
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/hotels")}
                className="gap-2"
              >
                <Hotel className="h-5 w-5" />
                Book Hotels
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/cabs")}
                className="gap-2 bg-white/10 backdrop-blur text-white border-white/20 hover:bg-white/20"
              >
                <Car className="h-5 w-5" />
                Book Cabs
              </Button>
            </div>

            {/* Search Bar */}
            <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur shadow-2xl">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search destinations, cities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="md:w-48 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="beach">Beach</SelectItem>
                      <SelectItem value="mountain">Mountain</SelectItem>
                      <SelectItem value="heritage">Heritage</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="lg" className="gap-2 h-12">
                    <Search className="h-5 w-5" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Popular Cities Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Popular Destinations in India</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Explore the most sought-after cities and destinations across India
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {popularIndianCities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-large transition-all duration-300 group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                    <p className="text-white/80 text-sm">{city.state}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {city.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trending Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Trending Destinations</h2>
              <p className="text-muted-foreground">
                Handpicked destinations based on ratings and popularity
              </p>
            </div>
            {filteredDestinations.length > 0 && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {filteredDestinations.length} destinations
              </Badge>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination, index) => (
              <DestinationCard key={destination.id} destination={destination} index={index} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-xl text-muted-foreground">
              No destinations found. Try adjusting your search.
            </p>
          </Card>
        )}
      </div>

      <ChatSidebar />
      <BackToTop />
    </div>
  );
};

export default Dashboard;
