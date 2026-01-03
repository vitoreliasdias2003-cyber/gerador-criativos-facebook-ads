import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderPremiumProps {
  title?: string;
  subtitle?: string;
  className?: string;
  showLogo?: boolean;
}

export default function HeaderPremium({
  title = "ForgeAds",
  subtitle = "Produção profissional de anúncios",
  className,
  showLogo = true,
}: HeaderPremiumProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-3">
        {showLogo && (
          <div className="relative group">
            <img 
              src="/assets/forgeads-logo.png" 
              alt="ForgeAds Logo" 
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
