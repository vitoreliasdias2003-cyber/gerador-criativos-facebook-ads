import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nwalpywjrvwaevudloyw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53YWxweXdqcnZ3YWV2dWRsb3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NjYyOTUsImV4cCI6MjA4MzE0MjI5NX0.p6ASENt0bZJubr06XtKys138gzpGZA77ygCMTIcCsQU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export type UserProfile = {
  id: string;
  email: string;
  plano: 'free' | 'pro' | 'premium';
  created_at: string;
};

export type Copy = {
  id: string;
  user_id: string;
  produto_nome: string;
  tipo_copy: 'curta' | 'longa' | 'headline' | 'anuncio';
  conteudo: string;
  created_at: string;
};

export type Creative = {
  id: string;
  user_id: string;
  produto_nome: string;
  image_url?: string;
  prompt_usado?: string;
  headline?: string;
  texto_anuncio?: string;
  cta?: string;
  angulo_emocional?: string;
  ideia_criativo?: string;
  nicho?: string;
  publico?: string;
  objetivo?: string;
  consciencia?: string;
  tom?: string;
  created_at: string;
};

export type Product = {
  id: string;
  user_id: string;
  product_name: string;
  source_url?: string;
  source_type: 'link' | 'pdf' | 'manual';
  target_audience?: string;
  main_pain?: string;
  main_benefit?: string;
  central_promise?: string;
  communication_tone?: string;
  extracted_content?: string;
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  nome_projeto: string;
  descricao?: string;
  created_at: string;
};
