import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserPlus, Loader2, Users, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const emailSchema = z.object({
  email: z.string().email('Email inválido'),
});

export function AdminUserManager() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePromoteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: rpcError } = await supabase.rpc('promote_to_admin', {
        user_email: email.trim().toLowerCase(),
      });

      if (rpcError) {
        console.error('RPC error:', rpcError);
        setError('Erro ao promover usuário. Tente novamente.');
        return;
      }

      if (data === false) {
        setError('Usuário não encontrado. Verifique se o email está correto e se o usuário já tem uma conta.');
        return;
      }

      setSuccess(`${email} foi promovido a administrador com sucesso!`);
      toast.success('Administrador adicionado com sucesso!');
      setEmail('');
    } catch (err) {
      console.error('Error promoting admin:', err);
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEmail('');
    setError('');
    setSuccess('');
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Users className="h-4 w-4 mr-2" />
          Gerenciar Admins
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Administrador
          </DialogTitle>
          <DialogDescription>
            Digite o email de um usuário existente para promovê-lo a administrador.
            O usuário precisa ter uma conta criada primeiro.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePromoteAdmin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email do usuário</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="usuario@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-green-500/10 text-green-700 text-sm">
              <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Fechar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Promovendo...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Promover a Admin
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>Nota:</strong> O usuário precisa ter uma conta existente. 
            Peça para ele acessar a página de login do painel administrativo 
            e criar uma conta primeiro.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
