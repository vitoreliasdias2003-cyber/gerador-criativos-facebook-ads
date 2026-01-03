import React, { useState } from "react";
import { cn } from "@/lib/utils";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutPremiumProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  showDefaultHeader?: boolean;
  showDefaultSidebar?: boolean;
  userName?: string;
  userPlan?: "Free" | "Pro" | "Premium";
  activeNavItem?: string;
  onNavigate?: (item: string) => void;
}

export default function DashboardLayoutPremium({
  children,
  header,
  sidebar,
  footer,
  showDefaultHeader = true,
  showDefaultSidebar = true,
  userName,
  userPlan,
  activeNavItem,
  onNavigate,
}: DashboardLayoutPremiumProps) {
  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Fixo */}
      {(showDefaultHeader || header) && (
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl shadow-sm">
          <div className="container mx-auto px-6 py-4">
            {header || (
              <DashboardHeader userName={userName} userPlan={userPlan} />
            )}
          </div>
        </header>
      )}

      {/* Main Layout com Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Lateral */}
        {(showDefaultSidebar || sidebar) && (
          <div className="hidden lg:block">
            {sidebar || (
              <DashboardSidebar
                activeItem={activeNavItem}
                onNavigate={onNavigate}
              />
            )}
          </div>
        )}

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-card/20">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-6">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}
