import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck } from 'lucide-react';

interface MFAVerifyProps {
  onVerifyComplete: () => void;
  onCancel?: () => void;
}

export default function MFAVerify({ onVerifyComplete, onCancel }: MFAVerifyProps) {
  const [verifyCode, setVerifyCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (verifyCode.length !== 6) {
      setError('O código deve ter 6 dígitos');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const factors = await supabase.auth.mfa.listFactors();
      
      if (factors.error) {
        setError('Erro ao buscar fatores de autenticação');
        return;
      }

      const totpFactor = factors.data.totp[0];
      
      if (!totpFactor) {
        setError('Nenhum fator TOTP encontrado');
        return;
      }

      const challenge = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      });

      if (challenge.error) {
        setError(challenge.error.message);
        return;
      }

      const verify = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.data.id,
        code: verifyCode,
      });

      if (verify.error) {
        setError('Código inválido. Verifique e tente novamente.');
        return;
      }

      onVerifyComplete();
    } catch (err) {
      setError('Erro ao verificar código. Tente novamente.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && verifyCode.length === 6) {
      handleVerify();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold">Verificação de Dois Fatores</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Digite o código de 6 dígitos do seu aplicativo autenticador
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mfaCode" className="sr-only">Código de verificação</Label>
        <Input
          id="mfaCode"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="000000"
          value={verifyCode}
          onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
          onKeyDown={handleKeyDown}
          className="text-center text-3xl tracking-[0.5em] font-mono h-14"
          autoFocus
        />
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Button 
          onClick={handleVerify} 
          disabled={isVerifying || verifyCode.length !== 6}
          className="w-full"
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            'Verificar'
          )}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} className="w-full">
            Cancelar
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Abra o Google Authenticator, Authy ou outro app autenticador para obter o código
      </p>
    </div>
  );
}
