import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Shield, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import MFAEnroll from '@/components/admin/MFAEnroll';
import MFAVerify from '@/components/admin/MFAVerify';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const emailSchema = z.object({
  email: z.string().email('Email inválido'),
});

type AuthStep = 'login' | 'mfa-enroll' | 'mfa-verify';

export default function AdminLogin() {
  const { 
    signIn, 
    signUp, 
    user, 
    isAdmin, 
    isLoading: authLoading,
    mfaStatus,
    refreshMFAStatus
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [authStep, setAuthStep] = useState<AuthStep>('login');

  // Handle auth flow after login
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      if (mfaStatus === 'none') {
        // Admin has no MFA configured - show enrollment
        setAuthStep('mfa-enroll');
      } else if (mfaStatus === 'enrolled') {
        // MFA configured but not verified this session
        setAuthStep('mfa-verify');
      } else if (mfaStatus === 'verified') {
        // MFA verified - allow access
        navigate('/secure-content-editor-2026');
      }
    }
  }, [user, isAdmin, authLoading, mfaStatus, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (mode === 'forgot') {
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

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await signUp(email, password);
        
        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            setError('Este email já está cadastrado. Faça login.');
          } else {
            setError(signUpError.message);
          }
          return;
        }

        setSuccessMessage('Conta criada com sucesso! Um administrador precisa aprovar seu acesso.');
        toast.success('Conta criada! Aguarde aprovação de um administrador.');
        setMode('login');
        setPassword('');
        return;
      }

      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos');
        } else {
          setError(signInError.message);
        }
        return;
      }

      // After successful login, the useEffect will handle the MFA flow
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAEnrollComplete = async () => {
    await refreshMFAStatus();
    navigate('/secure-content-editor-2026');
  };

  const handleMFAVerifyComplete = async () => {
    await refreshMFAStatus();
    navigate('/secure-content-editor-2026');
  };

  const handleMFASkip = () => {
    navigate('/secure-content-editor-2026');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show MFA enrollment screen
  if (authStep === 'mfa-enroll' && user && isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <div className="w-full max-w-md">
          <div className="admin-card">
            <MFAEnroll 
              onEnrollComplete={handleMFAEnrollComplete} 
              onSkip={handleMFASkip}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show MFA verification screen
  if (authStep === 'mfa-verify' && user && isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <div className="w-full max-w-md">
          <div className="admin-card">
            <MFAVerify 
              onVerifyComplete={handleMFAVerifyComplete}
            />
          </div>
        </div>
      </div>
    );
  }

  const getTitle = () => {
    switch (mode) {
      case 'signup':
        return 'Criar Conta';
      case 'forgot':
        return 'Recuperar Senha';
      default:
        return 'Acesso Restrito';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signup':
        return 'Crie sua conta para solicitar acesso ao painel';
      case 'forgot':
        return 'Digite seu email para receber o link de recuperação';
      default:
        return 'Entre com suas credenciais de administrador';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="admin-card">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-center">{getTitle()}</h1>
            <p className="text-muted-foreground text-center mt-2">
              {getDescription()}
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

            {mode !== 'forgot' && (
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
                {mode === 'signup' && (
                  <p className="text-xs text-muted-foreground">
                    Mínimo de 6 caracteres
                  </p>
                )}
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
                  {mode === 'forgot' ? 'Enviando...' : mode === 'signup' ? 'Criando...' : 'Entrando...'}
                </>
              ) : mode === 'forgot' ? (
                'Enviar Link de Recuperação'
              ) : mode === 'signup' ? (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Criar Conta
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            <div className="flex flex-col gap-2 text-center">
              {mode === 'login' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Não tem conta? Cadastre-se
                  </button>
                </>
              )}
              {mode !== 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Voltar para o login
                </button>
              )}
            </div>
          </form>

          {mode === 'signup' && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Após criar sua conta, um administrador precisará aprovar seu acesso.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
