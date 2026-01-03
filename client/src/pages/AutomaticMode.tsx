import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, Check, Download, Image as ImageIcon, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ProductAnalysis {
  productName: string;
  targetAudience: string;
  mainPain: string;
  mainBenefit: string;
  centralPromise: string;
  communicationTone: string;
  headline: string;
  textoAnuncio: string;
  cta: string;
  anguloEmocional: string;
  ideiaCreativo: string;
}

export default function AutomaticMode() {
  const [inputType, setInputType] = useState<"link" | "file">("link");
  const [linkInput, setLinkInput] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [result, setResult] = useState<ProductAnalysis | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const analyzeMutation = trpc.creative.analyzeProduct.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setGeneratedImage(null);
      toast.success("Produto analisado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao analisar produto");
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    const content = inputType === "link" ? linkInput : fileContent;

    if (!content.trim()) {
      toast.error("Preencha o link ou carregue um arquivo");
      return;
    }

    analyzeMutation.mutate({
      content,
      sourceType: inputType,
      sourceUrl: inputType === "link" ? linkInput : undefined,
    });
  };

  const handleGenerateImage = () => {
    if (!result) {
      toast.error("Analise um produto primeiro");
      return;
    }

    generateImageMutation.mutate({
      nicho: result.productName,
      publico: result.targetAudience,
      objetivo: "Vendas",
      tom: (result.communicationTone as any) || "Profissional",
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
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Modo Automático por Produto</CardTitle>
              <CardDescription>
                Gere criativos automaticamente a partir de um link ou arquivo
              </CardDescription>
            </div>
            <div className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-semibold">
              PREMIUM
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Type Selector */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Escolha o tipo de entrada</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="link"
                  checked={inputType === "link"}
                  onChange={(e) => setInputType(e.target.value as "link" | "file")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Link do Produto</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="file"
                  checked={inputType === "file"}
                  onChange={(e) => setInputType(e.target.value as "link" | "file")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Arquivo (PDF, DOC, TXT)</span>
              </label>
            </div>
          </div>

          {/* Link Input */}
          {inputType === "link" && (
            <div className="space-y-2">
              <Label htmlFor="link" className="text-sm font-medium">
                Cole o link do produto
              </Label>
              <Input
                id="link"
                placeholder="https://exemplo.com/produto"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                className=""
              />
            </div>
          )}

          {/* File Upload */}
          {inputType === "file" && (
            <div className="space-y-2">
              <Label htmlFor="file" className="text-sm font-medium">
                Carregue um arquivo
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className=""
                />
                {fileContent && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
              </div>
              {fileContent && (
                <p className="text-xs text-muted-foreground">
                  Arquivo carregado ({Math.round(fileContent.length / 1024)} KB)
                </p>
              )}
            </div>
          )}

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={analyzeMutation.isPending}
            className="w-full bg-gradient-to-br from-accent to-blue-600 hover:shadow-lg hover:shadow-accent/40 text-white font-semibold py-2 h-10"
          >
            {analyzeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              "Gerar Criativo Automaticamente"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result ? (
        <div className="space-y-4">
          {/* Product Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informações do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Nome do Produto</p>
                <p className="text-foreground font-semibold">{result.productName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Público-alvo</p>
                <p className="text-foreground">{result.targetAudience}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Dor Principal</p>
                  <p className="text-foreground text-sm">{result.mainPain}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Benefício Principal</p>
                  <p className="text-foreground text-sm">{result.mainBenefit}</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-semibold">{result.headline}</p>
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
                  onClick={() => copyToClipboard(result.textoAnuncio, "texto")}
                  className="h-8 w-8 p-0"
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
              <p className="text-foreground whitespace-pre-wrap">{result.textoAnuncio}</p>
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
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-semibold">{result.cta}</p>
            </CardContent>
          </Card>

          {/* Ângulo Emocional */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ângulo Emocional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{result.anguloEmocional}</p>
            </CardContent>
          </Card>

          {/* Ideia de Criativo */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ideia de Criativo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">{result.ideiaCreativo}</p>
            </CardContent>
          </Card>

          {/* Generate Image Button */}
          <Button
            onClick={handleGenerateImage}
            disabled={generateImageMutation.isPending}
            className="w-full bg-gradient-to-br from-accent to-blue-600 hover:shadow-lg hover:shadow-accent/40 text-white font-semibold py-2 h-10"
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

          {/* New Analysis Button */}
          <Button
            onClick={() => {
              setResult(null);
              setGeneratedImage(null);
              setLinkInput("");
              setFileContent("");
            }}
            variant="outline"
            className="w-full"
          >
            Analisar Novo Produto
          </Button>
        </div>
      ) : (
        <Card className="h-full flex items-center justify-center min-h-96">
          <CardContent className="text-center">
            <p className="text-muted-foreground text-lg">
              Cole um link ou carregue um arquivo para gerar criativos automaticamente
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
