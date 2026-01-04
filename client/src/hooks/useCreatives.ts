import { useState, useEffect } from 'react';
import { supabase, type Creative } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function useCreatives() {
  const { user } = useAuth();
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar criativos do usuário
  const loadCreatives = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creatives')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCreatives(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar criativos:', error);
      toast.error('Erro ao carregar histórico de criativos');
    } finally {
      setLoading(false);
    }
  };

  // Salvar novo criativo
  const saveCreative = async (creative: Omit<Creative, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar criativos');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('creatives')
        .insert({
          ...creative,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Adicionar ao estado local
      setCreatives((prev) => [data, ...prev]);
      toast.success('Criativo salvo com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Erro ao salvar criativo:', error);
      toast.error('Erro ao salvar criativo');
      return null;
    }
  };

  // Deletar criativo
  const deleteCreative = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('creatives')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remover do estado local
      setCreatives((prev) => prev.filter((c) => c.id !== id));
      toast.success('Criativo removido');
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar criativo:', error);
      toast.error('Erro ao remover criativo');
      return false;
    }
  };

  // Atualizar criativo
  const updateCreative = async (id: string, updates: Partial<Creative>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('creatives')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Atualizar estado local
      setCreatives((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
      toast.success('Criativo atualizado');
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar criativo:', error);
      toast.error('Erro ao atualizar criativo');
      return false;
    }
  };

  // Carregar criativos ao montar o componente
  useEffect(() => {
    loadCreatives();
  }, [user]);

  return {
    creatives,
    loading,
    saveCreative,
    deleteCreative,
    updateCreative,
    reloadCreatives: loadCreatives,
  };
}
