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
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-700 rounded-lg blur-lg opacity-50 animate-pulse-glow" />
            <div className="relative bg-gradient-to-br from-primary to-blue-700 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
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
