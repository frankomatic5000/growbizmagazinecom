import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Shield, UserPlus, Mail, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const emailSchema = z.object({
  email: z.string().email('Email inválido'),
});

type AuthStep = 'login' | 'email-verify' | 'forgot-code' | 'new-password';

export default function AdminLogin() {
  const { signIn, signUp, user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
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
        sendVerificationCode(user.id, user.email || '');
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const sendVerificationCode = async (userId: string, emailAddress: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-admin-code', {
        body: { userId, email: emailAddress },
      });

      if (error) {
        console.error('Error sending verification code:', error);
        toast.error('Erro ao enviar código. Tente novamente.');
        return;
      }

      toast.success('Código de verificação enviado para seu email!');
    } catch (err) {
      console.error('Error sending verification:', err);
      toast.error('Erro ao enviar código.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

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

  const handleForgotPassword = async () => {
    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('send-password-reset-code', {
        body: { email },
      });

      if (error) {
        console.error('Error sending reset code:', error);
        setError('Erro ao enviar código. Tente novamente.');
        return;
      }

      setPendingEmail(email);
      setAuthStep('forgot-code');
      toast.success('Código enviado para seu email!');
    } catch (err) {
      console.error('Error:', err);
      setError('Erro ao enviar código.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyResetCode = async () => {
    if (verificationCode.length !== 6) {
      setError('O código deve ter 6 dígitos');
      return;
    }

    // Just move to password step - we'll verify the code when setting the password
    setError('');
    setAuthStep('new-password');
  };

  const handleSetNewPassword = async () => {
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('reset-password-with-code', {
        body: { 
          email: pendingEmail, 
          code: verificationCode,
          newPassword: newPassword
        },
      });

      if (error || !data?.success) {
        setError(data?.error || 'Código inválido ou expirado. Tente novamente.');
        setAuthStep('forgot-code');
        return;
      }

      toast.success('Senha alterada com sucesso!');
      setAuthStep('login');
      setVerificationCode('');
      setNewPassword('');
      setConfirmPassword('');
      setEmail(pendingEmail);
    } catch (err) {
      setError('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (verificationCode.length !== 6) {
      setError('O código deve ter 6 dígitos');
      return;
    }

    if (!user) {
      setError('Sessão expirada. Faça login novamente.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error: verifyError } = await supabase.functions.invoke('verify-admin-code', {
        body: { 
          userId: user.id, 
          email: pendingEmail, 
          code: verificationCode 
        },
      });

      if (verifyError || !data?.valid) {
        setError(data?.error || 'Código inválido ou expirado. Tente novamente.');
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
    if (!user) return;
    setIsLoading(true);
    try {
      await sendVerificationCode(user.id, pendingEmail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendResetCode = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-password-reset-code', {
        body: { email: pendingEmail },
      });

      if (error) {
        toast.error('Erro ao reenviar código.');
        return;
      }

      toast.success('Código reenviado!');
    } catch (err) {
      toast.error('Erro ao reenviar código.');
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

  // New password step
  if (authStep === 'new-password') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <div className="w-full max-w-md">
          <div className="admin-card">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <KeyRound className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-center">Nova Senha</h1>
              <p className="text-muted-foreground text-center mt-2">
                Digite sua nova senha
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="admin-input"
                />
                <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="admin-input"
                />
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSetNewPassword}
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  'Alterar Senha'
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('login');
                    setVerificationCode('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setError('');
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Voltar para o login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Forgot password code verification step
  if (authStep === 'forgot-code') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <div className="w-full max-w-md">
          <div className="admin-card">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-center">Verificar Código</h1>
              <p className="text-muted-foreground text-center mt-2">
                Enviamos um código de 6 dígitos para
              </p>
              <p className="font-medium text-center">{pendingEmail}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetCode">Código de Verificação</Label>
                <Input
                  id="resetCode"
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
                onClick={handleVerifyResetCode}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Continuar'
                )}
              </Button>

              <div className="flex flex-col gap-2 text-center">
                <button
                  type="button"
                  onClick={handleResendResetCode}
                  disabled={isLoading}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Reenviar código
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('login');
                    setVerificationCode('');
                    setError('');
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Voltar para o login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Email verification step (2FA for admin login)
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
    return mode === 'signup' ? 'Criar Conta' : 'Acesso Restrito';
  };

  const getDescription = () => {
    return mode === 'signup' 
      ? 'Crie sua conta para solicitar acesso ao painel' 
      : 'Entre com suas credenciais de administrador';
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
                  {mode === 'signup' ? 'Criando...' : 'Entrando...'}
                </>
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
                    onClick={handleForgotPassword}
                    disabled={isLoading}
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
              {mode === 'signup' && (
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
