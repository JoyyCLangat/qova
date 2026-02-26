import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { bodyFont, headingFont, monoFont } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
	title: "Qova - Financial Trust Infrastructure",
	description: "The financial credit bureau for AI agents",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>): React.ReactElement {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
		>
			<body className="min-h-screen antialiased">
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
