import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink } from "lucide-react";

interface AdData {
  id: string;
  headline: string;
  objective: string;
  date: string;
  status: "Ativo" | "Pausado" | "Rascunho";
  performance: string;
}

export default function AdReportDialog({ children }: { children: React.ReactNode }) {
  const adsData: AdData[] = [
    { id: "1", headline: "Transforme Seu Negócio com IA", objective: "Vendas", date: "03/01/2026", status: "Ativo", performance: "Alta" },
    { id: "2", headline: "Aumente Suas Vendas em 300%", objective: "Leads", date: "02/01/2026", status: "Ativo", performance: "Média" },
    { id: "3", headline: "Atendimento via WhatsApp", objective: "WhatsApp", date: "01/01/2026", status: "Pausado", performance: "Baixa" },
    { id: "4", headline: "Ebook Gratuito: Marketing Digital", objective: "Leads", date: "30/12/2025", status: "Ativo", performance: "Alta" },
    { id: "5", headline: "Consultoria Grátis 15min", objective: "Vendas", date: "28/12/2025", status: "Rascunho", performance: "-" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Pausado": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Relatório Completo de Anúncios
              </DialogTitle>
              <DialogDescription>
                Visualize todos os dados e métricas dos criativos produzidos no ForgeAds.
              </DialogDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-6 border rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Headline</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adsData.map((ad) => (
                <TableRow key={ad.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {ad.headline}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {ad.objective}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {ad.date}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ad.status)}>
                      {ad.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={ad.performance === "Alta" ? "text-green-500 font-semibold" : ""}>
                      {ad.performance}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Total de Anúncios</p>
            <p className="text-2xl font-bold">47</p>
          </div>
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Taxa de Conversão Média</p>
            <p className="text-2xl font-bold text-green-500">4.2%</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">CTR Médio</p>
            <p className="text-2xl font-bold text-blue-500">3.8%</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
