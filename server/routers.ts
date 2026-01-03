import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { saveCreative, getUserCreatives, saveProduct } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  creative: router({
    generate: publicProcedure
      .input(
        z.object({
          nicho: z.string().min(1, "Nicho é obrigatório"),
          publico: z.string().min(1, "Público-alvo é obrigatório"),
          objetivo: z.enum(["Vendas", "Leads", "WhatsApp"]),
          consciencia: z.enum(["Frio", "Morno", "Quente"]),
          tom: z.enum(["Emocional", "Profissional", "Direto", "Urgente"]),
        })
      )
      .mutation(async ({ input }) => {
        const prompt = `Você é um especialista em Facebook Ads com mais de 10 anos de experiência.

Crie UM anúncio persuasivo com base nas informações abaixo:

Nicho do produto: ${input.nicho}
Público-alvo: ${input.publico}
Objetivo do anúncio: ${input.objetivo}
Nível de consciência: ${input.consciencia}
Tom da comunicação: ${input.tom}

Regras:
- Linguagem simples e direta
- Não usar palavras proibidas pelo Facebook
- Não prometer ganhos ou resultados irreais
- Focar em dor, solução e ação

Entregue EXATAMENTE neste formato:

HEADLINE:
(escreva uma headline curta e impactante)

TEXTO DO ANÚNCIO:
(escreva até 3 parágrafos curtos)

CTA:
(chamada clara para ação)

ÂNGULO EMOCIONAL:
(emoção principal explorada)

IDEIA DE CRIATIVO:
(descreva uma ideia de imagem ou vídeo)`;

        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "Você é um especialista em copywriting para Facebook Ads. Sempre responda no formato exato solicitado.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          });

          const content = typeof response.choices[0]?.message?.content === 'string' 
            ? response.choices[0]?.message?.content 
            : "";

          // Parse da resposta
          const headlineMatch = content.match(/HEADLINE:\s*\n([^\n]+(?:\n(?!TEXTO DO ANÚNCIO:)[^\n]*)*)/i);
          const textoMatch = content.match(/TEXTO DO ANÚNCIO:\s*\n([^\n]+(?:\n(?!CTA:)[^\n]*)*)/i);
          const ctaMatch = content.match(/CTA:\s*\n([^\n]+(?:\n(?!ÂNGULO EMOCIONAL:)[^\n]*)*)/i);
          const anguloMatch = content.match(/ÂNGULO EMOCIONAL:\s*\n([^\n]+(?:\n(?!IDEIA DE CRIATIVO:)[^\n]*)*)/i);
          const ideiaMatch = content.match(/IDEIA DE CRIATIVO:\s*\n([^\n]+(?:\n|$)*)/i);

          const headline = headlineMatch?.[1]?.trim() || "";
          const textoAnuncio = textoMatch?.[1]?.trim() || "";
          const cta = ctaMatch?.[1]?.trim() || "";
          const anguloEmocional = anguloMatch?.[1]?.trim() || "";
          const ideiaCreativo = ideiaMatch?.[1]?.trim() || "";

          return {
            headline,
            textoAnuncio,
            cta,
            anguloEmocional,
            ideiaCreativo,
          };
        } catch (error) {
          console.error("[LLM] Error generating creative:", error);
          throw new Error("Erro ao gerar criativo. Tente novamente.");
        }
      }),

    generateImage: publicProcedure
      .input(
        z.object({
          nicho: z.string().min(1),
          publico: z.string().min(1),
          objetivo: z.enum(["Vendas", "Leads", "WhatsApp"]),
          tom: z.enum(["Emocional", "Profissional", "Direto", "Urgente"]),
          headline: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const imagePrompt = `Crie uma imagem publicitária realista e de alta conversão para Facebook e Instagram Ads.

Contexto do anúncio:
- Nicho: ${input.nicho}
- Público-alvo: ${input.publico}
- Objetivo: ${input.objetivo}
- Tom: ${input.tom}

Mensagem principal do anúncio:
${input.headline}

Estilo da imagem:
- Visual profissional
- Alto impacto
- Estilo publicitário
- Sem textos longos na imagem

Formato:
- 1:1 (quadrado)
- Alta qualidade
- Fundo limpo ou desfocado
- Elemento visual central claro

Não adicionar texto excessivo.
A imagem deve comunicar a ideia principal do anúncio visualmente.`;

        try {
          const result = await generateImage({
            prompt: imagePrompt,
          });

          return {
            url: result.url,
            success: true,
          };
        } catch (error) {
          console.error("[Image Generation] Error:", error);
          throw new Error("Erro ao gerar imagem. Tente novamente.");
        }
      }),

    analyzeProduct: publicProcedure
      .input(
        z.object({
          content: z.string().min(1, "Conteúdo do produto é obrigatório"),
          sourceType: z.enum(["link", "file"]),
          sourceUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const analysisPrompt = `Você é um especialista em marketing digital e copywriting.

Analise o conteúdo abaixo e extraia:
- Qual produto está sendo vendido
- Para quem é o produto
- Principal dor do público
- Principal benefício
- Promessa central
- Tom de comunicação ideal

Conteúdo do produto:
${input.content}

Responda em formato JSON com as chaves: productName, targetAudience, mainPain, mainBenefit, centralPromise, communicationTone`;

        try {
          const analysisResponse = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "Você é um especialista em marketing digital. Sempre responda em formato JSON válido.",
              },
              {
                role: "user",
                content: analysisPrompt,
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "product_analysis",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    productName: { type: "string" },
                    targetAudience: { type: "string" },
                    mainPain: { type: "string" },
                    mainBenefit: { type: "string" },
                    centralPromise: { type: "string" },
                    communicationTone: { type: "string" },
                  },
                  required: ["productName", "targetAudience", "mainPain", "mainBenefit", "centralPromise", "communicationTone"],
                  additionalProperties: false,
                },
              },
            },
          });

          const analysisContent = typeof analysisResponse.choices[0]?.message?.content === 'string'
            ? analysisResponse.choices[0]?.message?.content
            : "";

          const analysis = JSON.parse(analysisContent);

          // Gerar copy do anúncio com base na análise
          const copyPrompt = `Você é um especialista em Facebook Ads.

Com base no perfil do produto abaixo, crie UM anúncio completo.

Perfil do produto:
- Produto: ${analysis.productName}
- Público-alvo: ${analysis.targetAudience}
- Dor principal: ${analysis.mainPain}
- Benefício principal: ${analysis.mainBenefit}
- Promessa central: ${analysis.centralPromise}
- Tom: ${analysis.communicationTone}

Regras:
- Linguagem simples
- Não prometer ganhos irreais
- Compatível com políticas do Facebook

Entregue EXATAMENTE neste formato:

HEADLINE:
(headline curta e impactante)

TEXTO DO ANÚNCIO:
(até 3 parágrafos curtos)

CTA:
(chamada clara para ação)

ÂNGULO EMOCIONAL:
(emoção principal explorada)

IDEIA DE CRIATIVO:
(descreva uma ideia de imagem ou vídeo)`;

          const copyResponse = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "Você é um especialista em copywriting para Facebook Ads. Sempre responda no formato exato solicitado.",
              },
              {
                role: "user",
                content: copyPrompt,
              },
            ],
          });

          const copyContent = typeof copyResponse.choices[0]?.message?.content === 'string'
            ? copyResponse.choices[0]?.message?.content
            : "";

          // Parse da resposta
          const headlineMatch = copyContent.match(/HEADLINE:\s*\n([^\n]+(?:\n(?!TEXTO DO ANÚNCIO:)[^\n]*)*)/i);
          const textoMatch = copyContent.match(/TEXTO DO ANÚNCIO:\s*\n([^\n]+(?:\n(?!CTA:)[^\n]*)*)/i);
          const ctaMatch = copyContent.match(/CTA:\s*\n([^\n]+(?:\n(?!ÂNGULO EMOCIONAL:)[^\n]*)*)/i);
          const anguloMatch = copyContent.match(/ÂNGULO EMOCIONAL:\s*\n([^\n]+(?:\n(?!IDEIA DE CRIATIVO:)[^\n]*)*)/i);
          const ideiaMatch = copyContent.match(/IDEIA DE CRIATIVO:\s*\n([^\n]+(?:\n|$)*)/i);

          return {
            productName: analysis.productName,
            targetAudience: analysis.targetAudience,
            mainPain: analysis.mainPain,
            mainBenefit: analysis.mainBenefit,
            centralPromise: analysis.centralPromise,
            communicationTone: analysis.communicationTone,
            headline: headlineMatch?.[1]?.trim() || "",
            textoAnuncio: textoMatch?.[1]?.trim() || "",
            cta: ctaMatch?.[1]?.trim() || "",
            anguloEmocional: anguloMatch?.[1]?.trim() || "",
            ideiaCreativo: ideiaMatch?.[1]?.trim() || "",
          };
        } catch (error) {
          console.error("[Product Analysis] Error:", error);
          throw new Error("Erro ao analisar produto. Tente novamente.");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
