import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  type: "flight" | "hotel" | "cab";
  data: any;
  price: number;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id" | "addedAt">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("travelmate-cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("travelmate-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, "id" | "addedAt">) => {
    const newItem: CartItem = {
      ...item,
      id: `${item.type}-${Date.now()}-${Math.random()}`,
      addedAt: new Date(),
    };
    setItems((prev) => [...prev, newItem]);
    toast.success("Added to cart");
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Removed from cart");
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Cart cleared");
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, totalPrice, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
