import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

export default function LoadingState({
  message = "Carregando...",
  size = "md",
  className,
  fullScreen = false,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center gap-4 p-8";

  return (
    <div className={cn(containerClasses, className)}>
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse" />
        
        {/* Spinner */}
        <Loader2 className={cn(
          "relative text-primary animate-spin",
          sizeClasses[size]
        )} />
      </div>
      
      {message && (
        <p className="text-muted-foreground text-center text-sm font-medium">
          {message}
        </p>
      )}
    </div>
  );
}
