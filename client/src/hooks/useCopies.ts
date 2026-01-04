import { useState, useEffect } from 'react';
import { supabase, type Copy } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function useCopies() {
  const { user } = useAuth();
  const [copies, setCopies] = useState<Copy[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar copies do usuário
  const loadCopies = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('copies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCopies(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar copies:', error);
      toast.error('Erro ao carregar histórico de copies');
    } finally {
      setLoading(false);
    }
  };

  // Salvar nova copy
  const saveCopy = async (copy: Omit<Copy, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar copies');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('copies')
        .insert({
          ...copy,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Adicionar ao estado local
      setCopies((prev) => [data, ...prev]);
      return data;
    } catch (error: any) {
      console.error('Erro ao salvar copy:', error);
      toast.error('Erro ao salvar copy');
      return null;
    }
  };

  // Deletar copy
  const deleteCopy = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('copies')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remover do estado local
      setCopies((prev) => prev.filter((c) => c.id !== id));
      toast.success('Copy removida');
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar copy:', error);
      toast.error('Erro ao remover copy');
      return false;
    }
  };

  // Carregar copies ao montar o componente
  useEffect(() => {
    loadCopies();
  }, [user]);

  return {
    copies,
    loading,
    saveCopy,
    deleteCopy,
    reloadCopies: loadCopies,
  };
}
