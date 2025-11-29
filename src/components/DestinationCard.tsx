import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

interface Destination {
  id: string;
  name: string;
  country: string;
  city: string;
  description: string;
  category: string;
  price_range: string;
  image_url: string;
  rating: number;
  tags: string[];
}

interface DestinationCardProps {
  destination: Destination;
  index: number;
}

export const DestinationCard = ({ destination, index }: DestinationCardProps) => {
  const getPriceRange = (range: string) => {
    switch (range) {
      case "budget":
        return "₹2,000 - ₹5,000";
      case "moderate":
        return "₹5,000 - ₹15,000";
      case "luxury":
        return "₹15,000 - ₹30,000";
      case "premium":
        return "₹30,000+";
      default:
        return "₹5,000 - ₹15,000";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-large transition-shadow duration-300 group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={destination.image_url}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-3 right-3 bg-white/90 text-primary">
            {destination.category}
          </Badge>
        </div>

        <CardContent className="p-4">
          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            <span>{destination.city}, {destination.country}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">{destination.name}</h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {destination.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {destination.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-gold-accent text-gold-accent" />
                <span className="font-semibold">{destination.rating}</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <IndianRupee className="h-4 w-4" />
                <span className="font-medium text-xs">{getPriceRange(destination.price_range)}</span>
              </div>
            </div>

            <Button size="sm" variant="default">
              Explore
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
