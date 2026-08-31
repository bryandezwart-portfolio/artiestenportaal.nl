import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BookingsNav from "@/components/bookings/BookingsNav";
import PageTransition from "@/components/bookings/PageTransition";

export default async function BookingsLayout({ children }: { children: React.ReactNode }) {
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

  if (!admin) redirect("/artist");

  return (
    <>
      <BookingsNav />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
