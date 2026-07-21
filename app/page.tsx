import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: admin } = await supabase
    .from("label_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  redirect(admin ? "/dashboard" : "/artist");
}
