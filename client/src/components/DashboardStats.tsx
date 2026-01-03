import React from "react";
import { TrendingUp, FileText, Zap, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color: string;
}

interface DashboardStatsProps {
  className?: string;
  totalCreatives?: number;
  creditsAvailable?: number;
  currentPlan?: string;
}

export default function DashboardStats({
  className,
  totalCreatives = 0,
  creditsAvailable = 100,
  currentPlan = "Free",
}: DashboardStatsProps) {
  const stats: StatCard[] = [
    {
      title: "Criativos Gerados",
      value: totalCreatives,
      icon: FileText,
      trend: "+12% este mês",
      trendUp: true,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Créditos Disponíveis",
      value: creditsAvailable,
      icon: Zap,
      trend: "Renova em 15 dias",
      trendUp: false,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Plano Atual",
      value: currentPlan,
      icon: Crown,
      trend: "Upgrade disponível",
      trendUp: true,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="relative overflow-hidden group hover:shadow-xl hover:border-primary/30 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Gradient */}
            <div
              className={cn(
                "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-2xl",
                stat.color
              )}
            />

            <CardContent className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </h3>
                  {stat.trend && (
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingUp
                        className={cn(
                          "w-3 h-3",
                          stat.trendUp
                            ? "text-green-500"
                            : "text-muted-foreground"
                        )}
                      />
                      <span
                        className={cn(
                          stat.trendUp
                            ? "text-green-500"
                            : "text-muted-foreground"
                        )}
                      >
                        {stat.trend}
                      </span>
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div
                  className={cn(
                    "p-3 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform duration-300",
                    stat.color
                  )}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
