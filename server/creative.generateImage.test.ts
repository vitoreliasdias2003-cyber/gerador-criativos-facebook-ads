import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";

// Mock do generateImage
vi.mock("./_core/imageGeneration", () => ({
  generateImage: vi.fn(async () => ({
    url: "https://example.com/generated-image.png",
  })),
}));

describe("creative.generateImage", () => {
  it("should generate an image with valid input", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.creative.generateImage({
      nicho: "Software de gestão",
      publico: "Pequenos empresários",
      objetivo: "Vendas",
      tom: "Profissional",
      headline: "Transforme sua gestão em 30 dias",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.url).toBeTruthy();
    expect(result.url).toContain("http");
  });

  it("should reject invalid input - missing headline", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    try {
      await caller.creative.generateImage({
        nicho: "Software",
        publico: "Público",
        objetivo: "Vendas",
        tom: "Profissional",
        headline: "",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });

  it("should reject invalid objetivo enum", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    try {
      await caller.creative.generateImage({
        nicho: "Software",
        publico: "Público",
        objetivo: "InvalidOption" as any,
        tom: "Profissional",
        headline: "Headline",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });

  it("should reject invalid tom enum", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    try {
      await caller.creative.generateImage({
        nicho: "Software",
        publico: "Público",
        objetivo: "Vendas",
        tom: "InvalidTom" as any,
        headline: "Headline",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });

  it("should include all context fields in the prompt", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.creative.generateImage({
      nicho: "E-commerce",
      publico: "Mulheres 25-45",
      objetivo: "Leads",
      tom: "Emocional",
      headline: "Descubra a moda que transforma",
    });

    expect(result.success).toBe(true);
    expect(result.url).toBeTruthy();
  });
});
