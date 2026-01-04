import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import ForgeAdsLogo from '../components/ForgeAdsLogo';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Validações
        if (password !== confirmPassword) {
          setError('As senhas não coincidem');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres');
          setLoading(false);
          return;
        }

        const { error } = await signUp(email, password);
        if (error) throw error;

        setSuccess('Conta criada com sucesso! Verifique seu email para confirmar.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setIsSignUp(false), 2000);
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;

        // Redirecionar para dashboard
        setLocation('/dashboard');
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      setError(err.message || 'Erro ao processar sua solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B0F14] via-[#131820] to-[#0B0F14] p-4">
      <Card className="w-full max-w-md bg-[#131820] border-[#1F2937]">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <ForgeAdsLogo className="h-12 w-12" />
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta'}
            </CardTitle>
            <CardDescription className="text-[#9CA3AF]">
              {isSignUp
                ? 'Crie sua conta para começar a gerar criativos profissionais'
                : 'Entre para acessar sua conta do ForgeAds'}
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-500/10 border-green-500/50 text-green-500">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#E8EAED]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-[#1F2937] border-[#374151] text-white placeholder:text-[#6B7280]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#E8EAED]">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-[#1F2937] border-[#374151] text-white placeholder:text-[#6B7280]"
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#E8EAED]">
                  Confirmar Senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-[#1F2937] border-[#374151] text-white placeholder:text-[#6B7280]"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#1877F2] hover:bg-[#1565D8] text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : isSignUp ? (
                'Criar Conta'
              ) : (
                'Entrar'
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-[#9CA3AF]">
              {isSignUp ? (
                <>
                  Já tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-[#1877F2] hover:underline font-medium"
                    disabled={loading}
                  >
                    Fazer login
                  </button>
                </>
              ) : (
                <>
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-[#1877F2] hover:underline font-medium"
                    disabled={loading}
                  >
                    Criar conta
                  </button>
                </>
              )}
            </div>

            {!isSignUp && (
              <button
                type="button"
                onClick={() => setLocation('/forgot-password')}
                className="text-sm text-[#9CA3AF] hover:text-[#1877F2] transition-colors"
                disabled={loading}
              >
                Esqueceu sua senha?
              </button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
