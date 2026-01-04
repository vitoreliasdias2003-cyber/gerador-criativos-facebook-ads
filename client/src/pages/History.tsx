import { useState } from 'react';
import DashboardLayoutPremium from '../components/DashboardLayoutPremium';
import { useCreatives } from '../hooks/useCreatives';
import { useCopies } from '../hooks/useCopies';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import { Search, MoreVertical, Copy, Trash2, Image as ImageIcon, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function History() {
  const { creatives, loading: loadingCreatives, deleteCreative } = useCreatives();
  const { copies, loading: loadingCopies, deleteCopy } = useCopies();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('creatives');

  // Filtrar criativos
  const filteredCreatives = creatives.filter((creative) =>
    creative.produto_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creative.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creative.nicho?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar copies
  const filteredCopies = copies.filter((copy) =>
    copy.produto_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    copy.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  const handleDeleteCreative = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este criativo?')) {
      await deleteCreative(id);
    }
  };

  const handleDeleteCopy = async (id: string) => {
    if (confirm('Tem certeza que deseja remover esta copy?')) {
      await deleteCopy(id);
    }
  };

  return (
    <DashboardLayoutPremium>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Histórico</h1>
          <p className="text-[#9CA3AF]">
            Acesse todos os criativos e copies que você já gerou
          </p>
        </div>

        {/* Barra de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
          <Input
            placeholder="Buscar por nome do produto, headline, nicho..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1F2937] border-[#374151] text-white placeholder:text-[#6B7280]"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#1F2937] border-[#374151]">
            <TabsTrigger value="creatives" className="data-[state=active]:bg-[#1877F2]">
              <ImageIcon className="h-4 w-4 mr-2" />
              Criativos ({filteredCreatives.length})
            </TabsTrigger>
            <TabsTrigger value="copies" className="data-[state=active]:bg-[#1877F2]">
              <FileText className="h-4 w-4 mr-2" />
              Copies ({filteredCopies.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Criativos */}
          <TabsContent value="creatives" className="space-y-4">
            {loadingCreatives ? (
              <LoadingState />
            ) : filteredCreatives.length === 0 ? (
              <EmptyState
                title="Nenhum criativo encontrado"
                description={searchTerm ? "Tente buscar por outro termo" : "Comece criando seu primeiro criativo!"}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCreatives.map((creative) => (
                  <Card key={creative.id} className="bg-[#131820] border-[#1F2937] hover:border-[#1877F2]/50 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg mb-1">
                            {creative.produto_nome}
                          </CardTitle>
                          <CardDescription className="text-[#9CA3AF] text-sm flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(creative.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1F2937] border-[#374151]">
                            <DropdownMenuItem
                              onClick={() => handleCopyToClipboard(creative.headline || '')}
                              className="text-white hover:bg-[#374151]"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar headline
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCreative(creative.id)}
                              className="text-red-400 hover:bg-[#374151]"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {creative.image_url && (
                        <img
                          src={creative.image_url}
                          alt={creative.produto_nome}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      )}
                      {creative.headline && (
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Headline:</p>
                          <p className="text-sm text-white line-clamp-2">{creative.headline}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {creative.objetivo && (
                          <Badge variant="secondary" className="text-xs">
                            {creative.objetivo}
                          </Badge>
                        )}
                        {creative.nicho && (
                          <Badge variant="outline" className="text-xs">
                            {creative.nicho}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Copies */}
          <TabsContent value="copies" className="space-y-4">
            {loadingCopies ? (
              <LoadingState />
            ) : filteredCopies.length === 0 ? (
              <EmptyState
                title="Nenhuma copy encontrada"
                description={searchTerm ? "Tente buscar por outro termo" : "Comece criando sua primeira copy!"}
              />
            ) : (
              <div className="space-y-3">
                {filteredCopies.map((copy) => (
                  <Card key={copy.id} className="bg-[#131820] border-[#1F2937] hover:border-[#1877F2]/50 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white text-base mb-1">
                            {copy.produto_nome}
                          </CardTitle>
                          <CardDescription className="text-[#9CA3AF] text-sm flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {copy.tipo_copy}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(copy.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}
                            </span>
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1F2937] border-[#374151]">
                            <DropdownMenuItem
                              onClick={() => handleCopyToClipboard(copy.conteudo)}
                              className="text-white hover:bg-[#374151]"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar conteúdo
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCopy(copy.id)}
                              className="text-red-400 hover:bg-[#374151]"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-white whitespace-pre-wrap line-clamp-4">
                        {copy.conteudo}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutPremium>
  );
}
