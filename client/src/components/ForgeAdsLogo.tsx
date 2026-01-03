import React from "react";
import { cn } from "@/lib/utils";

interface ForgeAdsLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  showSlogan?: boolean;
  isDark?: boolean;
}

export default function ForgeAdsLogo({ 
  className, 
  size = 40, 
  showText = true, 
  showSlogan = true,
  isDark = true 
}: ForgeAdsLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Símbolo Minimalista: Uma bigorna estilizada fundida com um raio de performance */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_rgba(24,119,242,0.4)]"
      >
        <path 
          d="M20 30C20 24.4772 24.4772 20 30 20H70C75.5228 20 80 24.4772 80 30V35C80 40.5228 75.5228 45 70 45H60L45 80H35L45 45H30C24.4772 45 20 40.5228 20 35V30Z" 
          fill="url(#logo-gradient)"
        />
        <path 
          d="M45 45L35 80H45L60 45H45Z" 
          fill="white" 
          fillOpacity="0.2"
        />
        <defs>
          <linearGradient id="logo-gradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1877F2" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div className="flex flex-col border-l border-white/10 pl-3">
          <h1 className={cn(
            "text-xl font-extrabold tracking-tighter leading-none",
            isDark ? "text-white" : "text-slate-900"
          )}>
            Forge<span className="text-primary">Ads</span>
          </h1>
          {showSlogan && (
            <p className="text-[7px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">
              Precisão • Performance • Automação
            </p>
          )}
        </div>
      )}
    </div>
  );
}
