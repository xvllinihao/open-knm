import { createBrowserClient } from '@supabase/ssr'
import { Session, User, AuthChangeEvent, SupabaseClient } from '@supabase/supabase-js'

// Type for the mock client to match Supabase client interface
type MockSupabaseClient = {
  auth: {
    getSession: () => Promise<{ data: { session: Session | null }; error: null }>;
    getUser: () => Promise<{ data: { user: User | null }; error: null }>;
    onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => { data: { subscription: { unsubscribe: () => void } } };
    signInWithOAuth: (options: unknown) => Promise<{ error: null }>;
    signInWithPassword: (credentials: unknown) => Promise<{ error: null }>;
    signUp: (credentials: unknown) => Promise<{ error: null }>;
    signOut: () => Promise<{ error: null }>;
    resetPasswordForEmail: (email: string, options?: unknown) => Promise<{ error: null }>;
    updateUser: (attributes: unknown) => Promise<{ data: null; error: null }>;
    refreshSession: () => Promise<{ data: { session: null }; error: null }>;
  };
  from: (table: string) => {
    select: (columns?: string) => {
      eq: (column: string, value: unknown) => {
        single: () => Promise<{ data: null; error: null }>;
      };
    };
  };
  rpc: (fn: string, params?: unknown) => Promise<{ data: null; error: null }>;
}

export function createClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // During build time or if env vars are missing, return a mock client
  // that will be replaced with the real client at runtime
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a placeholder that works during SSG
    // The real client will be created on the client side
    if (typeof window === 'undefined') {
      // Server-side during build - return minimal mock
      const mockClient: MockSupabaseClient = {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          getUser: async () => ({ data: { user: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithOAuth: async () => ({ error: null }),
          signInWithPassword: async () => ({ error: null }),
          signUp: async () => ({ error: null }),
          signOut: async () => ({ error: null }),
          resetPasswordForEmail: async () => ({ error: null }),
          updateUser: async () => ({ data: null, error: null }),
          refreshSession: async () => ({ data: { session: null }, error: null }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: null, error: null }),
            }),
          }),
        }),
        rpc: async () => ({ data: null, error: null }),
      }
      return mockClient as unknown as SupabaseClient
    }
    
    // Client-side but env vars missing - this shouldn't happen in production
    console.warn('Supabase environment variables are missing')
  }
  
  return createBrowserClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
  )
}

