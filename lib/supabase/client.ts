import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    // 返回一个模拟客户端，避免应用崩溃
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: async () => ({ error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: new Error('Supabase not configured') }),
      },
      from: () => ({
        select: () => ({ order: () => ({ eq: () => ({ ilike: () => ({ order: () => ({}) }) }) }) }),
        insert: () => ({ select: () => ({ single: () => ({}) }) }),
        update: () => ({ eq: () => ({}) }),
        delete: () => ({ eq: () => ({}) }),
      }),
    } as any
  }
  
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
