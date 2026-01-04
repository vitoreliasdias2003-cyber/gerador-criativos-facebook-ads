/**
 * Content extraction helper for analyzing product links and files
 * Extracts real content from URLs and PDFs for accurate product analysis
 */

export interface ExtractedContent {
  title: string;
  description: string;
  fullText: string;
  metaTags: Record<string, string>;
  headings: string[];
  bullets: string[];
  prices: string[];
  ctas: string[];
  isSufficient: boolean;
}

/**
 * Extract content from a URL using fetch and HTML parsing
 */
export async function extractContentFromUrl(url: string): Promise<ExtractedContent> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    const title = extractTitle(html);
    const description = extractDescription(html);
    const fullText = extractTextContent(html);
    const headings = extractHeadings(html);
    const bullets = extractBullets(html);
    const prices = extractPrices(html);
    const ctas = extractCTAs(html);

    // VALIDAÇÃO CRÍTICA DE SUFICIÊNCIA
    const isSufficient = (title.length > 5 && (fullText.length > 300 || headings.length >= 2));

    return {
      title,
      description,
      fullText,
      metaTags: extractMetaTags(html),
      headings,
      bullets,
      prices,
      ctas,
      isSufficient,
    };
  } catch (error) {
    console.error('[Content Extractor] Error:', error);
    return { title: '', description: '', fullText: '', metaTags: {}, headings: [], bullets: [], prices: [], ctas: [], isSufficient: false };
  }
}

function extractTitle(html: string): string {
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  if (ogTitleMatch) return cleanText(ogTitleMatch[1]);
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) return cleanText(titleMatch[1]);
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return cleanText(h1Match[1]);
  return '';
}

function extractDescription(html: string): string {
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  if (ogDescMatch) return cleanText(ogDescMatch[1]);
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (metaDescMatch) return cleanText(metaDescMatch[1]);
  return '';
}

function extractMetaTags(html: string): Record<string, string> {
  const metaTags: Record<string, string> = {};
  const metaRegex = /<meta[^>]*(?:name|property)=["']([^"']+)["'][^>]*content=["']([^"']+)["']/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    metaTags[match[1]] = cleanText(match[2]);
  }
  return metaTags;
}

function extractHeadings(html: string): string[] {
  const headings: string[] = [];
  const headingRegex = /<h[1-3][^>]*>([^<]+)<\/h[1-3]>/gi;
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const heading = cleanText(match[1]);
    if (heading && heading.length > 3) headings.push(heading);
  }
  return headings;
}

function extractBullets(html: string): string[] {
  const bullets: string[] = [];
  const bulletRegex = /<li[^>]*>([^<]+)<\/li>/gi;
  let match;
  while ((match = bulletRegex.exec(html)) !== null) {
    const bullet = cleanText(match[1]);
    if (bullet && bullet.length > 5) bullets.push(bullet);
  }
  return bullets.slice(0, 20);
}

function extractTextContent(html: string): string {
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/\s+/g, ' ').trim();
  return text.substring(0, 5000);
}

function extractPrices(html: string): string[] {
  const prices: string[] = [];
  const priceRegex = /R\$\s?\d{1,3}(\.\d{3})*(,\d{2})?/g;
  let match;
  while ((match = priceRegex.exec(html)) !== null) {
    prices.push(match[0]);
  }
  return Array.from(new Set(prices));
}

function extractCTAs(html: string): string[] {
  const ctas: string[] = [];
  const ctaRegex = /<(?:button|a)[^>]*>([^<]{3,30})<\/(?:button|a)>/gi;
  let match;
  while ((match = ctaRegex.exec(html)) !== null) {
    const text = cleanText(match[1]);
    if (text.length > 3 && /comprar|assinar|quero|obter|acesso|inscrever|garantir|vaga/i.test(text)) {
      ctas.push(text);
    }
  }
  return Array.from(new Set(ctas));
}

function cleanText(text: string): string {
  return text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
}

// NOTA: Esta função foi substituída por pdfExtractor.ts que usa pdftotext
export async function extractContentFromPDF(buffer: Buffer): Promise<ExtractedContent> {
  try {
    // const pdfParseModule = await import('pdf-parse') as any;
    // const pdfParse = pdfParseModule.default || pdfParseModule;
    // const data = await pdfParse(buffer);
    const fullText: string = ''; // buffer.toString('utf-8').trim();
    
    if (!fullText || fullText.length < 150) {
      return { title: '', description: '', fullText: '', metaTags: {}, headings: [], bullets: [], prices: [], ctas: [], isSufficient: false };
    }
    
    const lines = fullText.split('\n').filter((line: string) => line.trim().length > 0);
    return {
      title: lines[0]?.substring(0, 100) || 'Documento PDF',
      description: lines[1]?.substring(0, 200) || '',
      fullText: fullText.substring(0, 5000),
      metaTags: {},
      headings: lines.filter((line: string) => line.length > 5 && line.length < 100 && line === line.toUpperCase()).slice(0, 10),
      bullets: lines.filter((line: string) => /^[\-\•\*\→]/.test(line.trim())).map((line: string) => line.replace(/^[\-\•\*\→]\s*/, '').trim()).slice(0, 20),
      prices: extractPrices(fullText),
      ctas: lines.filter((line: string) => /comprar|assinar|quero|obter|acesso|inscrever|garantir|vaga/i.test(line)).slice(0, 5),
      isSufficient: true
    };
  } catch (error) {
    console.error('[PDF Extractor] Error:', error);
    return { title: '', description: '', fullText: '', metaTags: {}, headings: [], bullets: [], prices: [], ctas: [], isSufficient: false };
  }
}

export async function extractContentFromFile(fileContent: string | Buffer, fileType: string): Promise<ExtractedContent> {
  if (fileType === 'application/pdf' || fileType.includes('pdf')) {
    const buffer = Buffer.isBuffer(fileContent) ? fileContent : Buffer.from(fileContent, 'base64');
    return extractContentFromPDF(buffer);
  }
  const fullText = typeof fileContent === 'string' ? fileContent : fileContent.toString('utf-8');
  return { title: 'Arquivo enviado', description: '', fullText: fullText.substring(0, 5000), metaTags: {}, headings: [], bullets: [], prices: [], ctas: [], isSufficient: fullText.length > 200 };
}
