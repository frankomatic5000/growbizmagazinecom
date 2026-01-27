import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session, AuthenticatorAssuranceLevels } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  mfaStatus: 'none' | 'enrolled' | 'verified';
  currentLevel: AuthenticatorAssuranceLevels | null;
  nextLevel: AuthenticatorAssuranceLevels | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshMFAStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaStatus, setMfaStatus] = useState<'none' | 'enrolled' | 'verified'>('none');
  const [currentLevel, setCurrentLevel] = useState<AuthenticatorAssuranceLevels | null>(null);
  const [nextLevel, setNextLevel] = useState<AuthenticatorAssuranceLevels | null>(null);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Error checking admin role:', err);
      return false;
    }
  };

  const checkMFAStatus = async () => {
    try {
      const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      
      if (aalError) {
        console.error('Error checking AAL:', aalError);
        return;
      }

      setCurrentLevel(aalData.currentLevel);
      setNextLevel(aalData.nextLevel);

      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
      
      if (factorsError) {
        console.error('Error listing factors:', factorsError);
        return;
      }

      const verifiedFactors = factorsData.totp.filter(f => f.status === 'verified');
      
      if (verifiedFactors.length === 0) {
        setMfaStatus('none');
      } else if (aalData.currentLevel === 'aal2') {
        setMfaStatus('verified');
      } else {
        setMfaStatus('enrolled');
      }
    } catch (err) {
      console.error('Error in checkMFAStatus:', err);
    }
  };

  const refreshMFAStatus = async () => {
    await checkMFAStatus();
  };

  useEffect(() => {
    let mounted = true;

    const checkAndSetAdmin = (userId: string) => {
      setIsLoading(true);

      setTimeout(() => {
        checkAdminRole(userId)
          .then((admin) => {
            if (!mounted) return;
            setIsAdmin(admin);
          })
          .catch(() => {
            if (!mounted) return;
            setIsAdmin(false);
          })
          .finally(() => {
            if (!mounted) return;
            setIsLoading(false);
          });
      }, 0);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        checkAndSetAdmin(currentSession.user.id);
        setTimeout(() => {
          checkMFAStatus();
        }, 0);
      } else {
        setIsAdmin(false);
        setMfaStatus('none');
        setCurrentLevel(null);
        setNextLevel(null);
        setIsLoading(false);
      }

      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setMfaStatus('none');
        setCurrentLevel(null);
        setNextLevel(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!mounted) return;

      setSession(existingSession);
      setUser(existingSession?.user ?? null);

      if (existingSession?.user) {
        checkAndSetAdmin(existingSession.user.id);
        setTimeout(() => {
          checkMFAStatus();
        }, 0);
      } else {
        setIsAdmin(false);
        setMfaStatus('none');
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setMfaStatus('none');
    setCurrentLevel(null);
    setNextLevel(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        mfaStatus,
        currentLevel,
        nextLevel,
        signIn,
        signUp,
        signOut,
        refreshMFAStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
