import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Kan gebeuren wanneer dit wordt aangeroepen vanuit een Server
            // Component (bijv. app/page.tsx) zonder actieve sessie — cookies
            // mogen dan niet geschreven worden. Dit is onschadelijk zolang er
            // ook middleware draait die de sessie ververst; zonder de
            // try/catch crashte de hele pagina hierop.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Zie toelichting hierboven bij set().
          }
        },
      },
    }
  );
}
