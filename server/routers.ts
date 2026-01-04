import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { saveCreative, getUserCreatives, saveProduct } from "./db";
import { extractContentFromUrl, extractContentFromFile } from "./_core/contentExtractor";
import { scrapeLandingPage, analyzeScrapedData } from "./_core/webScraper";
import { analyzeProductFromData, generateCopyFromAnalysis, generateCreativeBriefing } from "./_core/productAnalyzer";
import { processPDFUpload } from "./_core/pdfExtractor";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  creative: router({
    generate: publicProcedure
      .input(z.object({
        nicho: z.string().min(1),
        publico: z.string().min(1),
        objetivo: z.enum(["Vendas", "Leads", "WhatsApp"]),
        consciencia: z.enum(["Frio", "Morno", "Quente"]),
        tom: z.enum(["Emocional", "Profissional", "Direto", "Urgente"]),
      }))
      .mutation(async ({ input }) => {
        // CAMADA 2 - MOTOR DE COPY
        const prompt = `Você é um COPYWRITER SÊNIOR. Crie um anúncio real para:
Nicho: ${input.nicho}
Público: ${input.publico}
Objetivo: ${input.objetivo}
Tom: ${input.tom}

REGRAS: ❌ SEM CONTEÚDO GENÉRICO. ❌ NÃO INVENTE BENEFÍCIOS.

Formato:
HEADLINE: (impactante)
TEXTO DO ANÚNCIO: (até 3 parágrafos)
CTA: (chamada clara)
ÂNGULO EMOCIONAL: (emoção principal)
IDEIA DE CRIATIVO: (briefing visual)`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Especialista em copywriting. Responda apenas no formato solicitado." },
            { role: "user", content: prompt }
          ]
        });

        const content = typeof response.choices[0]?.message?.content === 'string' ? response.choices[0]?.message?.content : "";
        const headlineMatch = content.match(/HEADLINE:\s*\n([^\n]+(?:\n(?!TEXTO DO ANÚNCIO:)[^\n]*)*)/i);
        const textoMatch = content.match(/TEXTO DO ANÚNCIO:\s*\n([^\n]+(?:\n(?!CTA:)[^\n]*)*)/i);
        const ctaMatch = content.match(/CTA:\s*\n([^\n]+(?:\n(?!ÂNGULO EMOCIONAL:)[^\n]*)*)/i);
        const anguloMatch = content.match(/ÂNGULO EMOCIONAL:\s*\n([^\n]+(?:\n(?!IDEIA DE CRIATIVO:)[^\n]*)*)/i);
        const ideiaMatch = content.match(/IDEIA DE CRIATIVO:\s*\n([^\n]+(?:\n|$)*)/i);

        return {
          headline: headlineMatch?.[1]?.trim() || "",
          textoAnuncio: textoMatch?.[1]?.trim() || "",
          cta: ctaMatch?.[1]?.trim() || "",
          anguloEmocional: anguloMatch?.[1]?.trim() || "",
          ideiaCreativo: ideiaMatch?.[1]?.trim() || "",
        };
      }),

    generateImage: publicProcedure
      .input(z.object({
        produto: z.string().min(1),
        publico: z.string().min(1),
        headline: z.string().optional(),
        estilo: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // CAMADA 3 - MOTOR DE CRIATIVO
        const imagePrompt = `Diretor de Arte Sênior. Briefing visual premium:
Produto: ${input.produto}
Público: ${input.publico}
Estilo: Fotografia comercial High-end, 8k, iluminação cinematográfica.
PROIBIDO: Textos, logos, aparência de IA barata.`;

        const result = await generateImage({ prompt: imagePrompt });
        return { url: result.url, success: true };
      }),

    analyzeProduct: publicProcedure
      .input(z.object({
        sourceType: z.enum(["link", "file"]),
        sourceUrl: z.string().optional(),
        fileContent: z.string().optional(),
        fileType: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // CAMADA 1 - MOTOR DE ANÁLISE (NOVO - USA SCRAPING REAL)
        let extractedContent: string;

        if (input.sourceType === "link" && input.sourceUrl) {
          // Scraping real da landing page
          const scrapedData = await scrapeLandingPage(input.sourceUrl);
          const analyzed = analyzeScrapedData(scrapedData);
          
          // Montar conteúdo estruturado
          extractedContent = `
Nome do Produto: ${analyzed.productName}
Headline Principal: ${analyzed.mainHeadline}
Descrição: ${analyzed.description}
Benefícios: ${analyzed.keyBenefits.join(', ')}
CTAs: ${analyzed.callsToAction.join(', ')}
Preços: ${analyzed.pricing.join(', ')}
Conteúdo completo: ${scrapedData.allText}
          `.trim();
        } else if (input.sourceType === "file" && input.fileContent && input.fileType) {
          // Extração de PDF (será implementado)
          extractedContent = Buffer.from(input.fileContent, 'base64').toString('utf-8');
        } else {
          throw new Error("Fonte inválida. Forneça uma URL ou arquivo.");
        }

        // Análise do produto com IA
        const sourceTypeForAnalysis = input.sourceType === 'file' ? 'pdf' : 'link';
        const analysis = await analyzeProductFromData(
          sourceTypeForAnalysis,
          extractedContent
        );

        // CAMADA 2 - GERAÇÃO DE COPY
        const headline = await generateCopyFromAnalysis(analysis, 'headline', 'Conversão');
        const textoAnuncio = await generateCopyFromAnalysis(analysis, 'anuncio', 'Conversão');
        const cta = await generateCopyFromAnalysis(analysis, 'cta', 'Conversão');

        // CAMADA 3 - BRIEFING DE CRIATIVO
        const ideiaCreativo = await generateCreativeBriefing(analysis);

        return {
          ...analysis,
          headline,
          textoAnuncio,
          cta,
          anguloEmocional: analysis.mainPain,
          ideiaCreativo,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
