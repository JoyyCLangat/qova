import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qova - Financial Trust Infrastructure",
  description: "The financial credit bureau for AI agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-black text-white">
        {children}
      </body>
    </html>
  );
}
