import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nwalpywjrvwaevudloyw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

// Cliente Supabase com service key para operações no servidor
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Faz upload de arquivo para o Supabase Storage
 */
export async function uploadFileToSupabase(
  file: Buffer,
  fileName: string,
  userId: string,
  contentType: string = 'application/pdf'
): Promise<{ url: string; path: string } | null> {
  try {
    const filePath = `${userId}/${Date.now()}_${fileName}`;

    const { data, error } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }

    // Obter URL pública (com signed URL por 1 hora)
    const { data: urlData } = await supabase.storage
      .from('user-uploads')
      .createSignedUrl(filePath, 3600);

    return {
      url: urlData?.signedUrl || '',
      path: filePath,
    };
  } catch (error) {
    console.error('Erro no upload:', error);
    return null;
  }
}

/**
 * Extrai texto de um PDF usando pdftotext (poppler-utils)
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  const tempPdfPath = join(tmpdir(), `temp_${Date.now()}.pdf`);
  const tempTxtPath = join(tmpdir(), `temp_${Date.now()}.txt`);

  try {
    // Salvar PDF temporariamente
    await writeFile(tempPdfPath, pdfBuffer);

    // Executar pdftotext
    await new Promise<void>((resolve, reject) => {
      const process = spawn('pdftotext', ['-layout', tempPdfPath, tempTxtPath]);

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`pdftotext falhou com código ${code}`));
        }
      });

      process.on('error', (err) => {
        reject(err);
      });
    });

    // Ler texto extraído
    const fs = await import('fs/promises');
    const text = await fs.readFile(tempTxtPath, 'utf-8');

    // Limpar arquivos temporários
    await unlink(tempPdfPath).catch(() => {});
    await unlink(tempTxtPath).catch(() => {});

    // Validar se há texto suficiente
    const cleanText = text.trim();
    if (cleanText.length < 50) {
      throw new Error('PDF não contém texto legível suficiente. Verifique se o arquivo não está protegido ou é apenas imagem.');
    }

    return cleanText;
  } catch (error: any) {
    // Limpar arquivos temporários em caso de erro
    await unlink(tempPdfPath).catch(() => {});
    await unlink(tempTxtPath).catch(() => {});

    throw new Error(`Erro ao extrair texto do PDF: ${error.message}`);
  }
}

/**
 * Processa upload de PDF: faz upload e extrai texto
 */
export async function processPDFUpload(
  pdfBuffer: Buffer,
  fileName: string,
  userId: string
): Promise<{ url: string; path: string; extractedText: string }> {
  // Upload do arquivo
  const uploadResult = await uploadFileToSupabase(pdfBuffer, fileName, userId);
  if (!uploadResult) {
    throw new Error('Falha ao fazer upload do arquivo');
  }

  // Extrair texto
  const extractedText = await extractTextFromPDF(pdfBuffer);

  return {
    ...uploadResult,
    extractedText,
  };
}
