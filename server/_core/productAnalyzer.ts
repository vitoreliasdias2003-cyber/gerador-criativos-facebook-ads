import { invokeLLM } from './llm';

export interface ProductAnalysis {
  productName: string;
  targetAudience: string;
  mainPain: string;
  mainBenefit: string;
  centralPromise: string;
  communicationTone: string;
  niche: string;
}

/**
 * CAMADA 1 - ANÁLISE
 * Analisa dados reais do produto (de link ou PDF) e retorna informações estruturadas
 */
export async function analyzeProductFromData(
  sourceType: 'link' | 'pdf',
  extractedContent: string
): Promise<ProductAnalysis> {
  // Validar se há conteúdo suficiente
  if (!extractedContent || extractedContent.trim().length < 50) {
    throw new Error(
      'Conteúdo insuficiente para análise. ' +
      (sourceType === 'pdf' 
        ? 'Verifique se o PDF contém texto legível (não apenas imagens).' 
        : 'Verifique se a URL está correta e acessível.')
    );
  }

  const prompt = `Você é um analista de marketing especializado em produtos digitais e físicos.

Analise o seguinte conteúdo extraído de ${sourceType === 'pdf' ? 'um PDF' : 'uma landing page'} e retorne APENAS informações REAIS encontradas no conteúdo.

CONTEÚDO:
${extractedContent.substring(0, 4000)}

INSTRUÇÕES CRÍTICAS:
- NÃO invente ou assuma informações
- NÃO use exemplos genéricos
- Se não houver informação clara sobre algum campo, retorne "Não identificado"
- Base sua análise EXCLUSIVAMENTE no conteúdo fornecido

Retorne um JSON com a seguinte estrutura:
{
  "productName": "Nome real do produto encontrado",
  "targetAudience": "Público-alvo identificado no conteúdo",
  "mainPain": "Principal dor/problema que o produto resolve (mencionado no conteúdo)",
  "mainBenefit": "Principal benefício oferecido (mencionado no conteúdo)",
  "centralPromise": "Promessa central do produto (extraída do conteúdo)",
  "communicationTone": "Tom de comunicação usado (formal/informal/técnico/emocional)",
  "niche": "Nicho/categoria do produto"
}`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'Você é um analista de marketing que extrai informações REAIS de conteúdo. Nunca invente dados.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      responseFormat: { type: 'json_object' },
    });

    const content = typeof response.choices[0]?.message?.content === 'string' 
      ? response.choices[0].message.content 
      : JSON.stringify(response.choices[0]?.message?.content);
    const analysis = JSON.parse(content);

    // Validar se a análise tem dados reais
    const hasRealData = 
      analysis.productName !== 'Não identificado' &&
      analysis.mainBenefit !== 'Não identificado';

    if (!hasRealData) {
      throw new Error(
        'Não foi possível identificar informações suficientes do produto. ' +
        'Verifique se o conteúdo fornecido contém informações claras sobre o produto.'
      );
    }

    return analysis;
  } catch (error: any) {
    console.error('Erro na análise do produto:', error);
    throw new Error(
      'Erro ao analisar o produto: ' + error.message
    );
  }
}

/**
 * CAMADA 2 - GERAÇÃO DE COPY
 * Gera copy profissional baseada APENAS em dados reais do produto
 */
export async function generateCopyFromAnalysis(
  analysis: ProductAnalysis,
  copyType: 'headline' | 'anuncio' | 'cta',
  objective: string
): Promise<string> {
  // Validar se há dados suficientes
  if (analysis.productName === 'Não identificado' || !analysis.mainBenefit) {
    throw new Error('Dados insuficientes para gerar copy. Análise do produto incompleta.');
  }

  const prompt = `Você é um copywriter profissional especializado em anúncios para Facebook Ads.

DADOS REAIS DO PRODUTO:
- Nome: ${analysis.productName}
- Público-alvo: ${analysis.targetAudience}
- Dor principal: ${analysis.mainPain}
- Benefício principal: ${analysis.mainBenefit}
- Promessa central: ${analysis.centralPromise}
- Tom de comunicação: ${analysis.communicationTone}
- Nicho: ${analysis.niche}

OBJETIVO: ${objective}

TIPO DE COPY: ${copyType}

INSTRUÇÕES CRÍTICAS:
- Use APENAS as informações reais fornecidas acima
- NÃO invente benefícios ou características
- NÃO use exemplos genéricos
- Seja específico e direto
- Mantenha o tom de comunicação identificado

${copyType === 'headline' ? 'Crie uma headline impactante (máximo 40 caracteres)' : ''}
${copyType === 'anuncio' ? 'Crie um texto de anúncio completo (100-150 palavras)' : ''}
${copyType === 'cta' ? 'Crie um CTA (call-to-action) poderoso (máximo 20 caracteres)' : ''}

Retorne APENAS o texto da copy, sem explicações ou comentários.`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'Você é um copywriter profissional que cria textos baseados em dados reais. Nunca invente informações.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = typeof response.choices[0]?.message?.content === 'string' 
      ? response.choices[0].message.content 
      : '';
    return content.trim();
  } catch (error: any) {
    console.error('Erro na geração de copy:', error);
    throw new Error('Erro ao gerar copy: ' + error.message);
  }
}

/**
 * CAMADA 3 - GERAÇÃO DE CRIATIVO (Briefing para imagem)
 * Cria briefing para geração de imagem baseado em dados reais
 */
export async function generateCreativeBriefing(
  analysis: ProductAnalysis
): Promise<string> {
  const prompt = `Você é um diretor de arte especializado em criativos para Facebook Ads.

DADOS REAIS DO PRODUTO:
- Nome: ${analysis.productName}
- Nicho: ${analysis.niche}
- Benefício principal: ${analysis.mainBenefit}
- Tom: ${analysis.communicationTone}

Crie um briefing PROFISSIONAL para geração de imagem que:
- Seja executivo e premium (NÃO pareça IA genérica)
- Represente o produto de forma realista
- Use elementos visuais adequados ao nicho
- Tenha aparência de anúncio profissional

Retorne APENAS o prompt para geração de imagem, sem explicações.
Máximo 200 caracteres.`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'Você é um diretor de arte que cria briefings para imagens profissionais.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = typeof response.choices[0]?.message?.content === 'string' 
      ? response.choices[0].message.content 
      : '';
    return content.trim();
  } catch (error: any) {
    console.error('Erro na geração de briefing:', error);
    throw new Error('Erro ao gerar briefing: ' + error.message);
  }
}
