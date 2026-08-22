import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const isBrowser = typeof window !== 'undefined';
  
  const url = isBrowser 
    ? (window.__ENV?.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) 
    : (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL);
    
  const key = isBrowser 
    ? (window.__ENV?.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY) 
    : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);

  if (!url || !key) {
    return createBrowserClient(
      'https://placeholder-project.supabase.co',
      'dfvnklfnvpdfnvdbdf.placeholder'
    )
  }

  return createBrowserClient(url, key)
}


