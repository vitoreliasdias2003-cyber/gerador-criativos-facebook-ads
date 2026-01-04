import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function useFileUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  /**
   * Faz upload de arquivo para o Supabase Storage
   */
  const uploadFile = async (file: File): Promise<{ url: string; path: string } | null> => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer upload');
      return null;
    }

    // Validar tipo de arquivo
    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são permitidos');
      return null;
    }

    // Validar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Máximo: 10MB');
      return null;
    }

    try {
      setUploading(true);
      setProgress(0);

      const filePath = `${user.id}/${Date.now()}_${file.name}`;

      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const { data, error } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) {
        console.error('Erro no upload:', error);
        throw error;
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      toast.success('Arquivo enviado com sucesso!');

      return {
        url: urlData.publicUrl,
        path: filePath,
      };
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao enviar arquivo');
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  /**
   * Extrai texto de PDF (deve ser feito no servidor)
   * Esta função envia o arquivo para o backend processar
   */
  const extractTextFromPDF = async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return null;
    }

    try {
      setUploading(true);
      toast.info('Extraindo texto do PDF...');

      // Converter arquivo para base64
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Enviar para o backend (você precisará criar um endpoint tRPC para isso)
      // Por enquanto, vamos retornar uma mensagem de erro
      throw new Error('Endpoint de extração de PDF ainda não implementado no backend');

    } catch (error: any) {
      console.error('Erro ao extrair texto:', error);
      toast.error(error.message || 'Erro ao processar PDF');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    extractTextFromPDF,
    uploading,
    progress,
  };
}
