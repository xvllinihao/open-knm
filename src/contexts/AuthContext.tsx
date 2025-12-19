"use client";

import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

type Tier = "free" | "pro";

type Profile = {
  id: string;
  tier: Tier;
  stripe_customer_id?: string;
  username?: string;
};

type AuthResult = {
  success: boolean;
  error?: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string, captchaToken?: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string, captchaToken?: string) => Promise<AuthResult>;
  resetPassword: (email: string, captchaToken?: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({ success: false }),
  signUpWithEmail: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  updatePassword: async () => ({ success: false }),
  signOut: async () => {},
});

// Create a single supabase instance outside component to avoid re-creation
let supabaseInstance: ReturnType<typeof createClient> | null = null;
const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const initRef = useRef(false);
  const supabase = getSupabase();
  
  // Track pending redirect to prevent state updates after navigation
  const pendingRedirectRef = useRef(false);

  // Helper to load profile
  const loadProfile = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (!pendingRedirectRef.current) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }, [supabase]);

  // Handle auth state changes
  const handleAuthChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    // Skip updates if we're about to redirect
    if (pendingRedirectRef.current) return;
    
    // Handle PASSWORD_RECOVERY event - redirect to reset password page
    if (event === 'PASSWORD_RECOVERY') {
      // Mark pending redirect to prevent further state updates
      pendingRedirectRef.current = true;
      
      // Update state before redirect
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Small delay to ensure session is fully established
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to reset password page
      const locale = window.location.pathname.startsWith('/en') ? 'en' : 'zh';
      window.location.href = `/${locale}/reset-password`;
      return;
    }
    
    // Handle SIGNED_OUT - clear state
    if (event === 'SIGNED_OUT') {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }
    
    // Update user state
    setUser(session?.user ?? null);
    setLoading(false);
    
    // Load profile for authenticated users
    if (session?.user) {
      loadProfile(session.user.id);
    } else {
      setProfile(null);
    }
  }, [loadProfile]);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initRef.current) return;
    initRef.current = true;
    
    // Reset redirect flag on mount
    pendingRedirectRef.current = false;

    // Check for auth errors in URL hash (e.g., expired OTP)
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const error = hashParams.get('error');
      const errorCode = hashParams.get('error_code');
      const errorDescription = hashParams.get('error_description');
      
      if (error || errorCode) {
        console.error('Auth error from URL:', { error, errorCode, errorDescription });
        // Clear the hash to avoid confusion
        window.history.replaceState(null, '', window.location.pathname);
        
        // Navigate to login with error
        const locale = window.location.pathname.startsWith('/en') ? 'en' : 'zh';
        const errorMsg = errorCode === 'otp_expired' 
          ? (locale === 'zh' ? '链接已过期，请重新发送重置邮件' : 'Link expired, please resend reset email')
          : (errorDescription || error || 'Unknown error');
        window.location.href = `/${locale}/login?error=${encodeURIComponent(errorMsg)}`;
        return;
      }
    }

    // Subscribe to auth state changes
    // Supabase v2 immediately fires INITIAL_SESSION event with current session
    // so we don't need a separate getSession() call
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Listen for storage events (for multi-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      // Skip if pending redirect
      if (pendingRedirectRef.current) return;
      
      // Supabase stores auth in localStorage with key starting with 'sb-'
      if (e.key?.startsWith('sb-') && e.key?.includes('-auth-token')) {
        // Auth state changed in another tab, re-fetch session
        supabase.auth.getSession().then((result: { data: { session: Session | null } }) => {
          const session = result.data.session;
          if (pendingRedirectRef.current) return;
          
          setUser(session?.user ?? null);
          if (session?.user) {
            loadProfile(session.user.id);
          } else {
            setProfile(null);
          }
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [supabase, handleAuthChange, loadProfile]);

  // Helper to get a consistent origin for auth redirects
  // In development, always use localhost to avoid cookie domain mismatches
  const getAuthOrigin = () => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    // Replace 0.0.0.0 with localhost for consistent cookie handling
    if (origin.includes('0.0.0.0')) {
      return origin.replace('0.0.0.0', 'localhost');
    }
    return origin;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getAuthOrigin()}/auth/callback`,
      },
    });
    
    if (error) {
      console.error("Google OAuth error:", error);
      // 如果 Google OAuth 未启用，显示友好提示
      if (error.message?.includes("provider is not enabled")) {
        alert("Google 登录功能尚未配置。请使用邮箱密码登录，或联系管理员启用 Google OAuth。");
      }
    }
  };

  const signInWithEmail = async (email: string, password: string, captchaToken?: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: captchaToken ? { captchaToken } : undefined,
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const signUpWithEmail = async (email: string, password: string, captchaToken?: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getAuthOrigin()}/auth/callback`,
        ...(captchaToken && { captchaToken }),
      },
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const resetPassword = async (email: string, captchaToken?: string): Promise<AuthResult> => {
    // Redirect through auth callback which handles code exchange
    // The callback will then redirect to /reset-password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getAuthOrigin()}/auth/callback?next=/reset-password`,
      ...(captchaToken && { captchaToken }),
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const updatePassword = async (newPassword: string): Promise<AuthResult> => {
    // First verify we have an active session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: "No active session" };
    }
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const signOut = async () => {
    // 立即更新本地状态
    setUser(null);
    setProfile(null);
    
    try {
      // 使用默认 scope: 'local' 快速登出
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
      }
      
      // 手动清除所有 Supabase 相关的 cookies
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name.startsWith('sb-')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
      });
      
      // 注意：不在这里做硬刷新，让调用方决定跳转行为
      // 调用方应该使用 router.push() 或 router.refresh() 
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, updatePassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

