export { };

declare global {
  interface Window {
    __ENV: {
      API_URL?: string;
      SUPABASE_URL?: string;
      SUPABASE_ANON_KEY?: string;
      [key: string]: string | undefined;
    };
  }
}
