import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Link as LinkIcon, 
  FileUp, 
  Target, 
  Sparkles, 
  ImageIcon, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  Copy,
  Download,
  FileText
} from "lucide-react";
import DashboardLayoutPremium from "@/components/DashboardLayoutPremium";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Step = "input" | "processing" | "result";

interface AutomationResult {
  productName: string;
  targetAudience: string;
  mainPain: string;
  headline: string;
  textoAnuncio: string;
  cta: string;
  anguloEmocional: string;
  imageUrl?: string;
}

export default function AutomaticModePremium() {
  const [step, setStep] = useState<Step>("input");
  const [activeTab, setActiveTab] = useState<"link" | "file">("link");
  const [productLink, setProductLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState("");
  const [result, setResult] = useState<AutomationResult | null>(null);

  const analyzeMutation = trpc.creative.analyzeProduct.useMutation();
  const generateImageMutation = trpc.creative.generateImage.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`Arquivo "${file.name}" selecionado`);
    }
  };

  const startAutomation = async () => {
    if (activeTab === "link" && !productLink) {
      toast.error("Insira o link do produto");
      return;
    }
    if (activeTab === "file" && !selectedFile) {
      toast.error("Selecione um arquivo");
      return;
    }

    setStep("processing");
    setProgress(10);
    setCurrentStatus("Iniciando motores de análise...");

    try {
      let fileContent = "";
      let fileType = "";
      
      if (activeTab === "file" && selectedFile) {
        const reader = new FileReader();
        fileContent = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
        fileType = selectedFile.type;
      }

      setCurrentStatus("Extraindo dados reais da fonte...");
      setProgress(30);

      const analysis = await analyzeMutation.mutateAsync({
        sourceType: activeTab,
        sourceUrl: activeTab === "link" ? productLink : undefined,
        fileContent: activeTab === "file" ? fileContent : undefined,
        fileType: activeTab === "file" ? fileType : undefined
      });

      setCurrentStatus("Forjando copy estratégica...");
      setProgress(60);

      const automationResult: AutomationResult = {
        productName: analysis.productName || "",
        targetAudience: analysis.targetAudience || "",
        mainPain: analysis.mainPain || "",
        headline: analysis.headline || "",
        textoAnuncio: analysis.textoAnuncio || "",
        cta: analysis.cta || "",
        anguloEmocional: analysis.anguloEmocional || "",
      };

      setCurrentStatus("Gerando criativo visual de alto padrão...");
      setProgress(85);

      const image = await generateImageMutation.mutateAsync({
        produto: analysis.productName,
        publico: analysis.targetAudience,
        headline: analysis.headline,
        estilo: "Realista Profissional"
      });

      automationResult.imageUrl = image.url;
      setProgress(100);
      setCurrentStatus("Finalizado!");
      
      setResult(automationResult);
      setTimeout(() => setStep("result"), 500);
      toast.success("Anúncio forjado com sucesso!");
    } catch (err: any) {
      console.error(err);
      setStep("input");
      toast.error(err.message || "Falha na automação: Dados insuficientes");
    }
  };

  return (
    <DashboardLayoutPremium>
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/20 rounded-2xl">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter">Automação Premium</h2>
                </div>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl">
                  Nossa IA analisa dados reais para forjar anúncios imbatíveis. <span className="text-white">Zero conteúdo genérico.</span>
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                  <div className="flex p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl h-16">
                    <button 
                      onClick={() => setActiveTab("link")}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-xl font-bold transition-all ${activeTab === "link" ? "bg-white/10 text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
                    >
                      <LinkIcon className="w-5 h-5" /> Link do Produto
                    </button>
                    <button 
                      onClick={() => setActiveTab("file")}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-xl font-bold transition-all ${activeTab === "file" ? "bg-white/10 text-white shadow-lg" : "text-muted-foreground hover:text-white"}`}
                    >
                      <FileUp className="w-5 h-5" /> Arquivo / PDF
                    </button>
                  </div>

                  <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
                    {activeTab === "link" ? (
                      <div className="space-y-4">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">URL da Oferta</Label>
                        <div className="relative group">
                          <Input 
                            placeholder="https://seu-produto.com/vendas"
                            value={productLink}
                            onChange={(e) => setProductLink(e.target.value)}
                            className="h-16 pl-6 pr-14 bg-white/[0.02] border-white/10 group-hover:border-primary/50 focus:border-primary transition-all text-lg rounded-2xl"
                          />
                          <LinkIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Upload de Briefing</Label>
                        <div 
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                        >
                          <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.txt,.docx" />
                          <FileUp className="w-12 h-12 text-muted-foreground mx-auto mb-4 group-hover:text-primary group-hover:scale-110 transition-all" />
                          <p className="text-lg font-bold">{selectedFile ? selectedFile.name : "Clique para enviar PDF ou TXT"}</p>
                          <p className="text-sm text-muted-foreground mt-1">Máximo 10MB</p>
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={startAutomation}
                      className="w-full h-16 rounded-2xl font-black text-lg bg-primary hover:brightness-110 shadow-xl shadow-primary/20 gap-3"
                    >
                      FORJAR ANÚNCIO <ArrowRight className="w-6 h-6" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
                    <h4 className="font-black uppercase tracking-widest text-xs text-primary">Como funciona</h4>
                    <div className="space-y-6">
                      {[
                        { icon: Target, text: "Extração real de dados da fonte" },
                        { icon: Sparkles, text: "Análise semântica da oferta" },
                        { icon: FileText, text: "Escrita de copy persuasiva" },
                        { icon: ImageIcon, text: "Geração de criativo visual" },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="p-2 rounded-lg bg-white/5 text-muted-foreground">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground leading-tight">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20 flex gap-4">
                    <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                      Garantia de originalidade: O motor bloqueia gerações se os dados forem insuficientes.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-10"
            >
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-[2.5rem] border-2 border-primary/20 border-t-primary"
                />
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-primary animate-pulse" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-4xl font-black tracking-tighter">{currentStatus}</h3>
                <p className="text-muted-foreground text-lg font-medium">Isso pode levar alguns segundos para uma análise profunda.</p>
              </div>

              <div className="w-full max-w-md space-y-3">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-primary">
                  <span>Progresso da Forja</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-3 rounded-full bg-white/5" />
              </div>
            </motion.div>
          )}

          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => setStep("input")}
                  className="rounded-xl hover:bg-white/5 font-bold gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> Voltar
                </Button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-black uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" /> Forjado com Sucesso
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                  <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-10">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Headline</Label>
                      <h3 className="text-3xl font-black tracking-tight leading-tight">{result.headline}</h3>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Texto do Anúncio</Label>
                      <p className="text-xl text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap">
                        {result.textoAnuncio}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">CTA</Label>
                        <p className="font-bold text-lg">{result.cta}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Ângulo</Label>
                        <p className="font-bold text-lg">{result.anguloEmocional}</p>
                      </div>
                    </div>

                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${result.headline}\n\n${result.textoAnuncio}\n\nCTA: ${result.cta}`);
                        toast.success("Copiado para a área de transferência");
                      }}
                      className="w-full h-14 rounded-2xl font-bold gap-2 bg-white/5 hover:bg-white/10 border-none"
                    >
                      <Copy className="w-5 h-5" /> Copiar Anúncio Completo
                    </Button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6 overflow-hidden">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Criativo Visual</Label>
                    <div className="aspect-square rounded-3xl bg-white/5 overflow-hidden border border-white/5 shadow-2xl relative group">
                      {result.imageUrl ? (
                        <img src={result.imageUrl} alt="Criativo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <Button className="w-full h-14 rounded-2xl font-bold gap-2 shadow-lg shadow-primary/20">
                      <Download className="w-5 h-5" /> Baixar Imagem
                    </Button>
                  </div>

                  <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Dados da Análise</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Produto:</span>
                        <span className="font-bold">{result.productName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Público:</span>
                        <span className="font-bold">{result.targetAudience}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayoutPremium>
  );
}
