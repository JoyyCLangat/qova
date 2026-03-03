import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qova -- Financial Trust Infrastructure for AI Agents",
  description:
    "The credit bureau for AI agents. Compute economic trustworthiness from transaction data.",
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
