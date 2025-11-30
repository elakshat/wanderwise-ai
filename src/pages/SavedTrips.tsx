import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChatSidebar } from "@/components/ChatSidebar";
import { BackToTop } from "@/components/BackToTop";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Heart, Trash2, MapPin, Calendar, DollarSign, Eye } from "lucide-react";

const SavedTrips = () => {
  const [savedTrips, setSavedTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedTrips();
  }, []);

  const loadSavedTrips = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("saved_trips")
      .select(`
        *,
        destinations (
          id,
          name,
          country,
          city,
          image_url,
          category,
          price_range,
          rating
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading saved trips:", error);
      toast.error("Failed to load saved trips");
    } else {
      setSavedTrips(data || []);
    }

    setLoading(false);
  };

  const handleDeleteTrip = async (tripId: string) => {
    const { error } = await supabase.from("saved_trips").delete().eq("id", tripId);

    if (error) {
      toast.error("Failed to delete trip");
    } else {
      toast.success("Trip removed from saved items");
      loadSavedTrips();
    }
  };

  const handleToggleFavorite = async (tripId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("saved_trips")
      .update({ is_favorite: !currentStatus })
      .eq("id", tripId);

    if (error) {
      toast.error("Failed to update favorite status");
    } else {
      toast.success(currentStatus ? "Removed from favorites" : "Added to favorites");
      loadSavedTrips();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            Your collection of bookings - flights, hotels, and cabs
          </p>
        </motion.div>

        {savedTrips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-medium">
              <CardContent className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-semibold mb-2">No saved trips yet</h2>
                <p className="text-muted-foreground mb-6">
                  Start exploring destinations and save your favorites!
                </p>
                <Button onClick={() => navigate("/")} size="lg">
                  Discover Destinations
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-large transition-shadow group">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={trip.destinations?.image_url}
                      alt={trip.destinations?.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Favorite Button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                      onClick={() => handleToggleFavorite(trip.id, trip.is_favorite)}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          trip.is_favorite
                            ? "fill-secondary text-secondary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>

                    {trip.destinations?.category && (
                      <Badge className="absolute top-3 left-3 bg-white/90 text-primary">
                        {trip.destinations.category}
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    {/* Location */}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {trip.destinations?.city}, {trip.destinations?.country}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                      {trip.destinations?.name}
                    </h3>

                    {/* Notes */}
                    {trip.notes && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {trip.notes}
                      </p>
                    )}

                    {/* Travel Dates */}
                    {trip.travel_dates && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>Planned travel dates</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="flex-1"
                        onClick={() => navigate(`/destination/${trip.destination_id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTrip(trip.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <ChatSidebar />
      <BackToTop />
    </div>
  );
};

export default SavedTrips;
