import { Lock, Crown, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

interface PremiumFeatureLockProps {
  featureName: string;
  description?: string;
  requiredPlan?: 'pro' | 'premium';
  className?: string;
  onUpgrade?: () => void;
}

export function PremiumFeatureLock({
  featureName,
  description,
  requiredPlan = 'premium',
  className,
  onUpgrade,
}: PremiumFeatureLockProps) {
  const planName = requiredPlan === 'premium' ? 'Premium' : 'Pro';
  const planColor = requiredPlan === 'premium' 
    ? 'from-purple-500 to-pink-500' 
    : 'from-blue-500 to-cyan-500';

  return (
    <Card className={cn('bg-[#131820] border-[#1F2937]', className)}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className={cn(
            'p-4 rounded-full bg-gradient-to-br',
            planColor,
            'bg-opacity-10'
          )}>
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-white flex items-center justify-center gap-2">
          <Crown className="h-5 w-5" />
          Funcionalidade {planName}
        </CardTitle>
        <CardDescription className="text-[#9CA3AF]">
          {description || `${featureName} está disponível apenas no plano ${planName}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-[#1F2937] p-4 rounded-lg space-y-2">
          <p className="text-sm text-white font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            Recursos do plano {planName}:
          </p>
          <ul className="text-sm text-[#9CA3AF] space-y-1 ml-6">
            {requiredPlan === 'premium' ? (
              <>
                <li>✓ Leitura automática de landing pages</li>
                <li>✓ Upload e análise de PDFs</li>
                <li>✓ Criativos e copies ilimitados</li>
                <li>✓ Geração de imagens ilimitada</li>
                <li>✓ Automação completa</li>
              </>
            ) : (
              <>
                <li>✓ 50 criativos por dia</li>
                <li>✓ 100 copies por dia</li>
                <li>✓ 30 imagens por dia</li>
                <li>✓ Suporte prioritário</li>
              </>
            )}
          </ul>
        </div>

        <Button
          onClick={onUpgrade}
          className={cn(
            'w-full bg-gradient-to-r text-white font-semibold shadow-lg hover:shadow-xl transition-all',
            planColor
          )}
        >
          <Crown className="mr-2 h-4 w-4" />
          Fazer Upgrade para {planName}
        </Button>
      </CardContent>
    </Card>
  );
}
