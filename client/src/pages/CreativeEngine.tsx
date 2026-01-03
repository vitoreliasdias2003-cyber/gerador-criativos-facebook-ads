import React, { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Image as ImageIcon, Download, Share2, Sparkles, Copy, RefreshCw, Layers } from "lucide-react";
import DashboardLayoutPremium from "@/components/DashboardLayoutPremium";
import { toast } from "sonner";

export default function CreativeEngine() {
  const search = useSearch();
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [formData, setFormData] = useState({
    headline: "",
    produto: "",
    publico: "",
    estilo: "Realista"
  });

  useEffect(() => {
    const params = new URLSearchParams(search);
    const headlineParam = params.get("headline");
    const produtoParam = params.get("produto");
    const publicoParam = params.get("publico");
    
    if (headlineParam || produtoParam || publicoParam) {
      setFormData(prev => ({
        ...prev,
        headline: headlineParam || prev.headline,
        produto: produtoParam || prev.produto,
        publico: publicoParam || prev.publico
      }));
      toast.info("Dados importados do Copy Engine!");
    }
  }, [search]);

  const handleGenerate = () => {
    if (!formData.produto || !formData.publico) {
      toast.error("Por favor, preencha o produto e o público-alvo.");
      return;
    }
    setLoading(true);
    
    // Simulação de geração com o prompt interno
    // Prompt Interno: "Crie uma imagem publicitária profissional para um anúncio no Meta Ads. Produto: {{produto}}, Público-alvo: {{publico}}, Headline: {{headline}}. Diretrizes: Estilo {{estilo}}, Foco em conversão, Composição limpa, Sem texto excessivo, Iluminação moderna, Qualidade premium."
    
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
      toast.success("Criativo visual forjado com sucesso!");
    }, 4000);
  };

  const handleDownload = () => {
    toast.success("Iniciando download do criativo...");
  };

  const handleDuplicate = () => {
    toast.info("Duplicando criativo para nova variação...");
    handleGenerate();
  };

  return (
    <DashboardLayoutPremium activeNavItem="criativos">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Layers className="w-8 h-8 text-primary" />
              ForgeAds Image Engine
            </h2>
            <p className="text-muted-foreground mt-2">
              Criativos forjados para performance. Imagens profissionais para Meta Ads.
            </p>
          </div>
          {generated && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDuplicate} className="gap-2">
                <Copy className="w-4 h-4" />
                Duplicar
              </Button>
              <Button variant="outline" size="sm" onClick={() => setGenerated(false)} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Novo
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-primary/10 bg-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Configurações de Imagem</CardTitle>
                <CardDescription>Defina os parâmetros para a IA Visual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="produto">Produto</Label>
                  <Input 
                    id="produto" 
                    placeholder="O que você está vendendo?" 
                    value={formData.produto}
                    onChange={(e) => setFormData({...formData, produto: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publico">Público-alvo</Label>
                  <Input 
                    id="publico" 
                    placeholder="Para quem é o anúncio?" 
                    value={formData.publico}
                    onChange={(e) => setFormData({...formData, publico: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline na Imagem (Opcional)</Label>
                  <Input 
                    id="headline" 
                    placeholder="Texto curto de impacto" 
                    value={formData.headline}
                    onChange={(e) => setFormData({...formData, headline: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estilo">Estilo Visual</Label>
                  <Select 
                    value={formData.estilo} 
                    onValueChange={(v) => setFormData({...formData, estilo: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estilo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Realista">Realista (Foto)</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle (Uso Real)</SelectItem>
                      <SelectItem value="Minimalista">Minimalista</SelectItem>
                      <SelectItem value="Tech">Tech / Futurista</SelectItem>
                      <SelectItem value="Dramático">Dramático (Luz/Sombra)</SelectItem>
                      <SelectItem value="Clean">Clean / Estúdio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-bold py-6 shadow-lg shadow-primary/20"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Forjando Criativo...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5" />
                      Gerar Criativo
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-8">
            <Card className={cn(
              "h-full border-2 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden transition-all duration-500",
              generated ? "border-primary/20 bg-card shadow-2xl" : "border-dashed border-muted bg-muted/5"
            )}>
              {loading ? (
                <div className="text-center space-y-4 animate-pulse">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-12 h-12 text-primary animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold">Forjando sua imagem...</h3>
                  <p className="text-muted-foreground">Nossa IA está compondo o criativo perfeito para seu público.</p>
                </div>
              ) : generated ? (
                <div className="w-full h-full flex flex-col p-4">
                  <div className="flex-1 relative group rounded-xl overflow-hidden border shadow-inner bg-black">
                    <img 
                      src="https://images.unsplash.com/photo-1542744173-8e7e53815d1c?w=1200&auto=format&fit=crop&q=80" 
                      alt="Criativo Gerado" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button onClick={handleDownload} className="gap-2">
                        <Download className="w-4 h-4" />
                        Baixar HD
                      </Button>
                      <Button variant="secondary" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <ImageIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Criativo Finalizado</p>
                        <p className="text-xs text-muted-foreground">Formato 1080x1080 (Feed/Instagram)</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary font-bold" onClick={handleGenerate}>
                      Gerar Variação
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Pronto para forjar?</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Insira os dados do seu produto ao lado. O ForgeAds Image Engine criará uma imagem publicitária profissional focada em conversão.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayoutPremium>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
