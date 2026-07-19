import "./globals.css";

export const metadata = {
  title: "Ledger",
  description: "Royalty-overzicht voor label en artiesten",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
