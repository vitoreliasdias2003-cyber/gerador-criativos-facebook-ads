import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { saveCreative, getUserCreatives } from "./db";

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
  }),
});

export type AppRouter = typeof appRouter;
