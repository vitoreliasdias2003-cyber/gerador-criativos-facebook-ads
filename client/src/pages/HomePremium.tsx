import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, Check, Download, Image as ImageIcon, Zap, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AutomaticMode from "./AutomaticMode";
import DashboardLayoutPremium from "@/components/DashboardLayoutPremium";

interface CreativeResult {
  headline: string;
  textoAnuncio: string;
  cta: string;
  anguloEmocional: string;
  ideiaCreativo: string;
}

type Mode = "manual" | "automatic";

export default function HomePremium() {
  const [mode, setMode] = useState<Mode>("manual");
  const [formData, setFormData] = useState<{
    nicho: string;
    publico: string;
    objetivo: "Vendas" | "Leads" | "WhatsApp";
    consciencia: "Frio" | "Morno" | "Quente";
    tom: "Emocional" | "Profissional" | "Direto" | "Urgente";
  }>({
    nicho: "",
    publico: "",
    objetivo: "Vendas",
    consciencia: "Frio",
    tom: "Profissional",
  });

  const [result, setResult] = useState<CreativeResult | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const generateMutation = trpc.creative.generate.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setGeneratedImage(null);
      toast.success("Criativo gerado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao gerar criativo");
    },
  });

  const generateImageMutation = trpc.creative.generateImage.useMutation({
    onSuccess: (data) => {
      setGeneratedImage(data.url || null);
      toast.success("Imagem gerada com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao gerar imagem");
    },
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as any,
    }));
  };

  const handleGenerate = () => {
    if (!formData.nicho.trim() || !formData.publico.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    generateMutation.mutate(formData);
  };

  const handleGenerateImage = () => {
    if (!result) {
      toast.error("Gere o criativo de texto primeiro");
      return;
    }

    generateImageMutation.mutate({
      nicho: formData.nicho,
      publico: formData.publico,
      objetivo: formData.objetivo,
      tom: formData.tom,
      headline: result.headline,
    });
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copiado para a área de transferência!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `criativo-facebook-ads-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Imagem baixada com sucesso!");
  };

  const handleNavigate = (item: string) => {
    toast.info(`Navegando para: ${item}`);
    // Implementar navegação real aqui
  };

  return (
    <DashboardLayoutPremium
      userName="Vitor Elias"
      userPlan="Premium"
      activeNavItem="criar-criativo"
      onNavigate={handleNavigate}
    >
      {/* Page Title */}
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Criar Criativo
        </h2>
        <p className="text-muted-foreground">
          Gere criativos profissionais para Facebook Ads com inteligência artificial
        </p>
      </div>

      {/* Mode Selector */}
      <div className="mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Manual Mode */}
          <button
            onClick={() => setMode("manual")}
            className={`relative group p-6 rounded-xl border-2 transition-all duration-300 ${
              mode === "manual"
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                : "border-border bg-card/50 hover:border-border/80 hover:bg-card/70"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${mode === "manual" ? "bg-primary/20" : "bg-accent/20"}`}>
                <Zap className={`w-6 h-6 ${mode === "manual" ? "text-primary" : "text-accent"}`} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Modo Manual</h3>
                <p className="text-sm text-muted-foreground mt-1">Preencha o formulário manualmente</p>
              </div>
            </div>
          </button>

          {/* Automatic Mode */}
          <button
            onClick={() => setMode("automatic")}
            className={`relative group p-6 rounded-xl border-2 transition-all duration-300 ${
              mode === "automatic"
                ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                : "border-border bg-card/50 hover:border-border/80 hover:bg-card/70"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${mode === "automatic" ? "bg-accent/20" : "bg-accent/20"}`}>
                <Sparkles className={`w-6 h-6 ${mode === "automatic" ? "text-accent" : "text-accent"}`} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Modo Automático</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="inline-block bg-accent/20 text-accent px-2 py-0.5 rounded text-xs font-semibold mr-1">PREMIUM</span>
                  Link ou arquivo
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {mode === "manual" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Informações do Anúncio</CardTitle>
                <CardDescription>
                  Preencha os dados para gerar seu criativo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nicho */}
                <div className="space-y-2">
                  <Label htmlFor="nicho" className="text-sm font-medium">
                    Nicho do Produto *
                  </Label>
                  <Input
                    id="nicho"
                    placeholder="Ex: Software de gestão"
                    value={formData.nicho}
                    onChange={(e) => handleInputChange("nicho", e.target.value)}
                    className="transition-all duration-200 focus:shadow-md"
                  />
                </div>

                {/* Público-alvo */}
                <div className="space-y-2">
                  <Label htmlFor="publico" className="text-sm font-medium">
                    Público-alvo *
                  </Label>
                  <Input
                    id="publico"
                    placeholder="Ex: Pequenos empresários"
                    value={formData.publico}
                    onChange={(e) => handleInputChange("publico", e.target.value)}
                    className="transition-all duration-200 focus:shadow-md"
                  />
                </div>

                {/* Objetivo */}
                <div className="space-y-2">
                  <Label htmlFor="objetivo" className="text-sm font-medium">
                    Objetivo do Anúncio
                  </Label>
                  <Select
                    value={formData.objetivo}
                    onValueChange={(value) =>
                      handleInputChange("objetivo", value)
                    }
                  >
                    <SelectTrigger id="objetivo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="Leads">Leads</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Consciência */}
                <div className="space-y-2">
                  <Label htmlFor="consciencia" className="text-sm font-medium">
                    Nível de Consciência
                  </Label>
                  <Select
                    value={formData.consciencia}
                    onValueChange={(value) =>
                      handleInputChange("consciencia", value)
                    }
                  >
                    <SelectTrigger id="consciencia">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frio">Frio</SelectItem>
                      <SelectItem value="Morno">Morno</SelectItem>
                      <SelectItem value="Quente">Quente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tom */}
                <div className="space-y-2">
                  <Label htmlFor="tom" className="text-sm font-medium">
                    Tom da Comunicação
                  </Label>
                  <Select
                    value={formData.tom}
                    onValueChange={(value) => handleInputChange("tom", value)}
                  >
                    <SelectTrigger id="tom">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emocional">Emocional</SelectItem>
                      <SelectItem value="Profissional">Profissional</SelectItem>
                      <SelectItem value="Direto">Direto</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Gerar Criativo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-4 animate-fade-in">
                {/* Headline */}
                <Card className="hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Headline</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.headline, "headline")}
                        className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                      >
                        {copiedField === "headline" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-semibold text-lg">
                      {result.headline}
                    </p>
                  </CardContent>
                </Card>

                {/* Texto do Anúncio */}
                <Card className="hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Texto do Anúncio</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(result.textoAnuncio, "texto")
                        }
                        className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                      >
                        {copiedField === "texto" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {result.textoAnuncio}
                    </p>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">CTA</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.cta, "cta")}
                        className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                      >
                        {copiedField === "cta" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-semibold text-lg">
                      {result.cta}
                    </p>
                  </CardContent>
                </Card>

                {/* Ângulo Emocional */}
                <Card className="hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Ângulo Emocional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{result.anguloEmocional}</p>
                  </CardContent>
                </Card>

                {/* Ideia de Criativo */}
                <Card className="hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Ideia de Criativo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {result.ideiaCreativo}
                    </p>
                  </CardContent>
                </Card>

                {/* Generate Image Button */}
                <Button
                  onClick={handleGenerateImage}
                  disabled={generateImageMutation.isPending}
                  variant="secondary"
                  className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {generateImageMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Gerando Imagem...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-5 w-5" />
                      Gerar Imagem do Criativo
                    </>
                  )}
                </Button>

                {/* Generated Image */}
                {generatedImage && (
                  <Card className="animate-fade-in hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Imagem do Criativo</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={downloadImage}
                          className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={generatedImage}
                        alt="Criativo gerado"
                        className="w-full rounded-lg border border-border shadow-lg hover:shadow-xl transition-shadow duration-300"
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Novo Criativo Button */}
                <Button
                  onClick={() => {
                    setResult(null);
                    setGeneratedImage(null);
                  }}
                  variant="outline"
                  className="w-full hover:shadow-md transition-all duration-300"
                >
                  Gerar Novo Criativo
                </Button>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[600px] shadow-xl">
                <CardContent className="text-center">
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
                    <Sparkles className="w-16 h-16 text-primary mx-auto relative animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Pronto para criar?
                  </h3>
                  <p className="text-muted-foreground text-base max-w-md mx-auto">
                    Preencha o formulário ao lado e clique em "Gerar Criativo" para ver a mágica acontecer
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <AutomaticMode />
      )}
    </DashboardLayoutPremium>
  );
}
