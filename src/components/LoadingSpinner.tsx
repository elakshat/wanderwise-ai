import { motion } from "framer-motion";
import { Plane } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-12">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Plane className="h-8 w-8 text-primary" />
      </motion.div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 animate-pulse">
      <div className="h-48 bg-muted rounded-lg mb-4" />
      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
      <div className="h-4 bg-muted rounded w-1/2 mb-4" />
      <div className="flex gap-2">
        <div className="h-8 bg-muted rounded w-20" />
        <div className="h-8 bg-muted rounded w-20" />
      </div>
    </div>
  );
};
