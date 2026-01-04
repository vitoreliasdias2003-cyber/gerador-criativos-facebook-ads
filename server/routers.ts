import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { saveCreative, getUserCreatives, saveProduct } from "./db";
import { extractContentFromUrl, extractContentFromFile } from "./_core/contentExtractor";

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
        // CAMADA 1 - MOTOR DE ANÁLISE
        let extracted;
        if (input.sourceType === "link" && input.sourceUrl) {
          extracted = await extractContentFromUrl(input.sourceUrl);
        } else if (input.sourceType === "file" && input.fileContent && input.fileType) {
          extracted = await extractContentFromFile(Buffer.from(input.fileContent, 'base64'), input.fileType);
        } else {
          throw new Error("Fonte inválida.");
        }

        if (!extracted.isSufficient) {
          throw new Error("Dados insuficientes na fonte fornecida.");
        }

        const analysisPrompt = `Analista Semântico Sênior. Extraia a estrutura REAL da oferta:
Conteúdo: ${extracted.fullText}
Responda em JSON: productName, targetAudience, mainPain, mainBenefit, centralPromise, communicationTone.
REGRAS: ❌ NÃO INVENTE. ❌ SEM CONTEÚDO GENÉRICO.`;

        const analysisResponse = await invokeLLM({
          messages: [
            { role: "system", content: "Analista de marketing. Responda apenas JSON válido." },
            { role: "user", content: analysisPrompt }
          ],
          response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(typeof analysisResponse.choices[0]?.message?.content === 'string' ? analysisResponse.choices[0]?.message?.content : "{}");

        if (!analysis.productName || !analysis.targetAudience) {
          throw new Error("Não foi possível identificar o produto ou público.");
        }

        // Gerar Copy baseada na análise
        const copyPrompt = `Copywriter Sênior. Crie anúncio para:
Produto: ${analysis.productName}
Público: ${analysis.targetAudience}
Dor: ${analysis.mainPain}
Promessa: ${analysis.centralPromise}

Formato:
HEADLINE: (impactante)
TEXTO DO ANÚNCIO: (até 3 parágrafos)
CTA: (chamada clara)
ÂNGULO EMOCIONAL: (emoção principal)
IDEIA DE CRIATIVO: (briefing visual)`;

        const copyResponse = await invokeLLM({
          messages: [
            { role: "system", content: "Especialista em copywriting. Responda apenas no formato solicitado." },
            { role: "user", content: copyPrompt }
          ]
        });

        const copyContent = typeof copyResponse.choices[0]?.message?.content === 'string' ? copyResponse.choices[0]?.message?.content : "";
        const headlineMatch = copyContent.match(/HEADLINE:\s*\n([^\n]+(?:\n(?!TEXTO DO ANÚNCIO:)[^\n]*)*)/i);
        const textoMatch = copyContent.match(/TEXTO DO ANÚNCIO:\s*\n([^\n]+(?:\n(?!CTA:)[^\n]*)*)/i);
        const ctaMatch = copyContent.match(/CTA:\s*\n([^\n]+(?:\n(?!ÂNGULO EMOCIONAL:)[^\n]*)*)/i);
        const anguloMatch = copyContent.match(/ÂNGULO EMOCIONAL:\s*\n([^\n]+(?:\n(?!IDEIA DE CRIATIVO:)[^\n]*)*)/i);
        const ideiaMatch = copyContent.match(/IDEIA DE CRIATIVO:\s*\n([^\n]+(?:\n|$)*)/i);

        return {
          ...analysis,
          headline: headlineMatch?.[1]?.trim() || "",
          textoAnuncio: textoMatch?.[1]?.trim() || "",
          cta: ctaMatch?.[1]?.trim() || "",
          anguloEmocional: anguloMatch?.[1]?.trim() || "",
          ideiaCreativo: ideiaMatch?.[1]?.trim() || "",
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
