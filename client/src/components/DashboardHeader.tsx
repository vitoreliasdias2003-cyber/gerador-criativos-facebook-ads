import React, { useState } from "react";
import { Sparkles, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  className?: string;
  userName?: string;
  userPlan?: "Free" | "Pro" | "Premium";
}

export default function DashboardHeader({
  className,
  userName = "Usuário",
  userPlan = "Free",
}: DashboardHeaderProps) {
  const getPlanColor = () => {
    switch (userPlan) {
      case "Premium":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "Pro":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {/* Logo e Nome do Produto */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-blue-700 rounded-lg blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          <div className="relative bg-gradient-to-br from-primary to-blue-700 p-2.5 rounded-lg shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            ForgeAds
          </h1>
          <p className="text-xs text-muted-foreground">
            Produção profissional de anúncios
          </p>
        </div>
      </div>

      {/* User Menu */}
      <div className="flex items-center gap-3">
        {/* Plan Badge */}
        <Badge
          className={cn(
            "px-3 py-1 text-xs font-semibold shadow-md",
            getPlanColor()
          )}
        >
          {userPlan}
        </Badge>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors duration-200 group">
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-blue-700 text-white text-sm font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground hidden md:block">
                {userName}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
