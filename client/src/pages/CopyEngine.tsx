import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, MessageSquare, Copy, Check, Send, BrainCircuit, Image as ImageIcon, ArrowRight } from "lucide-react";
import DashboardLayoutPremium from "@/components/DashboardLayoutPremium";
import LogoLoading from "@/components/LogoLoading";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function CopyEngine() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    headline: string;
    texto: string;
    cta: string;
    angulo: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    produto: "",
    publico: "",
    objetivo: "Vendas"
  });

  const handleGenerate = () => {
    if (!formData.produto || !formData.publico) {
      toast.error("Por favor, preencha o produto e o público-alvo.");
      return;
    }
    setLoading(true);
    
    // Simulação de resposta do ChatGPT com o prompt interno
    setTimeout(() => {
      setResult({
        headline: "A Solução Definitiva para Seu Negócio Escalar",
        texto: "Você já sentiu que seu negócio estagnou? Com o " + formData.produto + ", você terá acesso às melhores estratégias para atingir " + formData.publico + " de forma eficaz e lucrativa. Pare de perder tempo com métodos que não funcionam.",
        cta: "Quero Escalar Agora",
        angulo: "Dor e Solução: Foca na frustração da estagnação e apresenta o produto como a ponte para o sucesso."
      });
      setLoading(false);
      toast.success("Copy profissional gerada!");
    }, 2500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToImage = () => {
    if (!result) return;
    const params = new URLSearchParams({
      headline: result.headline,
      produto: formData.produto,
      publico: formData.publico
    });
    setLocation(`/criativos?${params.toString()}`);
    toast.info("Enviando para o Image Engine...");
  };

  return (
    <DashboardLayoutPremium>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-accent" />
            ForgeAds Copy Engine
          </h2>
          <p className="text-muted-foreground mt-2">
            Estrategista de anúncios e copywriter profissional alimentado por ChatGPT.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-accent/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Briefing da Copy</CardTitle>
                <CardDescription>O ChatGPT usará esses dados para criar sua estratégia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="produto">O que você está vendendo?</Label>
                  <Input 
                    id="produto" 
                    placeholder="Ex: Mentoria de Tráfego Pago" 
                    value={formData.produto}
                    onChange={(e) => setFormData({...formData, produto: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publico">Para quem você está vendendo?</Label>
                  <Input 
                    id="publico" 
                    placeholder="Ex: Donos de agências locais" 
                    value={formData.publico}
                    onChange={(e) => setFormData({...formData, publico: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objetivo">Qual o objetivo do anúncio?</Label>
                  <Select 
                    value={formData.objetivo} 
                    onValueChange={(v) => setFormData({...formData, objetivo: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vendas">Vendas Diretas</SelectItem>
                      <SelectItem value="Leads">Geração de Leads</SelectItem>
                      <SelectItem value="WhatsApp">Chamada no WhatsApp</SelectItem>
                      <SelectItem value="Engajamento">Engajamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full mt-4 bg-accent hover:bg-accent/90 text-white font-bold py-6 flex items-center justify-center"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    "ChatGPT está escrevendo..."
                  ) : (
                    "Gerar Copy Profissional"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Result */}
          <div className="lg:col-span-7">
            {loading ? (
              <div className="h-full flex items-center justify-center min-h-[400px]">
                <LogoLoading message="ChatGPT está escrevendo sua copy..." />
              </div>
            ) : result ? (
              <div className="space-y-6 animate-fade-in">
                <Card className="border-accent/20 overflow-hidden">
                  <div className="bg-accent/10 px-6 py-3 border-b border-accent/20 flex justify-between items-center">
                    <span className="text-xs font-bold text-accent uppercase tracking-widest">Resultado da Copy</span>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(`${result.headline}\n\n${result.texto}\n\n${result.cta}`)}>
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <Label className="text-accent text-[10px] uppercase font-bold">Headline</Label>
                      <p className="text-xl font-bold mt-1">{result.headline}</p>
                    </div>
                    <div>
                      <Label className="text-accent text-[10px] uppercase font-bold">Texto Principal</Label>
                      <p className="text-muted-foreground mt-2 leading-relaxed">{result.texto}</p>
                    </div>
                    <div>
                      <Label className="text-accent text-[10px] uppercase font-bold">Chamada para Ação (CTA)</Label>
                      <div className="mt-2 inline-block px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg text-accent font-bold">
                        {result.cta}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30 border-none">
                  <CardContent className="p-4 flex gap-4 items-start">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <BrainCircuit className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold">Ângulo Psicológico</h4>
                      <p className="text-xs text-muted-foreground mt-1">{result.angulo}</p>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  variant="outline" 
                  className="w-full border-primary/30 hover:bg-primary/5 text-primary font-bold py-6 gap-2"
                  onClick={handleSendToImage}
                >
                  <ImageIcon className="w-5 h-5" />
                  Forjar Criativo Visual para esta Copy
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Card className="h-full border-dashed border-2 border-muted bg-muted/5 flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sua copy estratégica</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    O ChatGPT está pronto para atuar como seu estrategista de anúncios. Preencha o briefing ao lado.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayoutPremium>
  );
}
