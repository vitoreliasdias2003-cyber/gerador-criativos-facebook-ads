import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Wand2, TrendingUp, ArrowRight } from "lucide-react";
import DashboardLayoutPremium from "@/components/DashboardLayoutPremium";
import DashboardStats from "@/components/DashboardStats";
import RecentCreatives from "@/components/RecentCreatives";
import AdReportDialog from "@/components/AdReportDialog";
import { toast } from "sonner";

export default function Dashboard() {
  const handleNavigate = (item: string) => {
    toast.info(`Navegando para: ${item}`);
    // Aqui você pode implementar a navegação real com wouter
  };

  const handleCopyCreative = (creative: any) => {
    toast.success("Criativo copiado!");
  };

  const handleGenerateImage = (creative: any) => {
    toast.info("Gerando imagem...");
  };

  const handleDuplicate = (creative: any) => {
    toast.success("Criativo duplicado!");
  };

  return (
    <DashboardLayoutPremium
      userName="Vitor Elias"
      userPlan="Premium"
      activeNavItem="dashboard"
      onNavigate={handleNavigate}
    >
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Painel de Controle ForgeAds
        </h2>
        <p className="text-muted-foreground">
          Gerencie sua produção profissional de anúncios e acompanhe seus resultados.
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats
        totalCreatives={47}
        creditsAvailable={250}
        currentPlan="Premium"
        className="mb-8"
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
        {/* Criar Criativo */}
        <Card className="group hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-2xl" />
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg">Criar Novo Criativo</CardTitle>
            </div>
            <CardDescription>
              Gere criativos profissionais em segundos com IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/criar-criativo">
              <Button className="w-full group-hover:shadow-lg transition-shadow">
                Começar Agora
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Modo Automático */}
        <Card className="group hover:shadow-xl hover:border-accent/30 transition-all duration-300 cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-2xl" />
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Modo Automático</CardTitle>
                <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-semibold">
                  PREMIUM
                </span>
              </div>
            </div>
            <CardDescription>
              Gere criativos a partir de links ou arquivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/criar-criativo?mode=automatic">
              <Button variant="secondary" className="w-full group-hover:shadow-lg transition-shadow">
                Usar Modo Automático
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Creatives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="lg:col-span-2">
          <RecentCreatives
            onCopy={handleCopyCreative}
            onGenerateImage={handleGenerateImage}
            onDuplicate={handleDuplicate}
          />
        </div>

        {/* Performance Card */}
        <Card className="animate-fade-in" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Taxa de Conversão</span>
                <span className="text-lg font-bold text-green-500">+24%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: "75%" }} />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Engajamento</span>
                <span className="text-lg font-bold text-blue-500">+18%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: "60%" }} />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">CTR Médio</span>
                <span className="text-lg font-bold text-purple-500">3.8%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: "85%" }} />
              </div>
            </div>

            <AdReportDialog>
              <Button variant="outline" className="w-full mt-4">
                Ver Relatório Completo
              </Button>
            </AdReportDialog>
          </CardContent>
        </Card>
      </div>
    </DashboardLayoutPremium>
  );
}
