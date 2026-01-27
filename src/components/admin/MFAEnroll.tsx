import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, Smartphone, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface MFAEnrollProps {
  onEnrollComplete: () => void;
  onSkip?: () => void;
}

export default function MFAEnroll({ onEnrollComplete, onSkip }: MFAEnrollProps) {
  const [factorId, setFactorId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEnroll = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Autenticador Admin',
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data) {
        setFactorId(data.id);
        setQrCode(data.totp.qr_code);
        setSecret(data.totp.secret);
      }
    } catch (err) {
      setError('Erro ao configurar 2FA. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verifyCode.length !== 6) {
      setError('O código deve ter 6 dígitos');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      
      if (challenge.error) {
        setError(challenge.error.message);
        return;
      }

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: verifyCode,
      });

      if (verify.error) {
        setError('Código inválido. Verifique e tente novamente.');
        return;
      }

      toast.success('2FA configurado com sucesso!');
      onEnrollComplete();
    } catch (err) {
      setError('Erro ao verificar código. Tente novamente.');
    } finally {
      setIsVerifying(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    toast.success('Código copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!qrCode) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Configurar Autenticação de Dois Fatores</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Adicione uma camada extra de segurança à sua conta usando um aplicativo autenticador.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Smartphone className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">Você precisará de um app autenticador</p>
              <p className="text-xs text-muted-foreground">
                Google Authenticator, Authy ou Microsoft Authenticator
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button onClick={handleEnroll} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Configurando...
              </>
            ) : (
              'Configurar 2FA'
            )}
          </Button>
          {onSkip && (
            <Button variant="ghost" onClick={onSkip} className="w-full">
              Configurar depois
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Escanear QR Code</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Use seu app autenticador para escanear o código abaixo
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg">
          <img src={qrCode} alt="QR Code para autenticador" width={180} height={180} />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          Ou insira este código manualmente:
        </Label>
        <div className="flex gap-2">
          <Input
            value={secret}
            readOnly
            className="font-mono text-xs"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={copySecret}
            className="shrink-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="verifyCode">Código de verificação</Label>
        <Input
          id="verifyCode"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="000000"
          value={verifyCode}
          onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
          className="text-center text-2xl tracking-widest font-mono"
        />
        <p className="text-xs text-muted-foreground text-center">
          Digite o código de 6 dígitos do seu app
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

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
          'Verificar e Ativar'
        )}
      </Button>
    </div>
  );
}
