import BookingsNav from "@/components/bookings/BookingsNav";

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BookingsNav />
      {children}
    </>
  );
}
