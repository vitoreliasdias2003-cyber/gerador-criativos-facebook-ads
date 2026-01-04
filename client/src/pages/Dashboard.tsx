import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Zap, 
  Wand2, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  Clock,
  Plus,
  BarChart3,
  Layers
} from "lucide-react";
import DashboardLayoutPremium from "@/components/DashboardLayoutPremium";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const container: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  return (
    <DashboardLayoutPremium>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-12"
      >
        {/* Header Section */}
        <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-5xl font-black tracking-tighter leading-none">
              Overview
            </h2>
            <p className="text-muted-foreground text-lg font-medium">
              Bem-vindo à nova era da automação de anúncios.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/automatico">
              <Button className="h-12 px-6 rounded-xl font-bold bg-primary hover:brightness-110 shadow-lg shadow-primary/20 gap-2">
                <Plus className="w-5 h-5" />
                Novo Projeto
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Criativos Totais", value: "47", icon: Layers, color: "text-blue-500" },
            { label: "Créditos", value: "250", icon: Zap, color: "text-primary" },
            { label: "Taxa de Conversão", value: "+24%", icon: TrendingUp, color: "text-green-500" },
            { label: "CTR Médio", value: "3.8%", icon: BarChart3, color: "text-purple-500" },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <div className={stat.color}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Live</span>
              </div>
              <p className="text-3xl font-black tracking-tighter mb-1">{stat.value}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Automação Premium Card */}
          <motion.div variants={item} className="lg:col-span-2 group">
            <Link href="/automatico">
              <div className="relative h-full p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-blue-600/5 border border-primary/20 overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -mr-48 -mt-48 group-hover:bg-primary/20 transition-colors duration-500" />
                <div className="relative h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-2xl bg-primary shadow-xl shadow-primary/20">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black tracking-tighter">Automação Premium</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-black tracking-widest">NOVO MOTOR</span>
                          <span className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verificado
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-md leading-relaxed font-medium">
                      Análise real de links e documentos para forjar anúncios de alta conversão em segundos.
                    </p>
                  </div>
                  <div className="mt-12 flex items-center gap-3 text-primary font-black uppercase tracking-widest text-sm group-hover:gap-5 transition-all">
                    Começar agora <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Side Actions */}
          <div className="space-y-6">
            <motion.div variants={item}>
              <Link href="/criativos">
                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all duration-500 cursor-pointer group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                      <Wand2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-black tracking-tight">Creative Engine</h4>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    Gere visuais profissionais com IA de última geração.
                  </p>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={item}>
              <Link href="/copys">
                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all duration-500 cursor-pointer group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-black tracking-tight">Copy Engine</h4>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    ChatGPT especializado em copywriting de alta conversão.
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Recent Activity */}
        <motion.div variants={item} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Clock className="w-6 h-6 text-muted-foreground" />
              Atividade Recente
            </h3>
            <Link href="/historico">
              <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest hover:bg-white/5">Ver Tudo</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer group">
                <div className="aspect-video rounded-2xl bg-white/5 mb-4 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Visualizar</span>
                  </div>
                </div>
                <h5 className="font-bold mb-1">Projeto de Anúncio #{i}</h5>
                <p className="text-xs text-muted-foreground font-medium">Gerado há {i * 2} horas atrás</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayoutPremium>
  );
}
