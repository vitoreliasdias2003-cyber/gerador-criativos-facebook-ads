import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";

// Mock do invokeLLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({
    choices: [
      {
        message: {
          content: `HEADLINE:
Transforme sua gestão em 30 dias

TEXTO DO ANÚNCIO:
Cansado de perder tempo com planilhas? Nosso software automatiza tudo.
Pequenos empresários já economizam 10 horas por semana.
Comece agora e veja a diferença.

CTA:
Comece seu teste grátis

ÂNGULO EMOCIONAL:
Alívio e eficiência

IDEIA DE CRIATIVO:
Vídeo mostrando antes e depois de um empresário usando o software`,
        },
      },
    ],
  })),
}));

describe("creative.generate", () => {
  it("should generate a creative with valid input", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.creative.generate({
      nicho: "Software de gestão",
      publico: "Pequenos empresários",
      objetivo: "Vendas",
      consciencia: "Frio",
      tom: "Profissional",
    });

    expect(result).toBeDefined();
    expect(result.headline).toBeTruthy();
    expect(result.textoAnuncio).toBeTruthy();
    expect(result.cta).toBeTruthy();
    expect(result.anguloEmocional).toBeTruthy();
    expect(result.ideiaCreativo).toBeTruthy();
  });

  it("should return parsed content in correct format", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.creative.generate({
      nicho: "E-commerce",
      publico: "Mulheres 25-45",
      objetivo: "Leads",
      consciencia: "Morno",
      tom: "Emocional",
    });

    expect(result.headline).toContain("Transforme");
    expect(result.cta).toContain("teste grátis");
    expect(result.anguloEmocional).toContain("Alívio");
  });

  it("should reject invalid input - missing nicho", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    try {
      await caller.creative.generate({
        nicho: "",
        publico: "Público-alvo",
        objetivo: "Vendas",
        consciencia: "Frio",
        tom: "Profissional",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Nicho é obrigatório");
    }
  });

  it("should reject invalid input - invalid objetivo", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    try {
      await caller.creative.generate({
        nicho: "Nicho",
        publico: "Público",
        objetivo: "InvalidOption" as any,
        consciencia: "Frio",
        tom: "Profissional",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });
});
