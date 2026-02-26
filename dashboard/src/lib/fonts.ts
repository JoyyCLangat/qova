import { Inter, JetBrains_Mono, Sora } from "next/font/google";

export const headingFont = Sora({
	subsets: ["latin"],
	variable: "--font-heading",
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

export const bodyFont = Inter({
	subsets: ["latin"],
	variable: "--font-body",
	display: "swap",
});

export const monoFont = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
	weight: ["400", "500", "600", "700"],
});
