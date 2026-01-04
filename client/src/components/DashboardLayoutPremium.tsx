import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Zap, 
  Wand2, 
  Sparkles, 
  History, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  ShieldCheck,
  Settings,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashboardLayoutPremiumProps {
  children: React.ReactNode;
  userName?: string;
  userPlan?: string;
}

export default function DashboardLayoutPremium({
  children,
  userName = "Vitor Elias",
  userPlan = "Premium",
}: DashboardLayoutPremiumProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "automatico", label: "Automação Premium", icon: Zap, href: "/automatico", premium: true },
    { id: "criativos", label: "Creative Engine", icon: Wand2, href: "/criativos" },
    { id: "copys", label: "Copy Engine", icon: Sparkles, href: "/copys" },
    { id: "historico", label: "Histórico", icon: History, href: "/historico" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 bg-[#0A0A0A] z-30">
        <div className="p-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter">ForgeAds</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Premium AI</p>
            </div>
          </motion.div>

          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={item.href}>
                  <a className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative",
                    location === item.href 
                      ? "bg-white/5 text-white" 
                      : "text-muted-foreground hover:text-white hover:bg-white/[0.02]"
                  )}>
                    {location === item.href && (
                      <motion.div 
                        layoutId="activeNav"
                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                      />
                    )}
                    <div className="flex items-center gap-3">
                      <item.icon className={cn(
                        "w-5 h-5 transition-colors",
                        location === item.href ? "text-primary" : "group-hover:text-white"
                      )} />
                      <span className="font-semibold text-sm">{item.label}</span>
                    </div>
                    {item.premium && (
                      <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black tracking-wider">PRO</span>
                    )}
                  </a>
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                {userName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{userName}</p>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest">{userPlan}</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full text-xs h-9 rounded-xl bg-white/5 hover:bg-white/10 border-none">
              <Settings className="w-3.5 h-3.5 mr-2" />
              Configurações
            </Button>
          </motion.div>
          
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] text-muted-foreground font-medium">v2.4.0 Stable</p>
            <button className="text-muted-foreground hover:text-destructive transition-colors p-2">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          <span className="font-black tracking-tighter text-lg">ForgeAds</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="rounded-xl bg-white/5">
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 bg-background z-30 pt-24 px-6"
          >
            <nav className="space-y-3">
              {navItems.map((item) => (
                <Link key={item.id} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <a className={cn(
                    "flex items-center justify-between p-5 rounded-2xl border border-white/5",
                    location === item.href ? "bg-primary/10 border-primary/20 text-white" : "bg-white/[0.02] text-muted-foreground"
                  )}>
                    <div className="flex items-center gap-4">
                      <item.icon className={cn("w-6 h-6", location === item.href ? "text-primary" : "")} />
                      <span className="text-lg font-bold">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-30" />
                  </a>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 relative">
        {/* Top Bar Desktop */}
        <header className="hidden lg:flex h-20 items-center justify-between px-12 border-b border-white/5 sticky top-0 bg-background/50 backdrop-blur-md z-20">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span>ForgeAds</span>
            <ChevronRight className="w-4 h-4 opacity-30" />
            <span className="text-white capitalize">{location.replace('/', '') || 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </Button>
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="text-xs font-bold">{userName}</p>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest">Créditos: 250</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
