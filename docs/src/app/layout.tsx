import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qova Docs",
  description: "Documentation for Qova trust infrastructure SDK and API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
