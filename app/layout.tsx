import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Department of Justice - Portail",
  description: "Portail DOJ RP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
