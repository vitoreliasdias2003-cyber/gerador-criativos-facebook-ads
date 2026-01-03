import React from "react";
import { cn } from "@/lib/utils";

interface DashboardLayoutPremiumProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function DashboardLayoutPremium({
  children,
  header,
  sidebar,
  footer,
}: DashboardLayoutPremiumProps) {
  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      {header && (
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-sm shadow-sm animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            {header}
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebar && (
          <aside className="hidden lg:flex w-64 border-r border-border/50 bg-card/50 overflow-y-auto animate-slide-in-left">
            {sidebar}
          </aside>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm animate-slide-in-right">
          <div className="container mx-auto px-4 py-6">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}
