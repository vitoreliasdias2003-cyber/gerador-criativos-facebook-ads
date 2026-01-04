import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedData {
  url: string;
  title: string;
  metaDescription: string;
  h1: string[];
  h2: string[];
  h3: string[];
  paragraphs: string[];
  ctas: string[];
  prices: string[];
  images: string[];
  allText: string;
}

/**
 * Faz scraping de uma landing page e extrai informações estruturadas
 */
export async function scrapeLandingPage(url: string): Promise<ScrapedData> {
  try {
    // Validar URL
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('URL inválida. Use http:// ou https://');
    }

    // Fazer requisição HTTP
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      timeout: 15000,
      maxRedirects: 5,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remover scripts e styles
    $('script, style, noscript, iframe').remove();

    // Extrair title
    const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';

    // Extrair meta description
    const metaDescription = 
      $('meta[name="description"]').attr('content') || 
      $('meta[property="og:description"]').attr('content') || 
      '';

    // Extrair headings
    const h1: string[] = [];
    $('h1').each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1.push(text);
    });

    const h2: string[] = [];
    $('h2').each((_, el) => {
      const text = $(el).text().trim();
      if (text) h2.push(text);
    });

    const h3: string[] = [];
    $('h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text) h3.push(text);
    });

    // Extrair parágrafos
    const paragraphs: string[] = [];
    $('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 20) {
        paragraphs.push(text);
      }
    });

    // Extrair CTAs (botões e links com texto de ação)
    const ctas: string[] = [];
    const ctaSelectors = [
      'button',
      'a.btn',
      'a.button',
      '[class*="cta"]',
      '[class*="call-to-action"]',
      'a[href*="checkout"]',
      'a[href*="comprar"]',
      'a[href*="buy"]',
      'a[href*="cadastro"]',
      'a[href*="signup"]',
    ];

    ctaSelectors.forEach((selector) => {
      $(selector).each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length < 100 && !ctas.includes(text)) {
          ctas.push(text);
        }
      });
    });

    // Extrair preços (padrões brasileiros e internacionais)
    const prices: string[] = [];
    const pricePatterns = [
      /R\$\s*\d+[.,]?\d*/gi,
      /\$\s*\d+[.,]?\d*/gi,
      /\d+[.,]\d{2}\s*(reais|real)/gi,
    ];

    const bodyText = $('body').text();
    pricePatterns.forEach((pattern) => {
      const matches = bodyText.match(pattern);
      if (matches) {
        matches.forEach((price) => {
          if (!prices.includes(price)) {
            prices.push(price);
          }
        });
      }
    });

    // Extrair imagens principais
    const images: string[] = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && !src.startsWith('data:')) {
        try {
          const imgUrl = new URL(src, url).href;
          if (!images.includes(imgUrl)) {
            images.push(imgUrl);
          }
        } catch {
          // Ignorar URLs inválidas
        }
      }
    });

    // Extrair todo o texto visível
    const allText = $('body').text()
      .replace(/\s+/g, ' ')
      .trim();

    // Validar se há dados suficientes
    if (!title && h1.length === 0 && paragraphs.length === 0) {
      throw new Error('Não foi possível extrair informações suficientes da página. Verifique se a URL está correta e acessível.');
    }

    return {
      url,
      title,
      metaDescription,
      h1,
      h2,
      h3,
      paragraphs: paragraphs.slice(0, 20), // Limitar a 20 parágrafos
      ctas: ctas.slice(0, 10),
      prices: prices.slice(0, 10),
      images: images.slice(0, 5),
      allText: allText.substring(0, 5000), // Limitar a 5000 caracteres
    };
  } catch (error: any) {
    if (error.code === 'ENOTFOUND') {
      throw new Error('URL não encontrada. Verifique se o endereço está correto.');
    }
    if (error.code === 'ETIMEDOUT') {
      throw new Error('Tempo limite excedido ao acessar a página.');
    }
    if (error.response?.status === 403) {
      throw new Error('Acesso negado pela página. Ela pode estar protegida contra scraping.');
    }
    if (error.response?.status === 404) {
      throw new Error('Página não encontrada (404).');
    }

    throw new Error(`Erro ao acessar a página: ${error.message}`);
  }
}

/**
 * Analisa os dados extraídos e retorna informações estruturadas do produto
 */
export function analyzeScrapedData(data: ScrapedData): {
  productName: string;
  mainHeadline: string;
  description: string;
  keyBenefits: string[];
  callsToAction: string[];
  pricing: string[];
} {
  return {
    productName: data.title || data.h1[0] || 'Produto',
    mainHeadline: data.h1[0] || data.title || '',
    description: data.metaDescription || data.paragraphs[0] || '',
    keyBenefits: [
      ...data.h2.slice(0, 3),
      ...data.paragraphs.slice(0, 2),
    ],
    callsToAction: data.ctas,
    pricing: data.prices,
  };
}
