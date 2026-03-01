import { LogoMark } from "@/components/brand/logo-mark";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>): React.ReactElement {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background">
			<div className="mb-8 flex items-center gap-3">
				<LogoMark className="h-8 w-auto" />
				<span className="text-2xl font-semibold tracking-tight">Qova</span>
			</div>
			<div className="w-full max-w-md px-4">{children}</div>
			<p className="mt-8 text-sm text-muted-foreground">
				On-chain reputation for autonomous agents
			</p>
		</div>
	);
}
