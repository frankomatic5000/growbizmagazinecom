import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Shield, UserPlus, Mail } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const emailSchema = z.object({
  email: z.string().email('Email inválido'),
});

type AuthStep = 'login' | 'email-verify';

export default function AdminLogin() {
  const { signIn, signUp, user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [authStep, setAuthStep] = useState<AuthStep>('login');
  const [pendingEmail, setPendingEmail] = useState('');

  // Check for email verification session
  useEffect(() => {
    const verifiedSession = sessionStorage.getItem('admin_email_verified');
    if (!authLoading && user && isAdmin) {
      if (verifiedSession === 'true') {
        navigate('/secure-content-editor-2026');
      } else {
        // Need email verification
        setAuthStep('email-verify');
        setPendingEmail(user.email || '');
        sendVerificationEmail(user.email || '');
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const sendVerificationEmail = async (emailAddress: string) => {
    try {
      // Use Supabase's magic link as email verification
      await supabase.auth.signInWithOtp({
        email: emailAddress,
        options: {
          shouldCreateUser: false,
        },
      });
      toast.success('Código de verificação enviado para seu email!');
    } catch (err) {
      console.error('Error sending verification:', err);
    }
  };

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

      // After successful login, the useEffect will handle the email verification flow
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (verificationCode.length !== 6) {
      setError('O código deve ter 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token: verificationCode,
        type: 'email',
      });

      if (verifyError) {
        setError('Código inválido ou expirado. Tente novamente.');
        return;
      }

      // Mark session as verified
      sessionStorage.setItem('admin_email_verified', 'true');
      toast.success('Verificação concluída!');
      navigate('/secure-content-editor-2026');
    } catch (err) {
      setError('Erro ao verificar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await sendVerificationEmail(pendingEmail);
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

  // Email verification step
  if (authStep === 'email-verify' && user && isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <div className="w-full max-w-md">
          <div className="admin-card">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-center">Verificação por Email</h1>
              <p className="text-muted-foreground text-center mt-2">
                Enviamos um código de 6 dígitos para
              </p>
              <p className="font-medium text-center">{pendingEmail}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Código de Verificação</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-3xl tracking-[0.5em] font-mono h-14"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              <Button
                onClick={handleVerifyEmail}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar'
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Reenviar código
                </button>
              </div>
            </div>
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
