import { DM_Sans, JetBrains_Mono } from "next/font/google";

export const headingFont = DM_Sans({
	subsets: ["latin"],
	variable: "--font-heading",
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

export const bodyFont = DM_Sans({
	subsets: ["latin"],
	variable: "--font-body",
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

export const monoFont = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
	weight: ["400", "500", "600", "700"],
});
