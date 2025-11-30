import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Plane, Hotel, Car, Trash2, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export const CartDrawer = () => {
  const { items, removeFromCart, clearCart, totalPrice, itemCount } = useCart();

  const getIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="h-4 w-4" />;
      case "hotel":
        return <Hotel className="h-4 w-4" />;
      case "cab":
        return <Car className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleCheckout = () => {
    // Navigate to checkout or process bookings
    alert("Proceeding to checkout...");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getIcon(item.type)}
                      <span className="font-medium capitalize">{item.type}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {item.type === "flight" && (
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{item.data.airline}</p>
                      <p className="text-muted-foreground">
                        {item.data.from} → {item.data.to}
                      </p>
                      <p className="text-muted-foreground">{item.data.date}</p>
                    </div>
                  )}

                  {item.type === "hotel" && (
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{item.data.name}</p>
                      <p className="text-muted-foreground">{item.data.location}</p>
                      <p className="text-muted-foreground">
                        {item.data.checkIn} - {item.data.checkOut}
                      </p>
                    </div>
                  )}

                  {item.type === "cab" && (
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{item.data.type}</p>
                      <p className="text-muted-foreground">
                        {item.data.pickup} → {item.data.drop}
                      </p>
                      <p className="text-muted-foreground">{item.data.date}</p>
                    </div>
                  )}

                  <div className="mt-2 text-right">
                    <span className="font-semibold text-primary">₹{item.price.toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}

              <Separator />

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
              </div>

              <div className="space-y-2 pt-4">
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
                <Button variant="outline" className="w-full" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
