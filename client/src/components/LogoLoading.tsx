import React from "react";
import { cn } from "@/lib/utils";

interface LogoLoadingProps {
  className?: string;
  message?: string;
}

export default function LogoLoading({ className, message }: LogoLoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-6", className)}>
      <div className="relative">
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
        
        {/* Rotating Border */}
        <div className="absolute -inset-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        
        {/* Logo Image with Pulse */}
        <div className="relative bg-background p-4 rounded-full border border-white/10 shadow-2xl animate-bounce-slow">
          <img 
            src="/assets/forgeads-logo.png" 
            alt="ForgeAds Loading" 
            className="h-16 w-16 object-contain"
          />
        </div>
      </div>
      
      {message && (
        <div className="text-center">
          <h3 className="text-xl font-bold text-white animate-pulse">{message}</h3>
          <p className="text-sm text-muted-foreground mt-1">Forjando resultados de alta performance...</p>
        </div>
      )}
    </div>
  );
}
