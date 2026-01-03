import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";

// Mock do invokeLLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(async (params: any) => {
    // Se for análise do produto
    if (params.response_format?.json_schema?.name === "product_analysis") {
      return {
        choices: [
          {
            message: {
              content: JSON.stringify({
                productName: "Software de Gestão Empresarial",
                targetAudience: "Pequenos empresários e gestores",
                mainPain: "Dificuldade em controlar fluxo de caixa e documentos",
                mainBenefit: "Automação completa de processos administrativos",
                centralPromise: "Economize 10 horas por semana em tarefas administrativas",
                communicationTone: "Profissional",
              }),
            },
          },
        ],
      };
    }

    // Se for geração de copy
    return {
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
    };
  }),
}));

describe("creative.analyzeProduct", () => {
  it("should analyze product from content and generate creative", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.creative.analyzeProduct({
      content: "Software de gestão para pequenas empresas...",
      sourceType: "link",
      sourceUrl: "https://exemplo.com/produto",
    });

    expect(result).toBeDefined();
    expect(result.productName).toBeTruthy();
    expect(result.targetAudience).toBeTruthy();
    expect(result.mainPain).toBeTruthy();
    expect(result.mainBenefit).toBeTruthy();
    expect(result.centralPromise).toBeTruthy();
    expect(result.communicationTone).toBeTruthy();
    expect(result.headline).toBeTruthy();
    expect(result.textoAnuncio).toBeTruthy();
    expect(result.cta).toBeTruthy();
    expect(result.anguloEmocional).toBeTruthy();
    expect(result.ideiaCreativo).toBeTruthy();
  });

  it("should extract product analysis correctly", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.creative.analyzeProduct({
      content: "Produto de e-commerce com descrição...",
      sourceType: "file",
    });

    expect(result.productName).toContain("Software");
    expect(result.targetAudience).toContain("empresários");
    expect(result.communicationTone).toBe("Profissional");
  });

  it("should reject invalid input - empty content", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    try {
      await caller.creative.analyzeProduct({
        content: "",
        sourceType: "link",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("obrigatório");
    }
  });

  it("should reject invalid sourceType", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    try {
      await caller.creative.analyzeProduct({
        content: "Conteúdo do produto",
        sourceType: "invalid" as any,
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });

  it("should generate complete creative with all sections", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.creative.analyzeProduct({
      content: "Descrição completa do produto...",
      sourceType: "file",
    });

    expect(result.headline).toContain("Transforme");
    expect(result.cta).toContain("teste grátis");
    expect(result.anguloEmocional).toContain("Alívio");
  });
});
