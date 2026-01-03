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
import { Loader2, Copy, Check, Download, Image as ImageIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AutomaticMode from "./AutomaticMode";

interface CreativeResult {
  headline: string;
  textoAnuncio: string;
  cta: string;
  anguloEmocional: string;
  ideiaCreativo: string;
}

type Mode = "manual" | "automatic";

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Gerador de Criativos para Facebook Ads
          </h1>
          <p className="text-lg text-slate-600">
            Crie anúncios prontos em segundos
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Escolha o modo de geração</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer flex-1 p-3 border-2 rounded-lg transition" style={{borderColor: mode === "manual" ? "#3b82f6" : "#e2e8f0"}}>
                  <input
                    type="radio"
                    value="manual"
                    checked={mode === "manual"}
                    onChange={(e) => setMode(e.target.value as Mode)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-sm">Modo Manual</p>
                    <p className="text-xs text-slate-500">Preencha o formulário manualmente</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer flex-1 p-3 border-2 rounded-lg transition" style={{borderColor: mode === "automatic" ? "#a855f7" : "#e2e8f0"}}>
                  <input
                    type="radio"
                    value="automatic"
                    checked={mode === "automatic"}
                    onChange={(e) => setMode(e.target.value as Mode)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-sm">Modo Automático</p>
                    <p className="text-xs text-slate-500">
                      <span className="inline-block bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-semibold mr-1">PREMIUM</span>
                      Link ou arquivo
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {mode === "manual" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
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
                      className="border-slate-300"
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
                      className="border-slate-300"
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
                      <SelectTrigger id="objetivo" className="border-slate-300">
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
                      <SelectTrigger id="consciencia" className="border-slate-300">
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
                      <SelectTrigger id="tom" className="border-slate-300">
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-10"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      "Gerar Criativo"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              {result ? (
                <div className="space-y-4">
                  {/* Headline */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Headline</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.headline, "headline")}
                          className="h-8 w-8 p-0"
                        >
                          {copiedField === "headline" ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 font-semibold">
                        {result.headline}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Texto do Anúncio */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Texto do Anúncio</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(result.textoAnuncio, "texto")
                          }
                          className="h-8 w-8 p-0"
                        >
                          {copiedField === "texto" ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 whitespace-pre-wrap">
                        {result.textoAnuncio}
                      </p>
                    </CardContent>
                  </Card>

                  {/* CTA */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">CTA</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.cta, "cta")}
                          className="h-8 w-8 p-0"
                        >
                          {copiedField === "cta" ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 font-semibold">
                        {result.cta}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Ângulo Emocional */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Ângulo Emocional</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700">{result.anguloEmocional}</p>
                    </CardContent>
                  </Card>

                  {/* Ideia de Criativo */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Ideia de Criativo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 whitespace-pre-wrap">
                        {result.ideiaCreativo}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Generate Image Button */}
                  <Button
                    onClick={handleGenerateImage}
                    disabled={generateImageMutation.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 h-10"
                  >
                    {generateImageMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando Imagem...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Gerar Imagem do Criativo
                      </>
                    )}
                  </Button>

                  {/* Generated Image */}
                  {generatedImage && (
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Imagem do Criativo</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={downloadImage}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <img
                          src={generatedImage}
                          alt="Criativo gerado"
                          className="w-full rounded-lg border border-slate-200"
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
                    className="w-full"
                  >
                    Gerar Novo Criativo
                  </Button>
                </div>
              ) : (
                <Card className="h-full flex items-center justify-center min-h-96">
                  <CardContent className="text-center">
                    <p className="text-slate-500 text-lg">
                      Preencha o formulário e clique em "Gerar Criativo" para ver o resultado aqui
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <AutomaticMode />
        )}
      </div>
    </div>
  );
}
