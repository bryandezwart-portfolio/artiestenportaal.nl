import BookingsNav from "@/components/bookings/BookingsNav";
import PageTransition from "@/components/bookings/PageTransition";

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BookingsNav />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
