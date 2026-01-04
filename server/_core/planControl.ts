import { TRPCError } from '@trpc/server';

export type Plan = 'free' | 'pro' | 'premium';

export interface PlanLimits {
  maxCreativesPerDay: number;
  maxCopiesPerDay: number;
  canUseAutomaticMode: boolean;
  canUploadPDF: boolean;
  canReadLinks: boolean;
  canGenerateImages: boolean;
  maxImagesPerDay: number;
}

/**
 * Limites por plano
 */
export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxCreativesPerDay: 5,
    maxCopiesPerDay: 10,
    canUseAutomaticMode: false,
    canUploadPDF: false,
    canReadLinks: false,
    canGenerateImages: true,
    maxImagesPerDay: 3,
  },
  pro: {
    maxCreativesPerDay: 50,
    maxCopiesPerDay: 100,
    canUseAutomaticMode: false,
    canUploadPDF: false,
    canReadLinks: false,
    canGenerateImages: true,
    maxImagesPerDay: 30,
  },
  premium: {
    maxCreativesPerDay: -1, // Ilimitado
    maxCopiesPerDay: -1, // Ilimitado
    canUseAutomaticMode: true,
    canUploadPDF: true,
    canReadLinks: true,
    canGenerateImages: true,
    maxImagesPerDay: -1, // Ilimitado
  },
};

/**
 * Verifica se o usuário tem permissão para usar uma funcionalidade
 */
export function checkPlanPermission(
  userPlan: Plan,
  feature: keyof PlanLimits
): boolean {
  const limits = PLAN_LIMITS[userPlan];
  const value = limits[feature];
  
  // Para booleanos, retornar direto
  if (typeof value === 'boolean') {
    return value;
  }
  
  // Para números, -1 significa ilimitado
  return value === -1 || value > 0;
}

/**
 * Lança erro se o usuário não tiver permissão
 */
export function requirePlanFeature(
  userPlan: Plan,
  feature: keyof PlanLimits,
  featureName: string
): void {
  if (!checkPlanPermission(userPlan, feature)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Esta funcionalidade (${featureName}) está disponível apenas para planos superiores. Faça upgrade para acessar!`,
    });
  }
}

/**
 * Verifica se o usuário atingiu o limite diário
 */
export async function checkDailyLimit(
  userId: string,
  userPlan: Plan,
  limitType: 'creatives' | 'copies' | 'images',
  currentCount: number
): Promise<boolean> {
  const limits = PLAN_LIMITS[userPlan];
  
  let maxLimit: number;
  switch (limitType) {
    case 'creatives':
      maxLimit = limits.maxCreativesPerDay;
      break;
    case 'copies':
      maxLimit = limits.maxCopiesPerDay;
      break;
    case 'images':
      maxLimit = limits.maxImagesPerDay;
      break;
  }
  
  // -1 significa ilimitado
  if (maxLimit === -1) {
    return true;
  }
  
  return currentCount < maxLimit;
}

/**
 * Lança erro se o usuário atingiu o limite diário
 */
export function requireDailyLimit(
  userPlan: Plan,
  limitType: 'creatives' | 'copies' | 'images',
  currentCount: number
): void {
  const limits = PLAN_LIMITS[userPlan];
  
  let maxLimit: number;
  let featureName: string;
  
  switch (limitType) {
    case 'creatives':
      maxLimit = limits.maxCreativesPerDay;
      featureName = 'criativos';
      break;
    case 'copies':
      maxLimit = limits.maxCopiesPerDay;
      featureName = 'copies';
      break;
    case 'images':
      maxLimit = limits.maxImagesPerDay;
      featureName = 'imagens';
      break;
  }
  
  // -1 significa ilimitado
  if (maxLimit === -1) {
    return;
  }
  
  if (currentCount >= maxLimit) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Você atingiu o limite diário de ${maxLimit} ${featureName} do plano ${userPlan.toUpperCase()}. Faça upgrade para continuar!`,
    });
  }
}

/**
 * Retorna informações do plano do usuário
 */
export function getPlanInfo(userPlan: Plan) {
  return {
    plan: userPlan,
    limits: PLAN_LIMITS[userPlan],
    displayName: userPlan === 'free' ? 'Gratuito' : userPlan === 'pro' ? 'Pro' : 'Premium',
  };
}
