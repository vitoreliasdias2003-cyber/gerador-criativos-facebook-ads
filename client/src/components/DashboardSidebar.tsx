import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Sparkles,
  Wand2,
  Library,
  History,
  CreditCard,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  badgeVariant?: "default" | "premium" | "new";
  onClick?: () => void;
}

interface DashboardSidebarProps {
  className?: string;
  activeItem?: string;
  onNavigate?: (item: string) => void;
}

export default function DashboardSidebar({
  className,
  activeItem = "dashboard",
  onNavigate,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location] = useLocation();

  const navItems: NavItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: Wand2,
      label: "Criativos",
      href: "/criativos",
    },
    {
      icon: Sparkles,
      label: "Copys",
      href: "/copys",
      badge: "Premium",
      badgeVariant: "premium",
    },
    {
      icon: Library,
      label: "Biblioteca de Anúncios",
      href: "https://www.facebook.com/ads/library/?active_status=active&ad_type=political_and_issue_ads&country=BR&is_targeted_country=false&media_type=all",
    },
    {
      icon: History,
      label: "Histórico",
      href: "/historico",
    },
    {
      icon: CreditCard,
      label: "Plano & Pagamento",
      href: "/plano",
    },
    {
      icon: HelpCircle,
      label: "Suporte",
      href: "/suporte",
    },
  ];

  const getBadgeStyle = (variant?: string) => {
    switch (variant) {
      case "premium":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-1.5 py-0.5";
      case "new":
        return "bg-green-500 text-white text-[10px] px-1.5 py-0.5";
      default:
        return "bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5";
    }
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 flex items-center justify-center w-6 h-6 bg-card border border-border rounded-full shadow-lg hover:bg-accent/10 transition-colors duration-200"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          const isExternal = item.href.startsWith("http");

          const content = (
            <div
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent-foreground"
              )}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sidebar-accent rounded-r-full" />
              )}

              {/* Icon */}
              <Icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                  isActive
                    ? "text-sidebar-accent-foreground"
                    : "text-muted-foreground group-hover:text-sidebar-accent-foreground group-hover:scale-110"
                )}
              />

              {/* Label */}
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge
                      className={cn(
                        "ml-2 flex-shrink-0",
                        getBadgeStyle(item.badgeVariant)
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                  {item.label}
                  {item.badge && (
                    <span className="ml-1 text-[10px] text-accent">
                      ({item.badge})
                    </span>
                  )}
                </div>
              )}
            </div>
          );

          return isExternal ? (
            <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" className="block">
              {content}
            </a>
          ) : (
            <Link key={index} href={item.href} onClick={item.onClick}>
              {content}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <p className="text-xs font-medium text-foreground mb-1">
              ForgeAds
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Produção profissional de anúncios para o seu negócio.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
