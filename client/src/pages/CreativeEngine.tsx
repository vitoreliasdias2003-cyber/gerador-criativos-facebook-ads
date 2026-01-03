import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wand2, Image as ImageIcon, Download, Share2, Sparkles } from "lucide-react";
import DashboardLayoutPremium from "@/components/DashboardLayoutPremium";
import { toast } from "sonner";

export default function CreativeEngine() {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [formData, setFormData] = useState({
    headline: "",
    produto: "",
    publico: "",
    estilo: ""
  });

  const handleGenerate = () => {
    if (!formData.produto || !formData.publico) {
      toast.error("Por favor, preencha o produto e o público-alvo.");
      return;
    }
    setLoading(true);
    // Simulação de geração
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
      toast.success("Criativo visual gerado com sucesso!");
    }, 3000);
  };

  return (
    <DashboardLayoutPremium activeNavItem="criativos">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-primary" />
            ForgeAds Creative Engine
          </h2>
          <p className="text-muted-foreground mt-2">
            Gere criativos visuais de alta performance para Meta Ads usando nossa IA especializada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Configurações do Criativo</CardTitle>
                <CardDescription>Defina os detalhes para a IA visual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="produto">Produto ou Serviço</Label>
                  <Input 
                    id="produto" 
                    placeholder="Ex: Curso de Marketing Digital" 
                    value={formData.produto}
                    onChange={(e) => setFormData({...formData, produto: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline (Opcional)</Label>
                  <Input 
                    id="headline" 
                    placeholder="Ex: Aprenda a vender todo dia" 
                    value={formData.headline}
                    onChange={(e) => setFormData({...formData, headline: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publico">Público-alvo</Label>
                  <Input 
                    id="publico" 
                    placeholder="Ex: Empreendedores iniciantes" 
                    value={formData.publico}
                    onChange={(e) => setFormData({...formData, publico: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estilo">Estilo Visual (Opcional)</Label>
                  <Input 
                    id="estilo" 
                    placeholder="Ex: Minimalista, Futurista, Realista" 
                    value={formData.estilo}
                    onChange={(e) => setFormData({...formData, estilo: e.target.value})}
                  />
                </div>
                <Button 
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-bold py-6"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 animate-spin" />
                      Gerando Criativo Visual...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Gerar Criativo Visual
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-7">
            <Card className="h-full border-dashed border-2 border-muted bg-muted/5 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
              {generated ? (
                <div className="w-full h-full p-6 flex flex-col">
                  <div className="flex-1 bg-card rounded-xl border shadow-2xl overflow-hidden relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60" 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button size="icon" variant="secondary" className="rounded-full">
                        <Download className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="secondary" className="rounded-full">
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <h4 className="text-sm font-bold text-primary mb-1">Ideia de Variação</h4>
                      <p className="text-xs text-muted-foreground">Tente usar cores mais quentes para o público de empreendedores.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                      <h4 className="text-sm font-bold text-accent mb-1">Sugestão Meta Ads</h4>
                      <p className="text-xs text-muted-foreground">Formato 1:1 (Quadrado) ideal para Feed e Explorar.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Aguardando sua ideia</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Preencha os campos ao lado e clique em gerar para ver a mágica acontecer.
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
