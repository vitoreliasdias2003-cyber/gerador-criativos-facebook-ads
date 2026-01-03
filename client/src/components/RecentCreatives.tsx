import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Image as ImageIcon, MoreVertical, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Creative {
  id: string;
  headline: string;
  preview: string;
  createdAt: string;
  objective: string;
}

interface RecentCreativesProps {
  className?: string;
  creatives?: Creative[];
  onCopy?: (creative: Creative) => void;
  onGenerateImage?: (creative: Creative) => void;
  onDuplicate?: (creative: Creative) => void;
}

export default function RecentCreatives({
  className,
  creatives = [],
  onCopy,
  onGenerateImage,
  onDuplicate,
}: RecentCreativesProps) {
  // Mock data se não houver criativos
  const mockCreatives: Creative[] = creatives.length
    ? creatives
    : [
        {
          id: "1",
          headline: "Transforme Seu Negócio com IA",
          preview:
            "Descubra como a inteligência artificial pode revolucionar sua empresa...",
          createdAt: "Há 2 horas",
          objective: "Vendas",
        },
        {
          id: "2",
          headline: "Aumente Suas Vendas em 300%",
          preview:
            "Estratégias comprovadas para multiplicar seus resultados...",
          createdAt: "Há 5 horas",
          objective: "Leads",
        },
        {
          id: "3",
          headline: "Atendimento Instantâneo via WhatsApp",
          preview:
            "Conecte-se com seus clientes de forma rápida e eficiente...",
          createdAt: "Ontem",
          objective: "WhatsApp",
        },
      ];

  const getObjectiveBadgeColor = (objective: string) => {
    switch (objective) {
      case "Vendas":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Leads":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "WhatsApp":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Últimos Criativos</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            Ver Todos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockCreatives.map((creative, index) => (
            <div
              key={creative.id}
              className="group p-4 rounded-lg border border-border bg-card/50 hover:bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Headline */}
                  <h4 className="font-semibold text-foreground mb-2 line-clamp-1">
                    {creative.headline}
                  </h4>

                  {/* Preview */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {creative.preview}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border",
                        getObjectiveBadgeColor(creative.objective)
                      )}
                    >
                      {creative.objective}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {creative.createdAt}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onCopy?.(creative)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onGenerateImage?.(creative)}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onDuplicate?.(creative)}
                      >
                        Duplicar Criativo
                      </DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
