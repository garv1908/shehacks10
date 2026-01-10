import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import useLocationUpdater from '../hooks/useLocationUpdater';
import usePushToken from '../hooks/usePushToken';
import { getProfileByAuthId, upsertProfileForAuthUser } from '../services/profileService';
import { supabase } from '../supabaseClient';

interface AuthContextProps {
  isLoggedIn: boolean;
  needsOnboarding: boolean;
  user: any;
  login: (user: any) => void;
  logout: () => void;
  completeOnboarding: () => void;
  updateUser: (patch: Partial<any>) => void;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(true);
  const [user, setUser] = useState<any>(null);

  const login = (user: any) => {
    setIsLoggedIn(true);
    setUser(user);
    setNeedsOnboarding(user?.needs_onboarding ?? true);
  };

  const updateUser = (patch: Partial<any>) => {
    setUser((prev: any) => ({ ...(prev ?? {}), ...patch }));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setNeedsOnboarding(true);
  };

  const completeOnboarding = () => setNeedsOnboarding(false);

  // Supabase auth handlers
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const authUser = (data as any)?.user ?? (data as any);
    // try to create/update profile via service (best-effort)
    try {
      await upsertProfileForAuthUser(authUser as any, { name: (authUser as any)?.email ?? '' });
    } catch (err) {
      console.warn('Profile upsert failed', err);
    }
    login(authUser);
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const sessionUser = (data as any)?.user ?? (data as any);
    // fetch profile via service (if exists)
    try {
      const profile = await getProfileByAuthId(sessionUser.id);
      if (profile) {
        login({ ...sessionUser, ...profile });
        return;
      }
    } catch (err) {
      // ignore
    }
    login(sessionUser);
  };

  useEffect(() => {
    // Try to restore session on mount
    let mounted = true;
    (async () => {
      try {
            const {
              data: { user: currentUser },
            } = await supabase.auth.getUser();
        if (mounted && currentUser) {
          // attempt to fetch profile via service
          try {
            const profile = await getProfileByAuthId(currentUser.id);
            if (profile) login({ ...currentUser, ...profile });
            else login(currentUser);
          } catch (err) {
            login(currentUser);
          }
        }
      } catch (err) {
        // ignore
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        login(session.user);
      } else {
        logout();
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // wire push token and location updater hooks (they internally early-return if no user)
  usePushToken(user);
  useLocationUpdater(user);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, needsOnboarding, user, login, logout, completeOnboarding, updateUser, signUp, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
