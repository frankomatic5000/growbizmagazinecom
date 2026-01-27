import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const emailSchema = z.object({
  email: z.string().email('Email inválido'),
});

export default function AdminLogin() {
  const { signIn, user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Redirect if already authenticated and is admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/secure-content-editor-2026');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (isForgotPassword) {
      // Validate email only
      const validation = emailSchema.safeParse({ email });
      if (!validation.success) {
        setError(validation.error.errors[0].message);
        return;
      }

      setIsLoading(true);

      try {
        const redirectUrl = `${window.location.origin}/secure-content-editor-2026/login`;
        
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });

        if (resetError) {
          setError(resetError.message);
          return;
        }

        setSuccessMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
        setEmail('');
      } catch (err) {
        setError('Ocorreu um erro. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Validate input for login
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos');
        } else {
          setError(signInError.message);
        }
        return;
      }

      navigate('/secure-content-editor-2026');
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="admin-card">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-center">
              {isForgotPassword ? 'Recuperar Senha' : 'Acesso Restrito'}
            </h1>
            <p className="text-muted-foreground text-center mt-2">
              {isForgotPassword
                ? 'Digite seu email para receber o link de recuperação'
                : 'Entre com suas credenciais de administrador'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                required
              />
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input"
                  required
                />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-md bg-primary/10 text-primary text-sm">
                {successMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isForgotPassword ? 'Enviando...' : 'Entrando...'}
                </>
              ) : isForgotPassword ? (
                'Enviar Link de Recuperação'
              ) : (
                'Entrar'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(!isForgotPassword);
                  setError('');
                  setSuccessMessage('');
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isForgotPassword
                  ? 'Voltar para o login'
                  : 'Esqueci minha senha'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
