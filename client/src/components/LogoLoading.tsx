import React from "react";
import { cn } from "@/lib/utils";
import ForgeAdsLogo from "./ForgeAdsLogo";

interface LogoLoadingProps {
  className?: string;
  message?: string;
}

export default function LogoLoading({ className, message }: LogoLoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-8", className)}>
      <div className="relative">
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 bg-primary/30 blur-[100px] rounded-full animate-pulse" />
        
        {/* Rotating Border */}
        <div className="absolute -inset-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin-slow" />
        
        {/* Logo with Pulse */}
        <div className="relative animate-bounce-slow">
          <ForgeAdsLogo size={80} showText={false} />
        </div>
      </div>
      
      {message && (
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white tracking-tight">{message}</h3>
          <div className="flex items-center justify-center gap-1">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold pt-2">
            Precisão • Performance • Automação
          </p>
        </div>
      )}
    </div>
  );
}
